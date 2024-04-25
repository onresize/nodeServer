const fs = require('fs')
const Koa = require('koa')
const router = require('koa-router')()
const KoaSSEStream = require('koa-sse-stream') // 封装好的 SSE 中间件
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const app = new Koa()

const { getNewDate, getLocalIP } = require('./utils/index')

app.use(cors())
app.use(bodyParser())

// 连接池
let clientList = []
let timer = null
// koa-sse-stream 配置
const SSE_CONF = {
  maxClients: 2, // 最大连接数
  pingInterval: 40000, // 重连时间
}

router.get('/', (ctx) => {
  ctx.type = 'html'
  ctx.body = fs.createReadStream('./public/sse.html')
})

router.get('/api/push', KoaSSEStream(SSE_CONF), (ctx) => {
  // 每次连接会进行一个 push
  clientList.push(ctx.sse)

  // 返回ipv4地址
  ctx.sse.send(`${getLocalIP()}`)
})

router.get('/api/connect', (ctx) => {
  try {
    // 先响应
    ctx.body = {
      msg: '扫码登录成功、服务端开始推送前端消息',
    }
    // 推送信息
    buildProject()
  } catch (error) {
    ctx.body = {
      msg: error,
    }
  }
})

router.get('/api/close', (ctx) => {
  ctx.body = {
    msg: '关闭连接',
  }
})

let count = 0
const buildProject = async (projectPath) => {
  messagePush('扫码登录成功🌲🌲🌲')
  setInterval(() => {
    messagePush(count++)
  }, 3e3)
}

/**
 * 消息推送
 * @param {String} content 需要推送的内容
 */
const messagePush = (content) => {
  clientList.forEach((sse) => sse.send(`【${getNewDate()}】--> ${content}`))
}

app.use(router.routes())
app.listen(3000, () => {
  console.log('正在监听端口: http://localhost:3000/')
})
