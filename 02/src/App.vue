<template>
  <div>
    <button @click="$store.commit('add', 1)">同步 add</button>
    <button @click="$store.commit('add_1', 1)">同步 add_1</button>
    <button @click="handleAddAsync()">异步 add</button>
    {{ $store.state.count }}
    {{ $store.state.count_1 }}
    {{$store.getters.sumCount}}
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      $testProxy: "testProxy"
    };
  },
  created() {
    console.log(this);
    console.log(this.$data);
    console.log(this.testProxy);
  },
  methods: {
    handleAddAsync() {
      const resPromise = this.$store.dispatch("add", 1);
      resPromise.then(res => {
        console.log(res);
      });
      console.log(resPromise);
    }
  }
};
</script>
