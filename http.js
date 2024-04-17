// node http服务
const http = require('http')
const fs = require('fs')
const path = require('path')

const server = http.createServer((req, res) => {
  const { url, method } = req
  if (url === '/' && method == 'GET') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) throw err
      res.StatusCode = 200
      res.setHeader('Content-Type', 'text/html')
      res.end(data)
    })
  } else if (url === '/user' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(
      JSON.stringify({
        name: 'yzw',
      })
    )
  }
})

server.listen(3000, () => {
  console.log('服务已启动port：http://localhost:3000/')
})
