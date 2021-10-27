<template>
  <div
    class="textbox"
    v-bind:style="{
      width: width ? width + 'px' : 'auto',
      height: height ? height + 'px' : 'auto',
    }"
  >
    <div class="border">
      <input
        type="text"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "TextBox",
  props: {
    value: String,
    width: {
      type: Number,
      default: 150,
    },
    height: {
      type: Number,
      default: 28,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
.textbox {
  border: 1px solid #656565;
  border-bottom-color: #ffffff;
  border-right-color: #ffffff;
  background: #ffffff;
  /* width: 200px;
  height: 30px; */
  display: inline-block;
  /* box-sizing: border-box; */
}
.border {
  /* margin: 1px; */
  border: 1px solid #000000;
  border-right-color: #f0f0f0;
  border-bottom-color: #f0f0f0;
  height: 100%;
  box-sizing: border-box;
}
input {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  padding: 0 5px;
  box-sizing: border-box;
}
</style>
