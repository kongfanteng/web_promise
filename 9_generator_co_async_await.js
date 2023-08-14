/**
 * @example
 *
 * ```js
    // Promise-GeneratorCo_AsyncAwait-generator + co & async + await
    // - 1、生成器-generator 迭代器-iterator
    // - - 类数组，有长度，有索引，是个对象，能被迭代，例如： arguments
    // - - - 执行函数：{@link array_like}
    function arg(){
      let arr = [...arguments]
      console.log('arr:', arr)
    }
    arg(1, 2)

    // - - 给一个对象 obj 添加迭代器，可以使它被迭代
    // - - - 执行函数：{@link iterator_test_1}
    let obj = { 0: 1, 1: 2, 2: 3, length: 3, [Symbol.iterator]: function(){

    } }
    function arg(){
      let arr = [...obj]
      console.log('arr:', arr)
    }
    arg(1, 2) // 报错：TypeError: Result of the Symbol.iterator method is not an object

    // - - - iterator-迭代器有一个 next 方法，每次调用都会返回 value, done 两个属性
    // - - - - 执行函数：{@link iterator_test_2}
    [Symbol.iterator]: function(){
      let self = this
      let index = 0
      return { // 迭代器
        next(){
          return { value: self[index], done: index++ === self.length }
        }
      }
    }

    // - 2、generator
    // - - 1）generator
    // - - - 执行函数：{@link generator_test_1}
    function* read(){}
    let r = read()
    console.log('r:', r) // r: Object [Generator] {}
    
    // - - 2）生成器配合 yield 使用
    // - - - 执行函数：{@link generator_test_2}
    function* read(){
      yield 1
      yield 2
      yield 3
    }
    let it = read()
    console.log( it.next() ) // { value: 1, done: false }
    console.log( it.next() ) // { value: 2, done: false }
    console.log( it.next() ) // { value: 3, done: false }
    console.log( it.next() ) // { value: undefined, done: true }

    // - - - 迭代器对象 obj 配合 yield 使用
    // - - - 执行函数：{@link fn_4_obj_test}
    let obj = { 0: 1, 1: 2, 2: 3, length: 3, [Symbol.iterator]: function *(){
      let index = 0
      while(index !== this.length){
        yield this[index++]
      }
    }}

    // - - 3） generator 使用
    // - - - 文本文件：{@link file://./file/5_generator/name.txt}
    // - - - 文本文件：{@link file://./file/5_generator/age.txt}
    // - - - - 安装 fs Promise 包 mz 
    // - - - 执行文件：{@link file://./file/5_generator/1_generator_use.js}
    let fs = require('mz/fs')
    let path = require('path')
    function* read() {
      let r = yield fs.readFile(path.join(__dirname, './name.txt'), 'utf8')
      let age = yield fs.readFile(path.join(__dirname, r), 'utf8')
      return age
    }
    let it = read()
    let { value, done } = it.next()
    value.then((data) => {
      let { value, done } = it.next(data)
      value.then((data) => {
        let { value, done } = it.next(data)
        console.log('value:', value) // value: 18
      })
    })

    // - - 4） co 使用
    // - - - 安装包 co
    sudo npm i co
    // - - - 执行文件：{@link file://./file/5_generator/2_generator_co.js}
    let fs = require('mz/fs')
    let path = require('path')
    function* read() {
      let r = yield fs.readFile(path.join(__dirname, './name.txt'), 'utf8')
      let age = yield fs.readFile(path.join(__dirname, r), 'utf8')
      return age
    }
    let co = require('co')
    co(read()).then(data => {
      console.log('data:', data) // data: 18
    }).catch(e => {
      console.log('e:', e)
    })

    // - - 5） co 自定义
    // - - - 执行文件：{@link file://./file/5_generator/2_generator_co.js}
    function co(it) {
      return new Promise((resolve, reject) => {
        function next(val) {
          let { value, done } = it.next(val)
          if (done){
            return resolve(value)
          }
          Promise.resolve(value).then(data => {
            next(data)
          }, reject)
        }
        next()
      })
    }

    // - 3、async & await
    // - - - 执行文件：{@link file://./file/5_generator/3_async_await.js}
    let fs = require('mz/fs')
    let path = require('path')
    async function read() {
      try{
        let r = await fs.readFile(path.join(__dirname, './name.txt'), 'utf8')
        let age = await fs.readFile(path.join(__dirname, r), 'utf8')
        let e = await [age]
        return e
      } catch(e) {
        console.log('e:', e)
      }
    }
    read().then(data => {
      console.log('data:', data) // data: [ '18' ]
    })

    // - 4、callback & Promise & generator + co & async + await
    // - - 1） callback 多个请求并发，不好管理，链式调用，导致回调嵌套过多
    // - - 2） Promise 优点：可以优雅的处理异步，处理错误；缺点：基于回调的还是会有嵌套；
    // - - 3） generator + co 让代码看起来像同步，不能支持 trycatch
    // - - 4） async + await 解决异步并支持 trycatch


    * ```
 * 
 */
function array_like() {
  function arg() {
    let arr = [...arguments]
    console.log('arr:', arr)
  }
  arg(1, 2)
}
function iterator_test_1() {
  let obj = { 0: 1, 1: 2, 2: 3, length: 3, [Symbol.iterator]: function () {} }
  function arg() {
    let arr = [...obj]
    console.log('arr:', arr)
  }
  arg(1, 2) // 报错：TypeError: Result of the Symbol.iterator method is not an object
}
function iterator_test_2() {
  let obj = { 0: 1, 1: 2, 2: 3, length: 3, [Symbol.iterator]: function(){
    let self = this
    let index = 0
    return { // 迭代器
      next(){
        return { value: self[index], done: index++ === self.length }
      }
    }
  } }
  function arg() {
    let arr = [...obj]
    console.log('arr:', arr)
  }
  arg(1, 2) // arr: [ 1, 2, 3 ]
}
function generator_test_1(){
  function* read(){}
  let r = read()
  console.log('r:', r)
}
function generator_test_2(){
  function* read(){
    yield 1
    yield 2
    yield 3
  }
  let it = read()
  console.log( it.next() )
  console.log( it.next() )
  console.log( it.next() )
  console.log( it.next() )
}
function fn_4_obj_test(params) {
  let obj = { 0: 1, 1: 2, 2: 3, length: 3, [Symbol.iterator]: function *(){
    let index = 0
    while(index !== this.length){
      yield this[index++]
    }
  }}
  function arg() {
    let arr = [...obj]
    console.log('arr:', arr) // arr: [ 1, 2, 3 ]
  }
  arg()
}
function fn_5_generator_use() {
  
}
fn_5_generator_use()
