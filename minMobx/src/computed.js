import { dependManager } from './dependManager';

var cpIDCount = 1;

export class Computed {
    value = null;

    getter = null;

    target = null;

    hasBindAutoReCompute = false;

    obID = 0;

    constructor(target, getter) {
        this.cpID = 'cp-' + (++cpIDCount);
        this.target = target;
        this.getter = getter;
    }

    reComputer() {
        this.value = this.getter.call(this.target);
        dependManager.trigger(this.cpID);
    }
    bindAutoReComputed() {
        if (!this.hasBindAutoReCompute) {
            this.hasBindAutoReCompute = true;
            dependManager.beginCollect(() => this.reComputer, this);
            this.reComputer();
            dependManager.endCollect();
        }
    }
    get() {
        this.bindAutoReComputed();
        dependManager.collect(this.cpID);
        return this.value;
    }
}