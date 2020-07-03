import Vue from "vue";

export default function create(Component, props) {
  const CompConstructor = Vue.extend({
    render(h) {
      return h(Component, { props });
    },
  });

  const vm = new CompConstructor().$mount();
  const comp = vm.$children[0];

  // 村长喊你来搬砖
  comp.remove = function() {
    document.body.removeChild(vm.$el);
    vm.$destroy();
  };

  document.body.appendChild(vm.$el);

  return comp;
}
