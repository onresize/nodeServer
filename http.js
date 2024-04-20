// node http服务
const fs = require('fs')
const path = require('path')
const http = require('http')
const etag = require('etag')

const server = http.createServer((req, res) => {
  const { url, method } = req
  // 设置跨域响应头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, Content-Type'
  )

  if (url === '/' && method == 'GET') {
    fs.readFile(path.join(__dirname, 'public/index.html'), (err, data) => {
      if (err) throw err
      res.StatusCode = 200
      res.setHeader('Content-Type', 'text/html')
      res.end(data)
    })
  } else if (url === '/hello' && method === 'GET') {
    // 强缓存
    // res.writeHead(200, { 'Cache-Control': 'max-age=100' })
    // or
    // res.setHeader('Cache-Control', 'max-age=100')

    // 协商缓存
    const etagValue = etag('test123')
    res.setHeader('ETag', etagValue)

    // 检查是否命中缓存
    if (req.headers['if-none-match'] === etagValue) {
      res.writeHead(304, 'Not Modified')
      res.end()
    } else {
      // 发送响应数据
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end(
        JSON.stringify({
          name: 'hello',
        })
      )
    }
  }
})

server.listen(3000, () => {
  console.log('http服务已启动port：http://localhost:3000/')
})
