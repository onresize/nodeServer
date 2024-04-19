const fs = require('fs')
const path = require('path')

// 删除文件方法
const del = (src) => {
  fs.unlink(src, (err) => {
    if (err) throw err
    console.log('成功删除：' + src)
  })
}

fs.readdir('logger/logs/', (err, files) => {
  files.forEach((filename) => {
    let src = path.join('logger/logs/', filename)
    filename.includes('.log') && del(src)
  })
})
