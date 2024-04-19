const fs = require('fs')
const koa = require('koa')
const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const jwtAuth = require('koa-jwt')
const bouncer = require('koa-bouncer')
const captcha = require('trek-captcha')

const app = new koa()
const router = new Router()

const secret = 'yzw_123456789_wzy'
// 登录、token方式
router.post('/login-jwt', async (ctx) => {
  let userForm = ctx.request.body

  try {
    ctx
      .validateBody('username')
      .required('用户名是必传参')
      .isString()
      .trim()
      .isLength(1, 6, '用户名必须是1-6位')
  } catch (err) {
    if (err instanceof bouncer.ValidationError) {
      ctx.status = 400
      ctx.body = {
        code: '200',
        msg: '校验失败:' + err.message,
      }
      return
    }
    throw err
  }

  // 生成token
  let token = jwt.sign(
    {
      data: { username: userForm.username }, // 不要用敏感信息
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 过期时间、1h后失效
    },
    secret
  )

  if (token) {
    ctx.body = {
      code: '200',
      userInfo: { username: userForm.username },
      token,
      msg: '登录成功',
    }
  }
})

// 获取用户信息、需要token鉴权
router.get(
  '/getUser-jwt',
  jwtAuth({
    secret,
  }),
  (ctx) => {
    ctx.body = {
      code: '200',
      userInfo: ctx.state.user.data,
      msg: '获取用户信息成功',
    }
  }
)

// 登录、session
router.post('/login-session', async (ctx) => {
  const userInfo = ctx.request.body
  ctx.session.userInfo = userInfo.username
  ctx.body = {
    code: '200',
    msg: '登录成功',
  }
})

// 获取用户信息、需要session鉴权
router.get('/getUser-session', require('../middleware/auth'), async (ctx) => {
  ctx.body = {
    code: '200',
    userInfo: ctx.session.userInfo,
    msg: '获取用户信息成功',
  }
})

// 退出登录(session鉴权方式)
router.post('/loginOut-session', async (ctx) => {
  if (ctx.session.userInfo) {
    delete ctx.session.userInfo
  }
  ctx.body = {
    code: '200',
    msg: '退出登录成功',
  }
})

// 获取图形验证码
router.get('/getCaptcha', async (ctx) => {
  // token的作用：前端根据图片验证码输入的验证码和这个token比对
  const { token, buffer } = await captcha({ size: 4 })

  fs.createWriteStream('./public/code.gif')
    .on('finish', () => console.log('图形验证码：', token))
    .end(buffer)

  ctx.body = {
    code: '200',
    data: `http://localhost:3000/code.gif`,
    token,
    msg: '获取图形验证码成功',
  }
})

module.exports = router
