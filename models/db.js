const Mongoose = require('mongoose')

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/react-admin'
console.log('连接地址：', mongoUrl)
Mongoose.connect(mongoUrl)

Mongoose.connection.on('error', (err) => {
  console.log('连接数据库失败...', err)
})

Mongoose.connection.on('connected', () => {
  console.log('连接数据库成功...')
})

module.exports = Mongoose
