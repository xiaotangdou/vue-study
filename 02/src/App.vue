<template>
  <div>
    <button>click me</button>
    {{ $store.state.count }}
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
