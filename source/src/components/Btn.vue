<template>
  <div class="button">
    <div
      class="border"
      v-bind:style="{
        width: width ? width + 'px' : 'auto',
        height: height ? height + 'px' : 'auto',
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Btn",
  props: {
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style scoped>
.button {
  display: inline-block;
  background: #b4b4b4;
  box-shadow: 1px 1px 0 0 black;
  box-sizing: border-box;
  /* position: relative; */
  /* width: 100px;
  height: 27px; */
}
.border {
  /* margin: 1px; */
  border: 1px solid #ffffff;
  border-right-color: #6d6d6d;
  border-bottom-color: #6d6d6d;
  /* position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0; */
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  /* font-weight: bold; */
  box-sizing: border-box;
  padding: 2px;

}
.button:active {
  background: #9f9f9f;
}
</style>
