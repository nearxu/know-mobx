// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/dependManager.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dependManager = void 0;
var isCollecting = false;
var observeStack = [];
var nowObserver = null;
var nowTarget = null;
var targetStack = [];
var dependManager = {
  // store all observable handler
  store: {},
  beginCollect: function beginCollect(observer, target) {
    isCollecting = true;
    observeStack.push(observer);
    targetStack.push(target);
    nowObserver = observeStack.length > 0 ? observeStack[observeStack.length - 1] : null;
    nowTarget = targetStack.length > 0 ? targetStack[targetStack.length - 1] : null;
  },
  endCollect: function endCollect() {
    isCollecting = false;
    observeStack.pop();
    targetStack.pop();
    nowObserver = observeStack.length > 0 ? observeStack[observeStack.length - 1] : null;
    nowTarget = targetStack.length > 0 ? targetStack[targetStack.length - 1] : null;
  },
  collect: function collect(obId) {
    if (nowObserver) {
      this.addNowObserver(obId);
    }

    return false;
  },
  addNowObserver: function addNowObserver(obId) {
    this.store[obId] = this.store[obId] || {};
    this.store[obId].target = nowTarget;
    this.store[obId].watchers = this.store[obId].watchers || [];
    this.store[obId].watchers.push(nowObserver);
  },
  // 触发
  trigger: function trigger(id) {
    var _this = this;

    var ds = this.store[id];

    if (ds && ds.watchers) {
      ds.watchers.forEach(function (d) {
        d.call(d.target || _this);
      });
    }
  }
};
exports.dependManager = dependManager;
},{}],"src/autorun.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.autorun = void 0;

var _dependManager = require("./dependManager");

var autorun = function autorun(handler) {
  _dependManager.dependManager.beginCollect(handler);

  handler();

  _dependManager.dependManager.endCollect();
};

exports.autorun = autorun;
},{"./dependManager":"src/dependManager.js"}],"src/observable.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Observable = void 0;

var _dependManager = require("./dependManager");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var obIDCount = 1;

var Observable =
/*#__PURE__*/
function () {
  // real value
  function Observable(v) {
    _classCallCheck(this, Observable);

    this.obID = 0;
    this.value = null;
    this.obID = 'ob-' + ++obIDCount;

    if (Array.isArray(v)) {
      this.wrapArrayProxy(v);
    } else {
      this.value = v;
    }
  }

  _createClass(Observable, [{
    key: "get",
    value: function get() {
      _dependManager.dependManager.collect(this.obID);

      return this.value;
    }
  }, {
    key: "set",
    value: function set(v) {
      if (Array.isArray(v)) {
        this.wrapArrayProxy(v);
      } else {
        this.value = v;
      }

      _dependManager.dependManager.trigger(this.obID);
    }
  }, {
    key: "trigger",
    value: function trigger() {
      _dependManager.dependManager.trigger(this.obID);
    } // array proxy handle

  }, {
    key: "wrapArrayProxy",
    value: function wrapArrayProxy(v) {
      var _this = this;

      this.value = new Proxy(v, {
        set: function set(obj, key, value) {
          obj[key] = value;

          if (key != 'length') {
            _this.trigger();
          }

          return true;
        }
      });
    }
  }]);

  return Observable;
}();

exports.Observable = Observable;
},{"./dependManager":"src/dependManager.js"}],"src/extendObservable.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createObservable = exports.extendObservable = void 0;

var _observable = require("./observable");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var createObservable = function createObservable(target) {
  for (var i in target) {
    if (target.hasOwnProperty(i)) {
      createObservableProperty(target, i);
    }
  }
};

exports.createObservable = createObservable;

var createObservableProperty = function createObservableProperty(target, property) {
  var observable = new _observable.Observable(target[property]);
  Object.defineProperty(target, property, {
    get: function get() {
      return observable.get();
    },
    set: function set(v) {
      return observable.set(v);
    }
  });

  if (_typeof(target[property]) === 'object') {
    for (var i in target[property]) {
      if (target[property].hasOwnProperty(i)) {
        createObservableProperty(target[property], i);
      }
    }
  }
};

