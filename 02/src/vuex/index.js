/**
 * 1、实现install，vue原型绑定$store => this.$store.state
 * 2、实现module，状态分割
 */

let _Vue = null;

class Store {
  constructor(options) {
    this.state = new _Vue({
      data: function() {
        return {};
      },
    });
  }
}

function install(Vue) {
  _Vue = Vue;

  Vue.prototype.$store = {};
}

export default {
  Store,
  install,
};
