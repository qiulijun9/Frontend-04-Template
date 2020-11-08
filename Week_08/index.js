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
                body div img #myimg {
                    width: 100px;
                    background-color:#fff;
                }
                body div img{
                    width: 30px;
                    background-color:#eee;
                }
                .hi{
                  background-color:red;
                }
                #mydiv{
                  width:200px;
                  background-color:blue;
                }
                .hello{
                  background-color:yellow;
                }
            </style>
            <body>
                <div>
                    <img id="myimg" />
                    <img />
                    <img class="hi" />
                    <div style="height:50px; width:50px;" id="mydiv" class="hello" >123</div>
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
