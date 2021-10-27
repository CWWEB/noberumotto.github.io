<template>
  <div class="contextmenu" v-show="isShow" ref="contextmenu">
    <div class="menu-item" v-for="(item, index) in data" :key="index">
      <div
        class="item"
        v-if="item.type == 'menu' && !item.disabled"
        v-on:click.stop="onClick(item)"
      >
        <div class="icon">
          <img
            :src="require('../assets/menu/' + icon + '.png')"
            v-if="item.icon"
          />
        </div>
        <div class="title">{{ item.title }}</div>
        <div class="mark"></div>
      </div>
      <div class="disabled-item" v-if="item.disabled">
        <div class="icon">
          <img
            :src="require('../assets/menu/' + icon + '.png')"
            v-if="item.icon"
          />
        </div>
        <div class="title">{{ item.title }}</div>
        <div class="mark"></div>
      </div>

      <div class="splitline" v-if="item.type == 'line'"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContextMenu",
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      isShow: false,
      mouseX: 0,
      mouseY: 0,
    };
  },
  mounted() {
    let t = this;
  },
  methods: {
    onlistenmouse() {
      // console.log(1);
      let t = this;
      window.onmousedown = function (ev) {
        // if (ev.button != 2 && ev.target.className == "desktopcontainer") {
        //   t.isShow = false;
        //   // this.reject();
        // }
        if (ev.target.className != "title" && ev.target.className != "item") {
          t.isShow = false;
        }

        //t.isShow = false;
        this.mouseX = ev.clientX;
        this.mouseY = ev.clientY;
      };
      // window.addEventListener("onmousedown", this.onMouseEvent);
      // window.onmousedown = function (ev) {
      //   // if (ev.button != 2 && ev.target.className == "desktopcontainer") {
      //   //   t.isShow = false;
      //   //   // this.reject();
      //   // }
      //   t.isShow = false;
      //   this.mouseX = ev.clientX;
      //   this.mouseY = ev.clientY;
      // };
    },
    onMouseEvent(ev) {
      console.log(0);
      this.isShow = false;
      this.mouseX = ev.clientX;
      this.mouseY = ev.clientY;
      window.removeEventListener("onmousedown", this.onMouseEvent);
    },
    onClick(item) {
      this.isShow = false;
      this.resolve(item);
    },
    showinmouse() {
      return this.show({
        clientX: this.mouseX,
        clientY: this.mouseY,
      });
    },
    hide() {
      this.isShow = false;
    },
    show(ev) {
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
      if (this.isShow) {
        this.isShow = false;
        return this.promise;
      }
      let contextmenu = this.$refs.contextmenu;
      if (!contextmenu) {
        return;
      }

      contextmenu.style.left = ev.clientX + 5 + "px";
      contextmenu.style.top = ev.clientY + 5 + "px";

      this.isShow = true;

      this.onlistenmouse();
      return this.promise;
    },
  },
};
</script>

<style scoped>
.contextmenu {
  display: inline-block;
  position: fixed;
  border: 1px solid #ffffff;
  border-right-color: #6d6d6d;
  border-bottom-color: #6d6d6d;
  background: #b4b4b4;
  box-shadow: 1px 2px 0 0 black;
  box-sizing: border-box;
  min-width: 138px;
  z-index: 8;
}
.menu-item {
  box-sizing: border-box;
  padding: 1px;
}
.item:hover {
  background: #0000aa;
  color: #ffffff;
}
.item:active {
  background: #7e7e8d;
}
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 0;
  box-sizing: border-box;
}
.disabled-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 0;
  box-sizing: border-box;
  color: #868a8e;
}
.icon {
  width: 30px;
}
.title {
  flex: 1;
  text-align: left;
}
.mark {
  width: 30px;
}
.splitline {
  height: 1px;
  width: 100%;
  margin: 3px 0;
  background: #8d9194;
  border-top: 1px solid #8d9194;

  border-bottom: 1px solid #ffffff;
  box-sizing: border-box;
}
</style>
