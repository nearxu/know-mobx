import { Observable } from './observable';

const createObservable = (target) => {
    for (let i in target) {
        if (target.hasOwnProperty(i)) {
            createObservableProperty(target, i);
        }
    }
}

const createObservableProperty = (target, property) => {
    const observable = new Observable(target[property]);
    Object.defineProperty(target, property, {
        get: function get() {

            return observable.get();
        },
        set: function set(v) {

            return observable.set(v);
        }
    });
    if (typeof (target[property]) === 'object') {
        for (let i in target[property]) {
            if (target[property].hasOwnProperty(i)) {
                createObservableProperty(target[property], i);
            }
        }
    }
}

const extendObservable = function extendObservable(target, obj) {
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            target[i] = obj[i];
            createObservable(target, i);
        }
    }
}

export {
    extendObservable,
    createObservable
}