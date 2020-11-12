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
    .on('end', () => {
      body = Buffer.concat(body).toString()
      console.log('body', body)
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(
        `<html lang="en">
          <head>
              <style>
                 body{
                  background-color:rgb(0,0,0);
                 }
                  body div img {
                    width: 30px;
                    height: 100px;
                    background-color:rgb(123,104,238);
                  }
                  #container {
                    width: 500px;
                    height: 300px;
                    display: flex;
                    flex-direction:row;
                    flex-wrap:wrap;
                    background-color: rgb(255,255,255);
                  }

                  #container .hello {
                    background-color: rgb(0,205,205);
                  }

                  #container #myid {
                    width: 200px;
                    height: 100px;
                    background-color: rgb(135,185,100);
                  }
                 
                  .btn {
                      flex: 1;
                      height:100px;
                      background-color:rgb(237,145,33);
                  }
                  .foo{
                    width:400px;
                    height:100px;
                    background-color:rgb(255,215,0)
                  }
              </style>
              <body>
                  <div id="container">
                    <img />
                    <div id="myid" class="hello"></div>
                    <div class="btn"></div>
                    <div class="foo"></div>
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
