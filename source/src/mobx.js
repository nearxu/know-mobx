

const hello = (str) => 'hello'+str;

console.log(hello('world'));

import {autorun} from './autorun';
import {Observable} from './observable';


var person= {
    name:'tom',
    age:18,
    contry:'china'
}

var tom = new Observable(person);

autorun(function(){
    console.log(tom.name);
})

tom.name= 'json';