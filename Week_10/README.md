## 盒模型

盒是排版和渲染的基本单位。

content + padding(内边距) + border + margin(外边距)
box-sizing: content-box,border-box

contentBox:
width:content

border-box
wisth:content + padding + border

## 正常流

正常流 ----> flex ----->grid

正常流的排版

1. 收集盒和文字进行
2. 计算盒和文字在行中的排布
3. 计算行间的排布

BFC
从上往下的排布
IFC
从左往右的排布

行级排布 inline-block
文字排版是基于基线排版 base-line
text-top
text-bottom

如果文字不变，text-top，text-bottom，也不变

### float 元素

1. 会先把元素当成正常元素排进文档流，在按照 float 的方向向该方向挤一下
2. float 元素能浮动到的位置会受之前浮动元素的影响
3. clear 清除浮动，找出干净的空间来做浮动

### margin 折叠

- 只会发生在 BFC 里
- 当上下都有 margin 时，不会保留两个的 margin,会取最大的盒子的 margin

# BFC(Block Formating Context) 块级格式化上下文

Block Contaniner:能容纳正常流的盒，里面就有 BFC

1. dispaly:block
2. display:inline-block
3. display:table-cell
4. flex item ：flex 的子元素
5. grid cell
6. table-caption

Block-lever-box:外面有 BFC 的(包括 inline-block)

1. dispaly:block
2. display:flex
3. display:table
4. display:grid

Block Box = Block Contaniner+Block-lever-box
里外都有 BFC

## 设立 BFC

1. 浮动元素，浮动元素里面是正常流会产生 BFC
2. 绝对定位元素
3. Block Contaniner
4. overflow :visible / overflow:hidden

## BFC 合并

block-box && overflow :visible

1. float
2. 边距折叠
