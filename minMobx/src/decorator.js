import {Observable} from './observable';
import {createObservable} from './extendObservable';
import {Computed} from './computed';

export function observable (target,name,descriptor){
    var v;
    if(descriptor){
        v = descriptor.initializer.call(this);
    }else {
        v=target;
    }
    if(typeof v === 'object'){
        createObservable(v);
    }

    var observable = new Observable(v);

    return {
        enumerable:true,
        configurable:true,
        get:function(){
            return observable.get();
        },
        set:function(v){
            if(typeof v === 'object'){
                createObservable(v);
            }
            return observable.set(v);
        }
    }
}

export function computed(target,name,descriptor){
    const getter = descriptor.get;
    const computed = new Computed(target,getter);

    return {
        enumerable: true,
        configurable: true,
        get: function() {
            computed.target = this;
            return computed.get();
        }
    }
}
