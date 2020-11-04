const EOF = Symbol('EOF')

// parseHtml,接收html 返回 dom树
module.exports.parseHtml = function parseHtml(html) {
  let state = data
  for (let c in data) {
    state = state(c)
  }
  state = state(EOF) // 结束
  console.log(html)
}
