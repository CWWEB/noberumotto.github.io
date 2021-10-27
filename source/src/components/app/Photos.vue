<template>
  <div class="photo" ref="photos">
    <message-box ref="msgbox" />
    <window
      :title="'关于 照片'"
      :width="377"
      :height="282"
      :icon="'photos'"
      ref="aboutwindow"
      :closeBtn="true"
    >
      <div class="about-panel">
        <div class="icon"><img src="../../assets/photos.png" /></div>
        <div class="login-input">
          <p>照片</p>
          <p>Windows 21</p>
          <p>版权所有 (C) noberumotto 个人 2021</p>
          <p>本软件的使用权属于：</p>
          <p>nacat</p>

          <btn
            v-on:click.native="$refs.aboutwindow.hide()"
            :width="100"
            :height="25"
            >确定</btn
          >
        </div>
      </div>
    </window>
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
      <div class="photo_container" ref="photo_container">
        <canvas
          ref="canvas"
          v-if="
            file &&
            file.indexOf('http://') == -1 &&
            file.indexOf('https://') == -1
          "
        />
        <img :src="require('../../assets/warning.png')" v-if="isfail" />
        <p v-if="isfail" style="margin-left: 10px">图片损坏</p>
        <img
          v-if="
            !isfail &&
            file &&
            (file.indexOf('http://') != -1 || file.indexOf('https://') != -1)
          "
          :src="file"
        />
        <!-- <img
          v-if="
            file &&
            file.indexOf('http://') == -1 &&
            file.indexOf('https://') == -1
          "
          :src="require('../../assets/' + file)"
          ref="image"
          style="display: none"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import ContextMenu from "../ContextMenu.vue";
import Shortcut from "../Shortcut.vue";
import { mapState } from "vuex";
import MessageBox from "../MessageBox.vue";
import Window from "../Window.vue";
import Btn from "../Btn.vue";

export default {
  components: { Shortcut, ContextMenu, MessageBox, Window, Btn },
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
      isfail: false,
      imageObj: null,
      width: 0,
      height: 0,
    };
  },
  mounted() {
    let t = this;
    this.imageObj = new Image();
    if (
      this.$props.file.indexOf("http://") == -1 &&
      this.$props.file.indexOf("https://") == -1
    ) {
      this.imageObj.onload = function () {
        t.width = this.width;
        t.height = this.height;
        t.handle();
      };
      this.imageObj.src = require("../../assets/" + this.$props.file);
    }
  },
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
              title: "关于 照片(A)",
              type: "menu",
              action: "about",
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
            case "about":
              t.about();
              break;
          }
        });
    },
    handle() {
      console.log(this.width + "," + this.height);
      let canvas = this.$refs.canvas;
      let ctx = canvas.getContext("2d");

      let maxwidth = 400;
      let maxheight = 300;

      //  缩放比例
      if (this.width > maxwidth) {
        let rate = maxwidth / this.width;
        this.width = rate * this.width;
        this.height = rate * this.height;
        // console.log(this.width + "," + this.height);
      }
      if (this.height > maxheight) {
        let rate = maxheight / this.height;
        this.width = rate * this.width;
        this.height = rate * this.height;
        // console.log(this.width + "," + this.height);
      }

      canvas.width = this.width;
      canvas.height = this.height;

      let imgarr = [];
      for (let i = 0; i < this.width * this.height; i++) {
        imgarr.push(i);
      }

      let arr = [];
      for (let i = 0; i < imgarr.length / 20; i++) {
        arr.push(imgarr.splice(imgarr.length * Math.random(), 1));
      }

      ctx.drawImage(this.imageObj, 0, 0, this.width, this.height);

      let imgData = ctx.getImageData(0, 0, this.width, this.height);
      for (var i = 0; i < this.width * this.height; i++) {
        imgData.data[0.1 * imgarr[i] + 10] = 120;
        imgData.data[0.4 * imgarr[i] + 1] = 125;
        imgData.data[20 * imgarr[i] + 5] = parseInt(Math.random() * 125);
        imgData.data[4 * imgarr[i] + 1] = 110;
      }
      ctx.putImageData(imgData, 0, 0);
    },
    /**
     * 结束app，每个必须有
     */
    exit() {
      console.log(this.$props.pid);
      this.$store.dispatch("client/exitapp", this.$props.pid);
    },
    fail() {
      this.isfail = true;
      console.log("img fail");
    },
    about() {
      this.$refs.aboutwindow.show();
    },
  },
};
</script>

<style scoped>
.photo {
}
.border {
  border: 1px solid #6d6d6d;
  border-right-color: #ffffff;
  border-bottom-color: #ffffff;
}
.photo_container img {
  max-height: 100%;
  max-width: 100%;
}
.photo_container {
  position: relative;
  /* width: 100%;
  height: 100%; */
  height: 346px;
  background: #ffffff;
  border: 1px solid #6d6d6d;
  border-right-color: #ccc;
  border-bottom-color: #ccc;

  display: flex;
  align-items: center;
  justify-content: center;
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

.about-panel {
  display: flex;
  text-align: left;
  padding: 10px;
}
.about-panel p {
  margin-top: 0;
}
</style>
