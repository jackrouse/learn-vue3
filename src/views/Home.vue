<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <div>{{ userName }}</div>
    <div>{{ $store.state.userName }}</div>
  </div>
</template>

<script>
// @ is an alias to /src
import { computed } from "vue";
import { useStore } from "vuex";
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  beforeCreate() {
    console.log("beforeCreate");
  },
  setup() {
    const store = useStore();
    const userName = computed(() => {
      return store.state.userName;
    });
    console.log("setup");

    return {
      userName
    };
  },
  created() {
    console.log("created");
  }
};
</script>
