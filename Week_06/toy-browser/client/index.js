const net = require('net')
const parser = require('./parser')

// http 请求
/**
 * 使用：
 * let request = new Request(
   {
    method: 'POST',
    host: '127.0.0.1',
    port: '8000',
    path: '/',
    headers: {
      ['x-hello']: 'world',
    },
    body: {
      name: 'hello',
    },
  })
  const response = await request.send() 返回一个promise ,获取响应的内容
 1.定义一个Request 类
 2.接收options 中的参数，根据不同的header 返回不同的body（body格式 key:value），但是header 必须存在
 3. 编写send函数
   返回一个promise，从ResponseParser 中获取信息，并返回
 * 
 */
class Request {
  constructor(options) {
    this.method = options.method || 'Get'
    this.port = options.port || '80'
    this.host = options.host
    this.path = options.path || '/'
    this.body = options.body || {}
    this.headers = options.headers || {}

    //  根据Content-Type 处理不同的 bodyText，必须要有一个'Content-Type'
    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body)
    }

    if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.keys(this.body)
        .map(key => `${key}=${encodeURIComponent(this.body[key])}`)
        .join('&')
    }

    this.headers['Content-Length'] = this.bodyText.length
  }
  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser()
      if (connection) {
        // 有tcp链接使用,发送数据
        connection.write(this.toString())
      } else {
        // 创建新的tcp链接
        connection = net.createConnection(
          {
            host: this.host,
            port: this.port,
          },
          () => {
            connection.write(this.toString())
            console.log(this.toString())
          },
        )
      }
      // 监听data
      connection.on('data', data => {
        parser.receive(data.toString())
        console.log(888, data.toString())
        if (parser.isFinished) {
          resolve(data.toString())
          connection.end()
        }
      })
      connection.on('error', err => {
        console.log(err)
        reject(err)
        connection.end()
      })
      resolve('')
    })
  }

  /**
   * 构造http 请求文本
   * header 每行通过\r\n分隔
   * 最后要有空行代表header 结束, \r\r
   * 多行字符串一定要注意格式，不能有任何多余的空白，不然就会请求失败
   */

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers)
  .map(key => `${key}: ${this.headers[key]}`)
  .join('\r\n')}\r
\r
${this.bodyText}`
  }
}

// 根据逐步接受resonse 文本进行分析 http response
/**
  #  reponse 格式：   
   status line：   http版本号，http 状态码
   http/1.1 200       
   heders:
   Content-Type:text/html
   Date:Mon,23 Dec 2019
   Connection:keep-alive
   Transfer-Encoding:chunked
  eg:
   POST / HTTP/1.1
   x-hello: world
   Content-Type: application/x-www-form-urlencoded

   Content-Length: 10

   WAITING_STATUS_LINE--->WAITING_STATUS_LINE_END--->WAITING_HEADER_NAME--->WAITING_HEADER_SPACE---> WAITING_HEADER_VALUE--->WAITING_HEADER_LINE_END --->WAITING_HEADER_BLOCK_END--->WAITING_BODY
 * 
 */
class ResponseParser {
  constructor() {
    //定义状态机

    this.current = this.WAITING_STATUS_LINE
    this.statusLine = ''
    this.headers = {}
    this.headerName = ''
    this.headerValue = ''
    this.bodyParse = null
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished
  }

  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join(''), // 连接字符
    }
  }
  receive(str) {
    for (let i = 0; i < str.length; i++) {
      this.receiveChar(str.charAt(i))
    }
  }

  WAITING_STATUS_LINE(c) {
    if (c === '\r') {
      return this.WAITING_HEADER_LINE_END
    }
    this.statusLine += c
    return WAITING_STATUS_LINE
  }

  WAITING_HEADER_LINE_END(c) {
    if (c === '\n') {
      return this.WAITING_HEADER_NAME
    }
    return this.ERROR(c)
  }

  WAITING_HEADER_NAME(c) {
    if (c === ' : ') {
      return this.WAITING_HEADER_SPACE
    }

    // \r 空行，header 解析完成
    if (c === '\r') {
      //根据chunked 格式设置bodyparse
      if (this.headers['Transfer-Encoding'] === 'chunked') {
        this.bodyParse = new TrunkedBodyParser()
      }
      return this.WAITING_HEADER_BLOCK_END
    }

    this.headerName += c
    return WAITING_HEADER_NAME
  }

  WAITING_HEADER_SPACE(c) {
    if (c === ' ') {
      return this.WAITING_HEADER_VALUE
    }
    return this.ERROR(c)
  }

  WAITING_HEADER_VALUE(c) {
    if (c === '\r') {
      this.headers[this.headerName] = this.headerValue
      this.headerName = ''
      this.headerValue = ''
      return this.WAITING_HEADER_LINE_END
    }

    this.headerValue += c
    return this.WAITING_HEADER_VALUE
  }

  // header 结束
  WAITING_HEADER_LINE_END(c) {
    if (c === '\n') {
      return this.WAITING_HEADER_NAME
    }
    return this.ERROR(c)
  }

  // header 之后的空行
  WAITING_HEADER_BLOCK_END(c) {
    if (c === '\n') {
      return this.WAITING_BODY
    }
    return this.ERROR(c)
  }

  WAITING_BODY(c) {
    this.bodyParse.receiveChar(c)
    return this.WAITING_BODY
  }

  ERROR(_) {
    if (!this.isError) {
      this.isError = true
    }
    return this.ERROR
  }

  receiveChar(char) {
    this.current = this.current(c)
  }
}

// 解析body
// length : chunk
class TrunkedBodyParser {
  constructor() {
    // chunk 长度为0 ，代表body结束
    this.WAITING_LENGTH = 0
    this.WAITING_LENGTH_LINE_END = 1
    // 预先读进来的长度控制trunk的大小
    this.READING_TRUNK = 2
    this.WAITING_NEW_LINE = 3
    this.WAITING_NEW_LINE_END = 4
    this.length = 0
    this.content = []
    this.isFinished = false
    this.current = this.WAITING_LENGTH
  }

  ERROR(_) {
    if (!this.isError) {
      this.isError = true
    }
    return this.ERROR
  }

  WAITING_LENGTH(c) {
    if (c === '\r') {
      // length 为0  说明为空串 ，结束
      if (this.length === 0) {
        this.isFinished = true
      }
      return this.WAITING_LENGTH_LINE_END
    } else {
      // length  为16进制 原来的值加现在的16进制的值
      this.length *= 16
      this.length += parseInt(char, 16)
      return WAITING_LENGTH
    }
  }

  WAITING_LENGTH_LINE_END(c) {
    if (c === '\n') {
      return this.READING_TRUNK
    }
    return this.ERROR(c)
  }

  READING_TRUNK(c) {
    this.content.push(c)
    this.length--
    if (this.length === 0) {
      return this.WAITING_NEW_LINE
    }
    return this.READING_TRUNK
  }

  WAITING_NEW_LINE(c) {
    if (c === '\r') {
      return this.WAITING_NEW_LINE_END
    }
    return this.ERROR(c)
  }
  WAITING_NEW_LINE_END(c) {
    if (c === '\r') {
      return this.WAITING_NEW_LINE_END
    }
    return this.ERROR(c)
  }

  receiveChar(char) {
    this.current = this.current(char)
  }
}
void (async function () {
  let request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: '8000',
    path: '/',
    headers: {
      ['x-hello']: 'world',
    },
    body: {
      name: 'hello',
    },
  })

  const response = await request.send()
  // 解析HTML
  const dom = parser.parseHtml(response.body)
  console.log(5555, dom)
})()
