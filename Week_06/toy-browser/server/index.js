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
      console.log('body', body)
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(
        res.end(
          `<html maaa="a">
        <head>
            <style>
                body div img#myid.hello {
                    width: 100px;
                    background-color:#ff5000;
                }
                body div img {
                    width: 30px;
                    background-color:#ff1111;
                }
            </style>
            <body>
                <div>
                    <img id="myid" class="hello"/>
                    <img />
                    <img class="hi yes"/>
                </div>
            </body>
        </head>
        </html>
        `,
        ),
      )
    })
})
server.listen(8000)
console.log('server start')
