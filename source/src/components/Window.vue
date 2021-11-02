<template>
  <div
    class="window"
    ref="window"
    v-show="isshow"
    v-if="isrender"
    v-bind:style="{
      width: width ? width + 'px' : 'auto',
      height: height ? height + 'px' : 'auto',
    }"
  >
    <div class="border">
      <div class="header" ref="titlebar">
        <div class="left" v-on:dblclick="toMax">
          <div class="titleicon">
            <img
              :src="require('../assets/' + titleIcon + '.png')"
              v-if="titleIcon"
            />
          </div>
          <div class="title">{{ title }}</div>
        </div>
        <div class="right">
          <btn v-if="helpBtn" :width="24" :height="24">?</btn>
          <btn
            v-if="closeBtn"
            v-on:click.native="clickBtn(0)"
            :width="22"
            :height="22"
            :key="'wbtn_0_' + wid"
            >×</btn
          >
        </div>
      </div>
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Btn from "./Btn.vue";
export default {
  components: { Btn },
  name: "Window",
  props: {
    title: String,
    // icon: String,
    //  标题栏图标
    titleIcon: String,
    closeBtn: Boolean,
    helpBtn: Boolean,
    width: Number,
    height: Number,
    canMax: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(["client"]),
  },
  data() {
    return {
      //  窗口唯一ID
      wid: 0,
      img: "",
      browserWidth: 0,
      browserHeight: 0,
      isshow: false,
      isrender: true,
      isCap: false,
      isMax: false,
      x: "",
      y: "",
    };
  },
  mounted() {
    this.browserWidth = window.innerWidth;
    this.browserHeight = window.innerHeight;

    // console.log(this.browserWidth);
    this.init();
    this.windowOpen();
    this.click();
  },

  methods: {
    init() {
      let window = this.$refs.window;
      let titlebar = this.$refs.titlebar;
      let t = this;
      //  调整窗口位置居中

      //  获取窗口宽高
      let width = window.style.width.replace("px", "");
      let height = window.style.height.replace("px", "");

      window.style.left = this.browserWidth / 2 - width / 2 + "px";
      window.style.top = this.browserHeight / 2 - height / 2 + "px";

      window.onmousedown = function (ev) {
        t.click();
        ev.stopPropagation();
      };
      //  设置拖拽
      let diffX, diffY;
      titlebar.onmousedown = function (ev) {
        //  不是左键点击不处理
        if (
          ev.button != 0 ||
          (ev.target.className != "title" &&
            ev.target.className != "header" &&
            ev.target.className != "left")
        ) {
          // console.log("非标题栏区域点击" + ev.target.className);
          return;
        }

        if (titlebar.setCapture) {
          titlebar.setCapture();
        }

        t.isCap = true;
        diffX = ev.clientX - window.offsetLeft;
        diffY = ev.clientY - window.offsetTop;
      };

      window.onmousemove = function (ev) {
        if (!t.isCap) {
          return;
        }

        window.style.left = ev.clientX - diffX + "px";
        window.style.top = ev.clientY - diffY + "px";
      };
      window.onmouseup = function (ev) {
        t.isCap = false;
        // document.onmousemove = document.onmouseup = null;
        if (titlebar.releaseCapture) {
          titlebar.releaseCapture();
        }
      };
    },
    windowOpen() {
      let list = this.$store.state.client.windowList;
      let wid = list.length + 1;
      this.wid = wid;
      let window = { wid: wid, el: this.$refs.window };
      list.push(window);
      this.$store.dispatch("client/set", {
        windowList: list,
      });
    },
    click() {
      let wid = this.wid;
      let list = this.$store.state.client.windowList;
      list.forEach((item) => {
        if (item.wid == wid) {
          item.el.style.zIndex = 3;
          item.el.classList.remove("deactivated");
          item.el.firstChild.firstChild.style.background = "#0000aa";
          item.el.firstChild.firstChild.style.color = "#ffffff";
        } else {
          item.el.style.zIndex = 1;
          item.el.classList.add("deactivated");
          item.el.firstChild.firstChild.style.background = "#808080";
          item.el.firstChild.firstChild.style.color = "#b4b4b4";
        }
      });
    },
    onBtnClick(btnNumber) {
      if (this.btnClickCallback) {
        this.btnClickCallback(btnNumber);
      } else {
        this.close();
      }
    },
    hide() {
      this.isshow = false;

    },
    close() {
      this.isshow = false;

      //  从store中移除
      let window = this.$refs.window;

      let list = this.$store.state.client.windowList;

      let newList = [];
      list.forEach((item) => {
        if (item != window) {
          newList.push(item);
        }
      });
      this.$store.dispatch("client/set", {
        windowList: newList,
      });

      //  清除渲染
      this.isrender = false;
    },
    clickBtn(btn) {
      if (btn == 0) {
        this.hide();
      }
      this.resolve(btn);
    },
    show() {
      this.click();
      this.isshow = true;
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
      return this.promise; //返回promise对象,给父级组件调用
    },
    toMax() {
      if (!this.$props.canMax) {
        return;
      }
      let window = this.$refs.window;
      if (this.isMax) {
        //  还原
        window.style.left = this.x;
        window.style.top = this.y;
        window.style.width = this.$props.width
          ? this.$props.width + "px"
          : "auto";
        window.style.height = this.$props.height
          ? this.$props.height + "px"
          : "auto";
      } else {
        //  最大化

        //  保存状态
        this.x = window.getBoundingClientRect().left + "px";
        this.y = window.getBoundingClientRect().top + "px";

        window.style.left = 0;
        window.style.top = 0;
        window.style.width = this.browserWidth + "px";
        window.style.height = this.browserHeight + "px";
      }
      this.isMax = !this.isMax;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.deactivated .header {
  background: #808080;
  color: #b4b4b4;
}
.window {
  position: fixed;
  background: #c3c7cb;
  box-shadow: 2px 3px 0 0 black;

  min-width: 300px;
  box-sizing: border-box;
}
.border {
  margin: 1px;
  border: 1px solid #ffffff;
  border-right-color: #656566;
  border-bottom-color: #656566;
  padding: 2px;
  height: 100%;
  box-sizing: border-box;
}
.header {
  background: #0000aa;
  color: #ffffff;
  padding: 2px 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 2px;
}
.left {
  flex: 1;
  text-align: left;
  display: flex;
  align-items: center;
}
.content {
  /* padding: 10px; */
  /* display: flex; */
  /* height: 100%; */
}
.icon {
  margin-right: 20px;
}
.titleicon img {
  height: 12px;
  margin-right: 5px;
}
</style>
