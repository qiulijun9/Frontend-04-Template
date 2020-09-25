// 写一段 JS 的函数，把一个 string 它代表的字节给它转换出来，用 UTF8 对 string 进行遍码。
// 一字节 0000 - 007f
function getStrByte(str) {
  const charCode = encodeURIComponent(str)
  const bytes = []
  for (let i = 0; i < charCode.length; i++) {
    const c = charCode.charAt(i)
    bytes.push(c.charCodeAt(0))
  }

  let result = ''
  for (const i of bytes) {
    result += i.toString(16)
  }
  return decodeURI(result)
}

console.log(getStrByte('abc'))
