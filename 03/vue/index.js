const DOM_EVENTS = ["click"];

// 冬瓜冬瓜我是西瓜

function defineReactive(obj, key, value) {
  observe(value);

  // 对每一个观测属性建立一个dep
  const dep = new Dep();

  Object.defineProperty(obj, key, {
    get() {
      /**
       * 如何拿到观察者, 收集观察者的时机?
       * Watcher实例化时
       */
      Dep.target && dep.addDep(Dep.target);

      return value;
    },
    set(newValue) {
      if (newValue !== value) {
        observe(newValue);

        value = newValue;

        // 通知更新
        dep.notify();
      }
    },
  });
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

function observe(obj) {
  if (!isObject(obj)) {
    return;
  }

  // 遍历对象自己的属性（非原型属性）变成响应式
  Object.keys(obj).forEach((key) => {
    defineReactive(obj, key, obj[key]);
  });
}

function proxy(vm, data) {
  Object.keys(data).forEach((key) => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key];
      },
      set(newValue) {
        vm.$data[key] = newValue;
      },
    });
  });
}

class Vue {
  constructor(options) {
    this.$data = options.data;
    this.$methods = options.methods;

    // 响应式数据处理
    observe(options.data);

    // 把data的所有属性代理到vue实例上
    proxy(this, options.data);

    // 指令解析
    new Compile(options.el, this);
  }
}

class Compile {
  constructor(el, vueVm) {
    this.$el = document.querySelector(el);
    this.$vueVm = vueVm;

    // 对vue程序的根节点进行遍历
    this.compile(this.$el);
  }

  compile($el) {
    $el.childNodes.forEach((node) => {
      if (node.nodeType === 3) {
        if (/\{\{(.*)\}\}/.test(node.textContent)) {
          this.complieText(node);
        }
      } else if (node.nodeType === 1) {
        this.complieElement(node);
      }

      if (node.childNodes) {
        this.compile(node);
      }
    });
  }

  complieText(node) {
    this.update(node, RegExp.$1, "text");
  }

  complieElement(node) {
    const attrs = node.attributes;

    Array.from(attrs).forEach((attr) => {
      const attrName = attr.name;
      const attrValue = attr.value;
      if (attrName.indexOf("v-") === 0) {
        const dirName = attrName.substring(2);

        this[dirName] && this[dirName](node, attrValue);
      } else if (attrName.indexOf("@") === 0) {
        const dirName = attrName.substring(1);

        this.bindEvent(node, dirName, attrValue);
      }
    });
  }

  bindEvent(node, eventName, exp) {
    const fn = this.$vueVm.$methods[exp];

    if (DOM_EVENTS.indexOf(eventName) !== -1 && fn) {
      node.addEventListener(eventName, fn.bind(this.$vueVm));
    }
  }

  // v-html
  html(node, exp) {
    this.update(node, exp, "html");
  }

  // v-model
  model(node, exp) {
    this.update(node, exp, "model");
  }

  // v-text
  text(node, exp) {
    this.update(node, exp, "text");
  }

  update(node, exp, dir) {
    const fn = this[dir + "Updater"];
    fn && fn(node, this.$vueVm.$data[exp]);

    new Watcher(this.$vueVm, exp, (val) => {
      fn && fn(node, val);
    });
  }

  textUpdater(node, val) {
    node.textContent = val;
  }

  htmlUpdater(node, val) {
    node.innerHTML = val;
  }

  modelUpdater(node, val) {
    node.value = val;
  }
}

// 建立观察者
class Watcher {
  constructor(vueVm, key, updateFn) {
    this.$vueVm = vueVm;
    this.$key = key;
    this.$updateFn = updateFn;

    Dep.target = this;
    vueVm.$data[key];
    Dep.target = null;
  }

  update() {
    // 更新函数存是否有必要处理this指向
    this.$updateFn(this.$vueVm.$data[this.$key]);
  }
}

// 发布者，收集所有观察者，当观察属性变化时调用观察者的更新函数
class Dep {
  constructor() {
    this.deps = [];
  }

  addDep(watcher) {
    this.deps.push(watcher);
  }

  notify() {
    this.deps.forEach((dep) => dep.update());
  }
}
