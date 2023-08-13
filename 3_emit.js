/**
 * @example
 *
 * ```js
    // Callback-Emit-发布订阅
    // - 1、EventEmitter 函数
    // - - {@link file://./file/1_callback/4_emit.js}
    const EventEmitter = function () {
      this._arr = []
    }
    EventEmitter.prototype.on = function (callback) {
      // 订阅
      this._arr.push(callback)
    }
    EventEmitter.prototype.emit = function () {
      // 发布，发布时，需要让 on 依次执行
      this._arr.forEach((fn) => fn.apply(this, arguments))
    }
    let e = new EventEmitter()

    // - 2、fs 读取使用 EventEmitter
    const fs = require('fs')
    const path = require('path')
    fs.readFile(path.join(__dirname, './name.txt'), 'utf8', function (err, data) {
      if (err) return console.log('err:', err)
      e.emit(data, 'name')
    })
    fs.readFile(path.join(__dirname, './age.txt'), 'utf8', function (err, data) {
      if (err) return console.log('err:', err)
      e.emit(data, 'age')
    })

    // - 3、on 监听
    const school = {}
    e.on((data, key) => {
      school[key] = data
      if (Object.keys(school).length === 2) {
        console.log('school:', school) // school: { age: '1', name: 'web_promise_learn' }
      }
    })

 * ```
 * 
 */