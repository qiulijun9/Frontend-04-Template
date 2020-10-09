ISO 七层网络模型
物理层
数据链路层
网络层
传输层 （tcp 协议 host,ip 协议 port)
(http 协议 Method,path)
会话层
表示层
应用层

tcp:
通过流来进行传输

http:
由 客户端发送 request 再由服务端响应 response
http 协议是文本型的协议，传输的内容都为字符

Requset Line: post/http/1.1

Method:
GET（SELECT）：从服务器取出资源（一项或多项）。通过地址栏访问
POST（CREATE）：在服务器新建一个资源。表单传值访问
PUT（UPDATE）：在服务器更新资源（客户端提供改变后的完整资源）。
PATCH（UPDATE）：在服务器更新资源（客户端提供改变的属性）。
DELETE（DELETE）：从服务器删除资源。
HEAD：获取资源的元数据。和 get 方法相似只返回请求头，不返回请求体
OPTIONS：获取信息，关于资源的哪些属性是客户端可以改变的。 一般用于调试

Headers:(包含多行，每行由 key 和 value )
key:value
eg:Content-Type:text/html
以空格结束

body:由 Content-Type 来决定用什么格式,不同的 Content-Type 影响 body 的格式

## response 响应格式：

status line:
http/1.1 200 OK
heders:
Content-Type:text/html
Date:Mon,23 Dec 2019
Connection:keep-alive
Transfer-Encoding:chunked

body:

<html><body>hello world</body></html>

http 状态码
