<template>
  <div class="messagebox">
    <window
      :title="title"
      ref="window"
      :closeBtn="true"
      :width="180"
      :height="100"
    >
      <div class="content">
        <div class="icon" v-if="icon && icon != ''">
          <img :src="require('../assets/' + icon + '.png')" />
        </div>
        <p>{{ content }}</p>
      </div>
    </window>
  </div>
</template>

<script>
import Window from "./Window.vue";
export default {
  components: { Window },
  name: "Messagebox",
  props: {
    icon: String,
    // title: String,
    // content: String,
    // isshow: Boolean,
  },
  data() {
    return {
      title: "",
      content: "",
    };
  },
  methods: {
    show(title, content) {
      this.title = title;
      this.content = content;
      this.$refs.window.show().then((e) => {
        if (e == 0) {
          this.$refs.window.hide();
        }
      });
    },
  },
};
</script>

<style scoped>
.content{
  padding:10px;
  display: flex;
}
</style>
