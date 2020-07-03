### 问题扩展

##### 1、bind 函数的实现

##### 2、vuex 实现

##### 3、vue 数据代理,如何禁用 vue 数据代理

[This link](https://cn.vuejs.org/v2/api/index.html#data)

```text
实例创建之后，可以通过 vm.$data 访问原始数据对象。Vue 实例也代理了 data 对象上所有的 property，因此访问 vm.a 等价于访问 vm.$data.a。

以 _ 或 $ 开头的 property 不会被 Vue 实例代理，因为它们可能和 Vue 内置的 property、API 方法冲突。你可以使用例如 vm.$data._property 的方式访问这些 property。
```

##### 4、树形组件
