<template>
  <div>test create</div>
</template>

<script>
import create from "./helpers/create.js";
import Notice from "./components/Notice.vue";

export default {
  name: "App",
  mounted() {
    create(Notice, { duration: 3000 }).show();
  }
};
</script>

