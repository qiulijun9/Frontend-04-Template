import http from 'http'

// 创建http 服务器
const server = http.createServer((req, res) => {
  let body = []
  req
    .on('error', err => {
      console.log(err)
    })
    .on('data', chunk => {
      body.push(chunk)
    })
    .on('close', function () {
      console.log('客户端连接断开')
    })
    .on('end', () => {
      body = Buffer.concat(body).toString()
      console.log('body', body)
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(
        `<html lang="en">
        <head>
            <style>
                body div img#myid.hello {
                    width: 100px;
                    background-color:#fff;
                }
                body div img {
                    width: 30px;
                    background-color:#eee;
                }
            </style>
            <body>
                <div>
                    <img id="myid" class="hello"/>
                    <img />
                    <img class="hi yes"/>
                    <div id="mydiv" width="200px"></div>
                </div>
            </body>
        </head>
        </html>
        `,
      )
    })
})
server.listen(8000)
console.log('server start')
