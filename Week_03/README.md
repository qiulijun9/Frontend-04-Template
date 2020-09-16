# 字符串算法

1. 字典树
   适用于大量的字符串存储对比和分析，比如判断两个字符串是否相等,找最大或最小字符
2. KMP (Knuth-Morris-Pratt)人名组合
   字符串模式匹配算法。检查原字符串中是否匹配目标字符串，是否包含某个字符串
   在原先双层 for 循环上做了优化，采用 table 来记录已经匹配上的，下次循环可从该位置直接匹配，不用跑到开头
3. wildcard
   通配符匹配字符串（？，\*）
   文件查找会用到
4. 正则
   匹配字符串
5. 状态机
   通用的字符串分析
6. LL,LR
   多层机构的字符串语法和词法分析

# proxy(代理)

用于操作对象的属性，值，监听值和属性发生的改变,预期性会变差

作用：vue3.0 中采用了 proxy，来做双向绑定 ，immer 中采用 proxy 来做值的拷贝
通过 set 方法来设置属性值，get 获取属性值， 在 set 和 get 时都会触发监听函数

# CSSOM

CSSOM 是一组允许 js 操作 css 的 API,它和 Dom 类似，但用于 css.允许动态读取和修改 css 的属性

## getBoundingClientRect

得到矩形元素的界线，返回的是一个对象，包含 top, left, right, 和 bottom 四个属性值，大小都是相对于文档视图左上角计算而来。

## range

- 创建 range
  let range = document.createRange()

- 选择节点
  selectNode() :选择整个节点，包括子节点
  selectNodeContents() 选择节点的子节点

  - 选择具体位置的节点
    setStart(参照节点，偏移量)
    setEnd(参照节点，偏移量)

- 操作节点
  insertNode() 向范围选区的开始处插入一个节点
  deleteContents() 这个方法能够从文档中删除范围缩包含的内容
  CloneContents() 创建范围对象的一个副本，不会影响原来的节点
  surroundContents() 环绕范围插入内容

- 清除 range
  detach()
