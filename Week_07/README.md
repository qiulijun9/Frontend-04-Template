https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction?hl=zh-cn

# http 解析

1. url(http) ---> html

2. html ---> dom

3. dom ---> with css dom

4. with css dom ---> dom width position

5. dom ---> 渲染

## 从 http 获取 html

1. 定义 Request,通过 net 建立 tcp 连接，向服务端发出请求。send()
2. 通过 ResponseParser 解析,并返回
   解析 headers, tostring()
   解析 body:设置'Transfer-Encoding' 为 'chunked'的响应形式
   格式为：chunk 长度+ \r\n + 内容

## html 解析成 dom

1. ParseHTML
   对接收的 html 进行词法分析，解析成 Token
   把解析好的 Token 通过栈的方式来解析成 dom 树
