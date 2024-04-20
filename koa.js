// node koa服务
const koa = require('koa')
const log = require('koa-logger')
const static = require('koa-static')
const onerror = require('koa-onerror')
const session = require('koa-session')
const bouncer = require('koa-bouncer')
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const router = require('./routes')
const app = new koa()

app.use(bouncer.middleware()) // bouncer校验

// 使用中间件设置协商缓存
app.use(conditional());
app.use(etag());

app.keys = ['some secret hurr']
const SESSION_CONFIG = {
  key: 'yzw', // 设置cookie的key名字
  maxAge: 86400000, // 有效期、默认一天
  httpOnly: true, // 仅服务端修改
  signed: true, // 前面cookie
}
app.use(session(SESSION_CONFIG, app))

const { accessLogger, logger } = require('./logger')
app.use(log()) // 终端控制台日志输出
onerror(app) // 错误处理中间件
app.use(accessLogger()) // 日志记录本地持久化

app.on('error', (err) => {
  logger.error(err) // 利用logger.error将错误本地持久化
})

// app.use((ctx, next) => {
//   ctx.body = {
//     name: 'yzw',
//   }
//   next() // 执行下一个中间件
// })

// app.use((ctx, next) => {
//   if (ctx.url === '/html') {
//     ctx.body = `你的名字是${ctx.body.name}`
//   }
// })

const intercept = require('./middleware/intercept')
app.use(intercept) // 请求拦截中间件

// 静态服务
app.use(static(__dirname + '/public'))
app.use(require('koa-bodyparser')())
app.use(require('koa2-cors')())
app.use(router.routes()).use(router.allowedMethods())
app.listen(3000, () => {
  console.log('koa服务已启动port：http://localhost:3000/')
})
