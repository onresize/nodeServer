const fs = require('fs')
const path = require('path')
const http = require('http')
const { Server } = require('socket.io')

const server = http.createServer((req, res) => {
  // 设置跨域响应头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, Content-Type'
  )

  const { url, method } = req
  if (url === '/' && method === 'GET') {
    fs.readFile(path.join(__dirname, 'public/socket-test.html'), (err, data) => {
      if (err) throw err
      res.StatusCode = 200
      res.setHeader('Content-Type', 'text/html')
      res.end(data)
    })
  }
})

//创建websocket服务器
const io = new Server(5000, {
  pingTimeout: 10e3, // 设置超时时间为 10 秒
  cors: {
    origin: '*', //配置跨域
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
})
let userList = []

//监听事件
io.on('connection', (socket) => {
  console.log('a user connected')
  const username = socket.handshake.query.username
  if (!username) return

  const userinfo = userList.find((user) => user.username === username)

  if (userinfo) {
    //存在
    userinfo.id = socket.id
  } else {
    userList.push({
      id: socket.id,
      username,
    })
  }
  console.log(userList)
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  //发送事件
  io.emit('userList', userList)

  //监听单聊接收消息的对象
  socket.on('perSonSendMessage', (data) => {
    const targetSocket = io.sockets.sockets.get(data.id)
    const targetUser = userList.find((user) => user.id === data.id)
    if (targetSocket) {
      targetSocket.emit('receiveMessage', {
        sendForm: data.sendForm,
        toUser: targetUser.username,
        message: data.message,
        date: new Date().getTime(),
      })
    }
  })
  //监听群聊接收消息的对象
  socket.on('roomSendMessage', (data) => {
    // 广播给所有人
    io.emit('roomReceiveMessage', {
      sendForm: data.sendForm,
      message: data.message,
    })
  })
  //监听断开连接的信息
  socket.on('close', (username) => {
    userList = userList.filter((user) => user.username !== username)
    console.log(userList)
    io.emit('userList', userList)
  })
  //监听谁正在输入的事件
  socket.on('typing', (data) => {
    const targetSocket = io.sockets.sockets.get(data.id)
    if (targetSocket) {
      targetSocket.emit('receiveTyping', data)
    }
  })
  //监听停止输入的事件
  socket.on('stopTyping', (id) => {
    const targetSocket = io.sockets.sockets.get(id)
    if (targetSocket) {
      targetSocket.emit('receiveStopTyping')
    }
  })
})

server.listen(3000, () => {
  console.log('socket服务已启动：http://localhost:5000/')
  console.log('页面访问：http://localhost:3000/')
})
