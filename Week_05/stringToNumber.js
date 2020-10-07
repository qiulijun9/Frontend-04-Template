/**
 * 十进制表示：0 ，0.，.2,1e3
  二进制表示: 0b111
  八进制表示: 0o10
  十六进制表示：0XF
 */

const binaryReg = /^0b[0|1]+$/
const octalReg = /^0o[0-7]+$/
const hexadecimalReg = /^0X[0-9A-F]+$/

function StringToNumber(str) {
  if (typeof str === 'number') return str
  if (binaryReg.test(str)) {
    return parseInt(Number(str), 2)
  }
  if (octalReg.test(str)) {
    return parseInt(Number(str), 8)
  }
  if (hexadecimalReg.test(str)) {
    return parseInt(Number(str), 16)
  }
}

console.log(StringToNumber('0b1111'))

function NumberToString(number, radix) {
  if (typeof number !== 'number') return
  if (!(radix === 2 || radix === 8 || radix === 10 || radix === 16)) {
    return
  }
  return number.toString(radix)
}

console.log(NumberToString(10, 2))
