

// some solution from 
// https://js.yanceyleo.com/ECMAScript/Object/Object.defineProperty.html


var obj = {};
var initValue = 'hello'
Object.defineProperty(obj, 'newKey', {
  get: function () {
    return initValue
  },
  set: function (newVal) {
    initValue = newVal;
  }
})
console.log(obj.newKey);
obj.newKey = 'change value';

console.log(obj.newKey)

export default class Index { }