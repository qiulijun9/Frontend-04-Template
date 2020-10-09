const net = require('net')

class Request {
  constructor(options) {
    this.method = options.method || 'Get'
    this.port = options.port || '80'
    this.host = options.host
    this.path = options.path || '/'
    this.body = options.body || {}
    this.headers = options.headers || {}

    //  根据Content-Type 处理不同的 bodyText
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
        // 有tcp链接使用
        connection.write(this.toString())
      } else {
        // 创建新链接
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
      connection.on('data', data => {
        parser.receive(data.toString())
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
  // http 请求文本， header 每行和每行间要有换行\r\n ，最后要有空行代表header 结束 \r\r
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
 status line:
http/1.1 200 OK
heders:
Content-Type:text/html
Date:Mon,23 Dec 2019
Connection:keep-alive
Transfer-Encoding:chunked
 * 
 */
class ResponseParser {
  constructor() {
    //定义状态机
    this.WAITING_STATUS_LINE = 0
    this.WAITING_STATUS_LINE_END = 1
    this.WAITING_HEADER_NAME = 2
    this.WAITING_HEADER_SPACE = 3
    this.WAITING_HEADER_VALUE = 4
    this.WAITING_HEADER_LINE_END = 5
    this.WAITING_HEADER_BLOCK_END = 6
    this.WAITING_BODY = 7

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

  receiveChar(char) {
    if (this.current === this.WAITING_STATUS_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_HEADER_LINE_END
      } else {
        this.current += char
      }
    }

    if (this.current === this.WAITING_STATUS_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME
      }
    }

    if (this.current === this.WAITING_HEADER_NAME) {
      if (char === ' : ') {
        this.current = this.WAITING_HEADER_SPACE
      } else if (char === '\r') {
        // 空行 ，headers 结束
        this.current = this.WAITING_HEADER_BLOCK_END

        // 根据chunked 格式设置bodyparse
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyParse = new TrunkedBodyParser()
        }
      } else {
        this.current += char
      }
    }

    if (this.current === this.WAITING_HEADER_SPACE) {
      if (char === ' ') {
        this.current = this.WAITING_HEADER_VALUE
      }
    }

    if (this.current === this.WAITING_HEADER_VALUE) {
      if (char === '\r') {
        this.current = this.WAITING_HEADER_LINE_END
        this.headers[this.headerName] = this.headerValue
        this.headerName = ''
        this.headerValue = ''
      } else {
        this.current += char
      }
    }

    if (this.current === this.WAITING_HEADER_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME
      }
    }

    if (this.current === this.WAITING_HEADER_BLOCK_END) {
      if (char === '\n') {
        this.current = this.WAITING_BODY
      }
    }

    if (this.current === this.WAITING_BODY) {
      this.bodyParse.receiveChar(char)
    }
  }
}

// length : chunk
class TrunkedBodyParser {
  constructor() {
    // chunk 长度为0 ，代表body结束
    this.WAITING_LENGTH = 0
    this.WAITING_LENGTH_END = 1
    // 预先读进来的长度控制trunk的大小
    this.READING_TRUNK = 2
    this.WAITING_NEW_LINE = 3
    this.WAITING_NEW_LINE_END = 4
    this.length = 0
    this.content = []
    this.isFinished = false
    this.current = this.WAITING_LENGTH
  }
  receiveChar(char) {
    if (this.current === this.WAITING_LENGTH) {
      if (char === '\r') {
        // length 为0  说明为空串 ，结束
        if (this.length === 0) {
          this.isFinished = true
        }
        this.current = this.WAITING_LENGTH_END
      } else {
        // length  为16进制 原来的值加现在的16进制的值
        this.length *= 16
        this.length += parseInt(char, 16)
      }
    }

    if (this.current === this.WAITING_LENGTH_END) {
      if (char === '\n') {
        this.current = this.READING_TRUNK
      }
    }

    if (this.current === this.READING_TRUNK) {
      this.content.push(char)
      this.length--
      if (this.length === 0) {
        this.current = this.WAITING_NEW_LINE
      }
    }

    if (this.current === this.WAITING_NEW_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_NEW_LINE_END
      }
    }

    if (this.current === this.WAITING_NEW_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_LENGTH
      }
    }
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
  console.log(5555, response)
})()
