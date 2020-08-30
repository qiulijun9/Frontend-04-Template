学习笔记

# 异步编程方式

1. callback
   在回调之后在处理一些逻辑，会形成回调地狱的情况
2. Promise
   返回一个 Promise，通过.then 来调用
   Promise.all()
   Promise.race()
3. async/await
   可以同步的方式写异步代码
4. co +generator
   早期通过 generator 模拟 async/await
