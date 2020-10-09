const http = require('http')

// 创建http 服务器
const server = http.createServer((req, res) => {
  let body = []
  req
    .on('error', err => {
      console.log(err)
    })
    .on('data', chunk => {
      body.push(chunk.toString())
    })
    .on('end', () => {
      body = Buffer.concat(body).toString()
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end('End')
    })
})
server.listen(8000)
console.log('server start')
