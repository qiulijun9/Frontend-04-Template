css

## css 语法

https://www.w3.org/TR/css-syntax-3/
https://www.w3.org/TR/CSS21/grammar.html#q25.0

## css 规则

1. @ rules
   @charset 声明 css 的字符集
   @import 级联规则
   @media(\*) 媒体查询
   @page 分页媒体（打印机）
   @counter-stle .

   @keyframes(\*) 定义动画
   @fontface(\*) 定义字体 webfont
   @supports 检查某些 css 功能十否存在，有兼容问题,不 8 推荐使用
   @namespace 定义命名空间

2. rules

3. 选择器
   ,
   +,>,~
   简单选择器
   复合选择器
   伪类，伪元素选择器
   not 选择器

最少有一个简单选择器

4. 声明

- key
  属性和变量

  变量声明法：--
  ：root{
  --main-clolor:#fff
  --side:margin-top
  }
  #foo{
  color:var(--main-color)；
  --side:20px;
  }

- value
