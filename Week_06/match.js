// 在字符串中找找到a
// function matcha(str) {
//   for (let i = 0; i < str.length; i++) {
//     if (str[i] === 'a') {
//       return true
//     }
//   }
//   return false
// }

// function matcha(str) {
//   if (str.includes('a')) {
//     return true
//   }
//   return false
// }

// 在字符串中找找到ab
//function matchab(str) {
//   for (let i = 0; i < str.length; i++) {
//     if (str[i] === 'a') {
//       if (str[i + 1] === 'b') {
//         return true
//       }
//     }
//   }
//   return false
// }

// function matchab(str) {
//   let findA = false
//   for (let i = 0; i < str.length; i++) {
//     if (str[i] === 'a') {
//       findA = true
//     } else if (findA && str[i] === 'b') {
//       return true
//     } else {
//       findA = false
//     }
//   }
//   console.log(findA)
//   return false
// }

// 在字符串中找找到abcdef
// function match(str) {
//   if (str.includes('abcdef')) {
//     return true
//   }
//   return false
// }

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
  if (s === 'c') {
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
    return findB2
  }
  return start(s)
}

function findB2(s) {
  if (s === 'x') {
    return end
  }
  return findB(s)
}
function end() {
  return end
}
console.log(match('qqqaabcabg'))
