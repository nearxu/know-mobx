
let isCollecting = false;
let observeStack = [];
let nowObserver = null;
let nowTarget = null;
let targetStack = [];


export const dependManager = {
    // store all observable handler
    store: {},



    beginCollect(observer, target) {
        isCollecting = true;
        observeStack.push(observer);
        targetStack.push(target);
        nowObserver = observeStack.length > 0 ? observeStack[observeStack.length - 1] : null;
        nowTarget = targetStack.length > 0 ? targetStack[targetStack.length - 1] : null;
    },

    endCollect() {
        isCollecting = false;
        observeStack.pop();
        targetStack.pop();
        nowObserver = observeStack.length > 0 ? observeStack[observeStack.length - 1] : null;
        nowTarget = targetStack.length > 0 ? targetStack[targetStack.length - 1] : null;
    },

    collect(obId) {
        if (nowObserver) {
            this.addNowObserver(obId);
        }
        return false;
    },

    addNowObserver(obId) {
        this.store[obId] = this.store[obId] || {};
        this.store[obId].target = nowTarget;
        this.store[obId].watchers = this.store[obId].watchers || [];
        this.store[obId].watchers.push(nowObserver);
    },

    // 触发
    trigger(id) {
        const ds = this.store[id];
        if (ds && ds.watchers) {
            ds.watchers.forEach(d => {
                d.call(d.target || this);
            })
        }
    }
}