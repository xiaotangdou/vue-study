/**
 * 1、state数据响应式
 * 2、实现install，vue原型绑定$store => this.$store.state
 * 3、实现module，状态分割
 * 4、state对象守护, get/set对象存取器
 */

let _Vue = null;

class Store {
  constructor(options) {
    this._mutationsMap = options.mutations;
    this._actionsMap = options.actions;
    this._gettersMap = options.getters;

    this.getters = {};

    const store = this;
    const { commit, dispatch } = this;

    this.commit = function(...opts) {
      return commit.call(store, ...opts);
    };

    this.dispatch = function(...opts) {
      return dispatch.call(store, ...opts);
    };

    const computed = {};

    Object.keys(this._gettersMap).forEach((key) => {
      computed[key] = function(vm) {
        return store._gettersMap[key](vm.$data.$state);
      };

      Object.defineProperty(store.getters, key, {
        get: () => store._vueVm[key],
        enumerable: true,
      });
    });

    this._vueVm = new _Vue({
      data: function() {
        return {
          $state: options.state,
        };
      },
      computed,
    });

    // this.getters = this._vueVm;
  }

  get state() {
    return this._vueVm.$data.$state;
  }

  set state(val) {
    throw new Error("error");
  }

  commit(type, payload) {
    if (this._mutationsMap[type]) {
      this._mutationsMap[type](this.state, payload);
    }
  }

  dispatch(type, payload) {
    if (this._actionsMap[type]) {
      this._actionsMap[type](this, payload);
    }
  }

  // 箭头函数静态作用域绑定this
  // commit = (type, payload) => {
  //   if (this._mutationsMap[type]) {
  //     this._mutationsMap[type](this.state, payload);
  //   }
  // };

  // dispatch = (type, payload) => {
  //   if (this._actionsMap[type]) {
  //     this._actionsMap[type](this, payload);
  //   }
  // }
}

function install(Vue) {
  _Vue = Vue;

  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    },
  });
}

export default {
  Store,
  install,
};
