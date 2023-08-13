/**
 * @example
 *
 * ```js
    // Callback-高阶函数（aop 函数，函数柯里化）
    // - 1、高级函数定义：函数的参数为函数或函数的返回值为函数
    // - - aop：面向切面编程

    // - 2、装饰器
    // - - 1）伪代码
    function fn(){
      console.log('fn: 函数功能！')
    }
    let newFn = fn.before(function(){})
    newFn()

    // - - 2）before 逻辑
    // - - - {@link file://./file/1_callback/1_aop.js}
    Function.prototype.before = function(callback) {
      let self = this // 
      return function(){ // 返回的函数的 this 指向 newFn() 前的 this，当前 node running 指向 global
        callback() // before 参数
        self.apply(self, arguments)
      }
    }
    function fn(val){
      console.log('fn: 函数功能！' + val)
    }
    let newFn = fn.before(function(){
      console.log('在函数执行前执行')
    })
    newFn('你好')
    // - - - 打印：在函数执行前执行 ===> fn: 函数功能！你好

    // - - 3）before 用处：
    // - - - 前端埋点；在 ajax 的请求中包装一层自定义逻辑；

    // - - 4）判断 this，看谁调用，this 指向谁

    // - 3、after
    // - - 案例：lodash、debounce、throttle
    // - - after 逻辑
    // - - - 伪代码
    function after(times, callback){}
    let newFn = after(3, function(){
      console.log('after')
    })
    newFn()
    newFn()
    newFn()

    // - - - after 函数
    // - - - - {@link file://./file/1_callback/2_after.js}
    function after(times, callback) {
      return function () {
        if (--times === 0) {
          callback()
        }
      }
    }
    let newFn = after(3, function () {
      console.log('after: 调用完成')
    })
    newFn()
    newFn()
    newFn() // after: 调用完成

    // - 4、paralle-并发调用
    // - - 并发调用接口，两个 ajax：ajax1 => name; ajax2 => name + age;
    // - - - {@link file://./file/1_callback/name.txt}
    // - - - {@link file://./file/1_callback/age.txt}
    // - - - {@link file://./file/1_callback/3_paralle.js}
    const fs = require('fs')
    const path = require('path')
    const after = (times, callback) => {
      let result = {}
      return (key, data) => {
        result[key] = data
        if (--times === 0) callback(result)
      }
    }
    const newFn = after(2, (result) => { // 这个方法会在所有异步执行完成后执行
      console.log('result:', result) // result: { name: 'web_promise_learn', age: '1' }
    })
    fs.readFile(path.join(__dirname, './name.txt'), 'utf8', function (err, data) {
      if (err) return console.log('err:', err)
      newFn('name', data)
    })
    fs.readFile(path.join(__dirname, './age.txt'), 'utf8', function (err, data) {
      if (err) return console.log('err:', err)
      newFn('age', data)
    })

    // - - - - 串行：两个人有关系，上一个人的输出是下一个人的输入
    // - - - - 并行：两个人没关系，一起执行
    

 * ```
 * 
 */

    