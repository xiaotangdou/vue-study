/**
 * 1、state数据响应式
 * 2、实现install，vue原型绑定$store => this.$store.state
 * 3、state对象守护, get/set对象存取器
 * 4、实现module，状态分割
 * 5、容错处理
 */

let _Vue = null;

// 天王盖地虎

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
  }

  get state() {
    return this._vueVm.$data.$state;
  }

  set state(val) {
    throw new Error("error");
  }

  commit(type, payload) {
    const entry = this._mutationsMap[type];

    if (!entry) {
      return;
    }

    entry(this.state, payload);
  }

  dispatch(type, payload) {
    const entry = this._actionsMap[type];

    if (!entry) {
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        entry(this, payload).then((...opts) => {
          resolve(...opts);
        });
      } catch (err) {}
    });
  }
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
