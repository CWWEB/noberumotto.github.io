<template>
  <div class="startmenu" v-show="isShow" ref="startmenu">
    <div class="contaner">
      <div class="logo">
        <img :src="require('../assets/textlogo.png')" />
      </div>
      <div>
        <div
          class="menu-item"
          v-for="(item, index) in data"
          :key="index"
          @mouseenter="showSubmenu(item, true)"
          @mouseleave="showSubmenu(item, false)"
        >
          <div
            class="item"
            v-if="item.type == 'menu'"
            v-on:click="onClick(item)"
          >
            <div class="icon">
              <img
                style="height: 25px"
                :src="require('../assets/' + item.icon + '.png')"
                v-if="item.icon"
              />
            </div>
            <div class="title">{{ item.title }}</div>
            <div class="mark">
              <img :src="require('../assets/right.png')" v-if="item.more" />
            </div>
          </div>

          <div class="splitline" v-if="item.type == 'line'"></div>

          <div
            v-show="item.showmore"
            class="submenu"
            v-for="(menu, index) in item.more"
            :key="index"
            @mouseenter="showSubmenu(item, true)"
            @mouseleave="showSubmenu(item, false)"
          >
            <div
              class="submenu-item"
              v-if="menu.type == 'menu'"
              v-on:click="onClick(item)"
            >
              <div class="icon">
                <img
                  :src="require('../assets/' + menu.icon + '.png')"
                  v-if="item.icon"
                />
              </div>
              <div class="title">{{ menu.title }}</div>
              <div class="mark"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ContextMenu from "./ContextMenu.vue";
export default {
  components: { ContextMenu },
  name: "StartMenu",
  props: {
    data: {
      type: Array,
      default: [],
      submenuTimer: null,
    },
  },
  data() {
    return {
      isShow: false,
    };
  },
  mounted() {
    let t = this;
    document.onmousedown = function (ev) {
      if (ev.button != 2 && ev.target.className == "desktopcontainer") {
        t.isShow = false;
        // this.reject();
      }
    };
  },
  methods: {
    showSubmenu(item, show) {
      if (!item.more) {
        return false;
      }
      if (show) {
        item.showmore = show;
        if (this.submenuTimer != null) {
          clearTimeout(this.submenuTimer);
          this.submenuTimer = null;
        }
      } else if (item.showmore) {
        // console.log("hide");
        this.submenuTimer = setTimeout(() => {
          item.showmore = false;
          // console.log("hide!");
        }, 500);
      } else {
        item.showmore = false;
      }
    },
    onClick(item) {
      this.isShow = false;
      this.resolve(item);
    },
    show() {
      let startmenu = this.$refs.startmenu;
      if (!startmenu) {
        return;
      }
      if (this.isShow) {
        this.isShow = false;
        return;
      }

      this.isShow = true;
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
      return this.promise;
    },
  },
};
</script>

<style scoped>
.submenu {
  position: absolute;
  left: 165px;
  top: 0;
  display: inline-block;

  border: 1px solid #ffffff;
  border-right-color: #6d6d6d;
  border-bottom-color: #6d6d6d;
  background: #b4b4b4;
  box-shadow: 1px 2px 0 0 black;
  box-sizing: border-box;
  min-width: 138px;
}
.submenu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 0;
  box-sizing: border-box;
}
.submenu-item .icon img {
  height: 14px;
}
.contaner {
  display: flex;
}
.logo {
  /* width: 20px; */
  flex: 1;
  background: #808080;
  display: flex;
  align-items: flex-end;
  padding: 3px;
}
.startmenu {
  display: inline-block;
  position: absolute;
  border: 1px solid #ffffff;
  border-right-color: #6d6d6d;
  border-bottom-color: #6d6d6d;
  background: #b4b4b4;
  box-shadow: 1px 2px 0 0 black;
  box-sizing: border-box;
  min-width: 138px;
  bottom: 40px;
  left: 0;
  /* font-size: 14px; */
}
.menu-item {
  box-sizing: border-box;
  padding: 1px;
}
.item:hover,
.submenu-item:hover {
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
.icon {
  padding: 5px 10px;
}
.title {
  flex: 1;
  text-align: left;
}
.mark {
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 3px;
}
.mark img {
  height: 14px;
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
