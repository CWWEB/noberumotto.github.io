<template>
  <div class="app">
    <window
      :titleIcon="icon"
      :title="title"
      :closeBtn="true"
      ref="window"
      :icon="err ? 'warning' : ''"
      :width="width"
      :height="height"
      :canMax="canMax"
    >
      <!-- <mycomputer v-if="info.name == 'Mycomputer'" /> -->
      <folder
        v-if="info.name == 'Folder'"
        :files="info.args.data"
        :pid="info.pid"
      />

      <photos
        v-if="info.name == 'Photos'"
        :file="info.args.data"
        :pid="info.pid"
      />
      <notepad
        v-if="info.name == 'Notepad'"
        :file="info.args.data"
        :pid="info.pid"
      />
      <p v-if="err">找不到该应用 {{ info.name }}</p>
    </window>
  </div>
</template>

<script>
import Window from "../Window.vue";
import Folder from "./Folder.vue";
import Notepad from "./Notepad.vue";
import Photos from "./Photos.vue";
export default {
  components: { Window, Folder, Photos, Notepad },
  name: "App",
  props: {
    info: {
      pid: Number,
      name: String,
      args: Object,
    },
  },
  data() {
    return {
      title: "",
      icon: "",
      err: false,
      width: 200,
      height: null,
      canMax: false,
    };
  },
  mounted() {
    this.loadAppInfo();
    this.$refs.window.show().then((btn) => {
      if (btn == 0) {
        //  关闭app
        this.$emit("close", this.$props.info);
      }
    });
  },
  methods: {
    loadAppInfo() {
      switch (this.$props.info.name) {
        case "Folder":
          // console.log(this.$props.info);
          if (this.$props.info.args) {
            //  存在参数是打开了文件夹
            this.title = this.$props.info.args.title;
            // this.icon = "folder";
            this.icon = this.$props.info.args.icon
              ? this.$props.info.args.icon
              : "folder";
            this.width = 600;
            // this.height = 500;
          } else {
            this.title = "我的电脑";
            this.icon = "shortcut/mycomputer";
            this.width = 500;
            this.height = 500;
          }
          break;
        case "Photos":
          this.title = "照片";
          this.canMax = true;
          this.icon = "photos";
          this.width = 500;
          this.height = 400;

          if (this.$props.info.args) {
            this.title = "照片 - " + this.$props.info.args.subtitle;

            let file = this.$props.info.args.data;
            if (file) {
              if (
                file.indexOf("http://") != -1 ||
                file.indexOf("https://") != -1
              ) {
                this.title = "网络照片 - " + this.$props.info.args.subtitle;
                this.icon = "webphoto";
              }
            }
          }

          break;
        case "Notepad":
          this.title = "记事本";
          this.icon = "txt";
          this.width = 500;
          this.height = 700;

          if (this.$props.info.args) {
            this.title = this.$props.info.args.subtitle + " - 记事本";

            let file = this.$props.info.args.data;
            // if (file) {
            //   if (
            //     file.indexOf("http://") != -1 ||
            //     file.indexOf("https://") != -1
            //   ) {
            //     this.title = "网络照片 - " + this.$props.info.args.subtitle;
            //     this.icon = "webphoto";
            //   }
            // }
          }

          break;
        default:
          //  找不到
          this.title = "错误";
          this.icon = "warning";
          this.err = true;
      }
    },
  },
};
</script>

<style scoped>
</style>
