let $ = Symbol('$')
class Trie {
  constructor() {
    this.root = Object.create(null)
  }

  // 插入字典树
  insert(word) {
    let node = this.root

    for (let w of word) {
      // 判断子树是否存在
      if (!node[w]) {
        node[w] = Object.create(null)
      }
      node = node[w]
    }

    // node 截止符$
    if (!($ in node)) {
      node[$] = 0
    }
    node[$]++
  }
  most() {
    let max = 0
    let maxword = null
    const visit = (node, value) => {
      if (node[$] && node[$] > max) {
        max = node[$]
        maxword = value
      }

      for (let n in node) {
        visit(node[n], value + n)
      }
    }
    visit(this.root, '')
    console.log(max, maxword)
  }
}

function randomWord(length) {
  let s = ''
  for (let i = 0; i < length; i++) {
    s += String.fromCharCode(Math.random() * 26 + 'a'.charCodeAt(0))
  }
  return s
}

let tr = new Trie()
for (let i = 0; i < 3; i++) {
  tr.insert(randomWord(4))
}
console.log(tr)
