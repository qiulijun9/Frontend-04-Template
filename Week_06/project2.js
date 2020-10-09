// 使用状态机完成”abababx”的处理。
function match(str) {
  let state = start
  for (let i of str) {
    state = state(i)
  }
  return state === end
}
function start(s) {
  if (s === 'a') {
    return findA
  }
  return start
}
function findA(s) {
  if (s === 'b') {
    return findB
  }
  return start(s)
}

function findB(s) {
  if (s === 'a') {
    return findA2
  }
  return start(s)
}

function findA2(s) {
  if (s === 'b') {
    return findB2
  }
  return start(S)
}

function findB2(s) {
  if (s === 'a') {
    return findA3(s)
  }
  return start(s)
}

function findA3(s) {
  if (s === 'b') {
    return findx(s)
  }
  return start(s)
}

function findx(s) {
  if (s === 'x') {
    return end
  }
  return findB2(s)
}

function end() {
  return end
}
