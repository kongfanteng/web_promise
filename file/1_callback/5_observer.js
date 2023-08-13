class Subject {
  // 婴儿
  constructor() {
    this.state = '开心'
    this.arr = []
  }
  attach(observer) {
    this.arr.push(observer)
  }
  setState(newState) {
    this.state = newState
    this.arr.forEach((observer) => observer.update(this.state))
  }
}
class Observer {
  // 父亲、母亲
  constructor(name) {
    this.name = name
  }
  update(newState) {
    console.log(`婴儿的状态是: ${newState}, ${this.name}知道了`)
  }
}
let subject = new Subject()
let father = new Observer('爸爸')
let mother = new Observer('妈妈')
subject.attach(father)
subject.attach(mother)
subject.setState('大哭')
// - - - - 婴儿的状态是: 大哭, 爸爸知道了
// - - - - 婴儿的状态是: 大哭, 妈妈知道了
