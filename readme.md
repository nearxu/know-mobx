### mobx api 

https://github.com/suprise/mobx-cn

MobX 是一个通过对开发者透明的函数响应式编程,

来源于应用的状态的任何事物，都能被自动获得,

包括UI、数据变更、与服务器通信等等

some store

https://boycgit.github.io/mobx-source-autorun/


### source realize
https://zhuanlan.zhihu.com/p/26559530

##### autorun 是个神奇的函数，被他包装过的方法，就会变为观察者函数

autorun(function(){
    console.log(person.name);
});


只有修改 name 属性的时候才会触发,
这里的原理就是依赖收集,

这时候需要引申出一个很简单的管理类，在 s-mobx 中，我们叫做 dependenceManager，这个工具类中管理了一个依赖的 map，结构是一个全局唯一的 ID 和 对应的监听的函数的数组。

这个全局唯一的 ID 实际上代表的就是各个被设置为 observable 的属性值，是 Observable 类的一个属性 obID。

当一个被 observable 包装的属性值发生 set 行为的时候，就会触发 dependenceManager.trigger(obID); 从而触发遍历对应的监听函数列表，并且执行，这就是 autorun 的基本原理。

##### Observable

包装对象值的 Observable ，核心原理是 Object.defineProperty ，给被包装的属性套上 get 和 set 的钩子，在 get 中响应依赖收集，在 set 中触发监听函数


### 装饰器 类似是高阶函数的作用，对类 进行拓展

https://juejin.im/post/5ac85f1d6fb9a028bf0590ee


###  i cant refresh html , so use parcel

https://parceljs.org/getting_started.html

##### decortor

cnpm install babel-plugin-transform-decorators-legacy  --save-dev
cnpm install  @babel/plugin-proposal-decorators --save-dev

["@babel/plugin-proposal-decorators", { "legacy": true }],
["@babel/plugin-proposal-class-properties", { "loose" : true }]


shift + option + f


