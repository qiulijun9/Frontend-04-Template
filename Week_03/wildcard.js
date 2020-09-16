// ab*c?d*abc*a?d
function find(source, target) {
  let count = 0
  // 找出有多少个*
  for (let i = 0; i < target.length; i++) {
    if (target[i] === '*') {
      count++
    }
  }
  // 没有* 的情况
  if (count === 0) {
    for (let i = 0; i < target.length; i++) {
      if (source[i] !== target[i] && target[i] !== '?') {
        return false
      }
    }
    return
  }
  // 处理第一个* 之前的

  let i = 0
  let lastIndex = 0
  for (i = 0; i < target[i] !== '*'; i++) {
    if (source[i] !== target[i] && target[i] !== '?') {
      return false
    }
  }
  lastIndex = i

  // 循环 * XX *
  for (let p = 0; p < count - 1; p++) {
    i++
    let sub = ''
    while (target[i] !== '*') {
      sub += target[i]
      i++
    }
    // 匹配所有的字符
    let reg = new RegExp(sub.replace(/\?/g, '[\\s\\S]'), 'g')
    reg.lastIndex = lastIndex
    console.log(reg.exec(source))
    if (!reg.exec(source)) return false
    lastIndex = reg.lastIndex
  }

  // 尾部* 匹配
  for (
    let j = 0;
    j < source.length - lastIndex && target[target.length - j] !== '*';
    j++
  ) {
    if (
      source[source.length - j] !== target[target.length - j] &&
      target[target.length - j] !== '?'
    ) {
      return false
    }
  }

  return true
}

find('ab*c?d*abc*a?d', 'abc*')
