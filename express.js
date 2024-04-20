const fs = require('fs')
const path = require('path')
const etag = require('etag')
const express = require('express')
const app = express()

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Credentials', 'true') // 允许跨域携带凭证
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  // 中文乱码解决
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})


app.use(express.static('public'))

app.get('/hello', (req, res) => {
  const content = 'Hello, world!'
  const hash = etag(content)

  // XXX强度缓存
  res.setHeader('Cache-Control', 'max-age=100')
  res.send(content)

  // XXX协商缓存
  // res.set({
  //   ETag: hash,
  //   'Cache-Control': 'no-cache',
  // })

  // if (req.headers['if-none-match'] === hash) {
  //   res.status(304).end()
  // } else {
  //   res.send(content)
  // }
})

app.listen(3000, () => {
  console.log('express服务已启动port：http://localhost:3000/')
})
