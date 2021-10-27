<template>
  <div class="photo" ref="photos">
    <context-menu :data="menubar_contextmenu" ref="menubar_contextmenu" />
    <div class="header">
      <div class="item" ref="filemenu" v-on:click="showmenu(0)">
        文件(<label>F</label>)
      </div>
      <div class="item" ref="helpmenu" v-on:click="showmenu(3)">
        帮助(<label>H</label>)
      </div>
    </div>
    <div class="border">
      <div class="photo_container" ref="photo_container"></div>
    </div>
  </div>
</template>

<script>
import ContextMenu from "../ContextMenu.vue";
import Shortcut from "../Shortcut.vue";
import { mapState } from "vuex";

export default {
  components: { Shortcut, ContextMenu },
  name: "Photos",
  props: {
    /**
     * 进程id，每个app必有
     */
    pid: Number,
    /**
     * 照片路径或URL
     */
    file: String,
  },
  computed: {
    ...mapState(["client"]),
  },
  data() {
    return {
      menubar_contextmenu: [],
    };
  },
  mounted() {},
  methods: {
    showmenu(num) {
      let x, y;
      let t = this;
      switch (num) {
        case 0:
          //  文件
          x = this.$refs.filemenu.getBoundingClientRect().left;
          y = this.$refs.filemenu.getBoundingClientRect().top;
          this.menubar_contextmenu = [];
          if (this.selectedCount > 0) {
            this.menubar_contextmenu.push({
              title: "打开(O)",
              type: "menu",
              action: "open",
            });
          } else {
            this.menubar_contextmenu.push({
              title: "新建(W)",
              type: "menu",
              disabled: true,
            });
          }
          this.menubar_contextmenu.push({
            title: "删除(D)",
            type: "menu",
            disabled: true,
          });
          this.menubar_contextmenu.push({
            type: "line",
          });
          this.menubar_contextmenu.push({
            title: "关闭(C)",
            type: "menu",
            action: "exit",
          });

          break;
        case 3:
          //  帮助
          x = this.$refs.helpmenu.getBoundingClientRect().left;
          y = this.$refs.helpmenu.getBoundingClientRect().top;
          this.menubar_contextmenu = [
            {
              title: "帮助主题(H)",
              type: "menu",
              disabled: true,
            },
            {
              type: "line",
            },
            {
              title: "关于 noberumotto(A)",
              type: "menu",
            },
          ];
          break;
      }
      let contextmenu = this.$refs.menubar_contextmenu;
      contextmenu
        .show({
          clientX: x - 4,
          clientY: y + 14,
        })
        .then((e) => {
          switch (e.action) {
            case "exit":
              t.exit();
              break;
            case "open":
              t.openSelected();
              break;
          }
        });
    },

    /**
     * 结束app，每个必须有
     */
    exit() {
      console.log(this.$props.pid);
      this.$store.dispatch("client/exitapp", this.$props.pid);
    },
  },
};
</script>

<style scoped>
.border {
  border: 1px solid #6d6d6d;
  border-right-color: #ffffff;
  border-bottom-color: #ffffff;
}
.photo_container {
  position: relative;
  /* width: 100%;
  height: 100%; */
  height: 400px;
  background: #ffffff;
  border: 1px solid #6d6d6d;
  border-right-color: #ccc;
  border-bottom-color: #ccc;
  /* margin: 1px; */
  display: flex;
  align-items: flex-start;
  /* flex-direction: column; */
  flex-wrap: wrap;
  align-content: flex-start;
}
.header {
  display: flex;
  align-items: center;
  margin-top: 1px;
}
.header .item {
  padding: 2px 6px;
  text-align: center;
}
.header .item label {
  text-decoration: underline;
}
.header .item:hover {
  background: #0000aa;
  color: #ffffff;
}
</style>
