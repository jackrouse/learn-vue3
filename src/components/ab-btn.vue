<template>
  <button @click="handleClick" v-bind="$attrs">
    <slot />
  </button>
</template>

<script>
export default {
  name: "ab-btn",
  inheritAttrs: false,
  props: {
    // loading: {
    //   type: Boolean,
    //   default: false
    // },
    // disabled: {
    //   type: Boolean,
    //   default: false
    // }
    loading: Boolean,
    disabled: Boolean
  },
  setup(props, context) {
    function handleClick(event) {
      if (props.loading || props.disabled) {
        return;
      }
      context.emit("cclick", event);
    }
    return {
      handleClick
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
