# AST:抽象语法树

AST：指源代码的抽象语法的树状形式

## 常用的语法分析算法：

LL:算法和 LR 算法
LL:从左到右扫描，从左到右归约

## 抽象语法树的格式

```
  "type": "Program",
  "body": [
    {
      "type": "FunctionDeclaration",
      "id": {
        "type": "Identifier",
        "name": "ast",
        "range": [
          9,
          12
        ]
      },
      "params": [],
      "body": {
        "type": "BlockStatement",
        "body": [],
        "range": [
          14,
          16
        ]
      },
      "generator": false,
      "expression": false,
      "range": [
        0,
        16
      ]
    }
  ],
  "sourceType": "module",
  "range": [
    0,
    16
  ]
}
```

## AST 的应用场景

代码的检查，代码的格式化，代码的高亮，如，esLint 的代码检查方式，TS，JSX 转化为 js 语言时，babel 转义都会应用。

## 分析过程

词法分析：将整个代码字符串分割成最小语法单元数组，就是 token 1024 空格\*空格 2
语法分析：在分词基础上建立分析语法单元之间的关系

# 搜索算法

广度优先搜索 采用队列模拟
找到第一个点的上下左右，在把该点旁边的点也加到这个集合(队列)中，计算过的点不在计算
深度优先搜索 采用栈模拟