var extendObservable = function extendObservable(target, obj) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      target[i] = obj[i];
      createObservable(target, i);
    }
  }
};

exports.extendObservable = extendObservable;
},{"./observable":"src/observable.js"}],"src/computed.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Computed = void 0;

var _dependManager = require("./dependManager");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var cpIDCount = 1;

var Computed =
/*#__PURE__*/
function () {
  function Computed(target, getter) {
    _classCallCheck(this, Computed);

    this.value = null;
    this.getter = null;
    this.target = null;
    this.hasBindAutoReCompute = false;
    this.obID = 0;
    this.cpID = 'cp-' + ++cpIDCount;
    this.target = target;
    this.getter = getter;
  }

  _createClass(Computed, [{
    key: "reComputer",
    value: function reComputer() {
      this.value = this.getter.call(this.target);

      _dependManager.dependManager.trigger(this.cpID);
    }
  }, {
    key: "bindAutoReComputed",
    value: function bindAutoReComputed() {
      var _this = this;

      if (!this.hasBindAutoReCompute) {
        this.hasBindAutoReCompute = true;

        _dependManager.dependManager.beginCollect(function () {
          return _this.reComputer;
        }, this);

        this.reComputer();

        _dependManager.dependManager.endCollect();
      }
    }
  }, {
    key: "get",
    value: function get() {
      this.bindAutoReComputed();

      _dependManager.dependManager.collect(this.cpID);

      return this.value;
    }
  }]);

  return Computed;
}();

exports.Computed = Computed;
},{"./dependManager":"src/dependManager.js"}],"src/decorator.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.observable = observable;
exports.computed = computed;

var _observable = require("./observable");

var _extendObservable = require("./extendObservable");

var _computed = require("./computed");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function observable(target, name, descriptor) {
  // var v = descriptor.initializer.call(this);
  var v;

  if (descriptor) {
    v = descriptor.initializer.call(this);
  } else {
    v = target;
  }

  if (_typeof(v) === 'object') {
    (0, _extendObservable.createObservable)(v);
  }

  var observable = new _observable.Observable(v);
  return {
    enumerable: true,
    configurable: true,
    get: function get() {
      return observable.get();
    },
    set: function set(value) {
      if (_typeof(value) === 'object') {
        (0, _extendObservable.createObservable)(value);
      }

      return observable.set(v);
    }
  };
}

function computed(target, name, descriptor) {
  var getter = descriptor.get;
  var computed = new _computed.Computed(target, getter);
  return {
    enumerable: true,
    configurable: true,
    get: function get() {
      computed.target = this;
      return computed.get();
    }
  };
}
},{"./observable":"src/observable.js","./extendObservable":"src/extendObservable.js","./computed":"src/computed.js"}],"src/mobx.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _autorun = require("./autorun");

var _decorator = require("./decorator");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var counter = (0, _decorator.observable)(0);
var foo = (0, _decorator.observable)(0);
var bar = (0, _decorator.observable)(0);
(0, _autorun.autorun)(function () {
  if (counter.get() === 0) {
    console.log('foo', foo.get());
  } else {
    console.log('bar', bar.get());
  }
});
bar.set(10); // 不触发 autorun

counter.set(1); // 触发 autorun

foo.set(100); // 不触发 autorun

bar.set(100); // 触发 autorun
// class Person {
//   @observable
//   name = {
//     key: {
//       key: 1
//     }
//   };
//   @computed get age() {
//     return this.name.key.key;
//   }
// }
// const person = new Person();
// console.log(person.name.key)
// autorun(function () {
//   console.log(person.age);
// })
// person.name.key.key = 3;
// person.name.key.key = 4;

var Index = function Index() {
  _classCallCheck(this, Index);
};

exports.default = Index;
},{"./autorun":"src/autorun.js","./decorator":"src/decorator.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _mobx = _interopRequireDefault(require("./src/mobx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./src/mobx":"src/mobx.js"}],"C:/Users/nearxu/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55703" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/nearxu/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/minMobx.e31bb0bc.js.map