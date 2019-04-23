
import { dependManager } from './dependManager';

let obIDCount = 1;

export class Observable {
    obID = 0;
    value = null; // real value
    constructor(v) {
        this.obID = 'ob-' + (++obIDCount);
        if (Array.isArray(v)) {
            this.wrapArrayProxy(v);
        } else {
            this.value = v;
        }
    }
    get() {
        dependManager.collect(this.obID);
        return this.value;
    }
    set(v) {

        if (Array.isArray(v)) {
            this.wrapArrayProxy(v);
        } else {
            this.value = v;
        }
        dependManager.trigger(this.obID)

    }
    trigger() {
        dependManager.trigger(this.obID);
    }

    // array proxy handle
    wrapArrayProxy(v) {
        this.value = new Proxy(v, {
            set: (obj, key, value) => {
                obj[key] = value;
                if (key != 'length') {
                    this.trigger();
                }
                return true;
            }
        })
    }

}