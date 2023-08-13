/**
 * @example
 *
 * ```js
    // Callback-Observer-观察者模式
    // - 1、观察者模式和发布订阅模式区别
    // - - 观察者模式基于发布订阅模式
    // - - 发布订阅模式，发布者与订阅者两者无关
    // - - 观察者模式，观察者与被观察者有关
    // - - 被观察者应该存放着观察者，例如：父亲、母亲、婴儿（状态）
    // - - 被观察者状态变化，要通知自身的所有观察者
    
    // - 2、示例
    // - - 1）创建被观察者类 Subject 和观察者类 Observer
    // - - - {@link file://./file/1_callback/5_observer.js}
    class Subject { // 婴儿
      constructor() {
        this.state = '开心'
        this.arr = []
      }
      attach(observer) { // 装载观察者
      }
    }
    class Observer { // 父亲、母亲
    }
    let subject = new Subject()
    let father = new Observer('爸爸')
    let mother = new Observer('妈妈')
    subject.attach(father)
    subject.attach(mother)

    // - - 2）装载观察者 attach + 更新自己的状态 setState + 更新被监听者状态 update
    // - - - {@link file://./file/1_callback/5_observer.js}
    // - - - 类 Subject
    attach(observer) {
      this.arr.push(observer)
    }
    setState(newState) {
      this.state = newState
      this.arr.forEach(observer => observer.update(this.state))
    }
    // - - - 类 Observer
    constructor(name) {
      this.name = name
    }
    update(newState) {
      console.log(`婴儿的状态是: ${newState}, ${this.name}知道了`)
    }
    // - - - 婴儿状态变为 '大哭'
    subject.setState('大哭')
    // - - - - 婴儿的状态是: 大哭, 爸爸知道了
    // - - - - 婴儿的状态是: 大哭, 妈妈知道了

    * ```
 * 
 */