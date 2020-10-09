// 查询字符串中是否存在abcabx
// 状态机函数,Mealy 状态机 根据输入确定输出的转态
function match(str) {
  let state = start // 保存状态机的状态
  for (let i of str) {
    // 把状态切换到下一个状态
    state = state(i)
  }
  return state === end
}

function start(s) {
  if (s === 'a') {
    // 切换下一个状态
    return findA
  }
  return start
}

function findA(s) {
  if (s === 'b') {
    // 切换下一个状态
    return findB
  }
  return start(s)
}

function findB(s) {
  if (s === 'c') {
    // 切换下一个状态
    return findC
  }
  return start(s)
}

function findC(s) {
  if (s === 'a') {
    return findA2
  }
  return start(s)
}

function findA2(s) {
  if (s === 'b') {
    // 切换下一个状态
    return findB2
  }
  return start(s)
}

function findB2(s) {
  if (s === 'x') {
    // 切换下一个状态
    return end
  }
  // 当找到abcab 发现之后不是x,回到abc为开始如abcabcabx
  return findB(s)
}
function end() {
  //找到最后一个字符 状态的结束，找到之后状态就不改变
  return end
}
console.log(match('qqqaabcabcabx'))
