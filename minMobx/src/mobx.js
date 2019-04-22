

import { autorun } from './autorun';
import { observable, computed } from './decorator';

// let count = observable({number:0});

// autorun(() => {
//     console.log('number'+count.number);
// })

// count.number =  2;
// count.number = 3;

// class Counter {
//     @observable number = 0;
//     @computed get msg() {
//         return 'number:' + this.number
//     }
// }

// var store = new Counter()

// // 运行一次，建立依赖
// autorun(() => {
//     console.log(store.msg)
// });


const counter = observable(0);
const foo = observable(0);
const bar = observable(0);
autorun(() => {
  if (counter.get() === 0) {
    console.log('foo', foo.get());
  } else {
    console.log('bar', bar.get());
  }
});

bar.set(10);    // 不触发 autorun
counter.set(1); // 触发 autorun
foo.set(100);   // 不触发 autorun
bar.set(100);   // 触发 autorun





export default class Index { }