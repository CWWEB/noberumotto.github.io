<template>
  <div class="folder" ref="folder">
    <window
      :title="'关于 noberumotto'"
      :width="377"
      :height="282"
      :icon="'logo-small'"
      ref="aboutwindow"
      :closeBtn="true"
    >
      <div class="about-panel">
        <div class="icon"><img src="../../assets/logo-small.png" /></div>
        <div class="login-input">
          <p>noberumotto</p>
          <p>这是他的个人网站，并不是windows，它看起来像</p>
          <p>版权所有 (C) noberumotto 个人 2021</p>
          <p>本软件的使用权属于：</p>
          <p>nacat</p>
          <p>所使用的技术</p>
          <p>vue.js</p>

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
      <!-- <div class="item" ref="editmenu" v-on:click="showmenu(1)">编辑(<label>E</label>)</div>
      <div class="item" ref="viewmenu" v-on:click="showmenu(2)">查看(<label>V</label>)</div> -->
      <div class="item" ref="helpmenu" v-on:click="showmenu(3)">
        帮助(<label>H</label>)
      </div>
    </div>
    <div class="border">
      <div class="folder_container" ref="folder_container">
        <shortcut
          v-for="(item, index) in files"
          :key="'folder' + index"
          :icon="item.icon"
          :name="item.name"
          :index="index"
          :type="item.type"
          :selected="item.selected"
          :args="item.args"
          :app="item.app"
          v-on:tap="shortcutTap"
          v-on:dbtap="shortcutDbTap"
          v-on:loaded="shortcutLoaded"
          :color="'#000000'"
        />
        <div class="selecter" ref="selecter"></div>
      </div>
    </div>

    <div class="statusbar">
      {{
        selectedCount > 0 ? "选定了 " + selectedCount + " 个对象" : statusText
      }}
    </div>
  </div>
</template>

<script>
import ContextMenu from "../ContextMenu.vue";
import Shortcut from "../Shortcut.vue";
import { mapState } from "vuex";
import Window from "../Window.vue";
import Btn from "../Btn.vue";

export default {
  components: { Shortcut, Window, Btn, ContextMenu },
  name: "Folder",
  props: {
    /**
     * 进程id，每个app必有
     */
    pid: Number,
    files: Array,
  },
  computed: {
    ...mapState(["client"]),
  },
  data() {
    return {
      //  是否抓住桌面
      isCap: false,
      //  选中项
      selectedCount: 0,
      statusText: "5 个对象",
      // shrotcutList: [
      //   {
      //     icon: "mycomputer",
      //     name: "(C:)",
      //     app: "Folder",
      //     type: "disk",
      //     args: {
      //       title: "C",
      //     },
      //     selected: false,
      //     locationInfo: {
      //       x: 0,
      //       y: 0,
      //       w: 0,
      //       h: 0,
      //     },
      //   },
      // ],
      menubar_contextmenu: [],
    };
  },
  mounted() {
    this.shrotcutList = this.$props.files ? this.$props.files : [];
    // this.createDesktopRightMenu();
    this.handleMousedown();
    this.statusText = this.shrotcutList.length + " 个对象";
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
              title: "关于 noberumotto(A)",
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
    openSelected() {
      this.shrotcutList.forEach((item) => {
        if (item.selected) {
          item.el.open();
        }
      });
    },
    /**
     * 获取选中的数目
     */
    getselectedItemCount() {
      let count = 0;
      this.shrotcutList.forEach((item) => {
        if (item.selected) {
          count++;
        }
      });
      return count;
    },
    //  当每个快捷方式被渲染完成时
    shortcutLoaded(item) {
      this.shrotcutList[item.index].el = item;
      this.shrotcutList[item.index].locationInfo = {
        x: item.$el.getBoundingClientRect().left,
        y: item.$el.getBoundingClientRect().top,
        w: item.$el.offsetWidth,
        h: item.$el.offsetHeight,
      };
      // console.log(this.shrotcutList[item.index].locationInfo)
    },
    // createDesktopRightMenu() {
    //   this.menuData = [
    //     {
    //       title: "刷新",
    //       type: "menu",
    //     },
    //     {
    //       type: "line",
    //     },
    //     {
    //       title: "新建",
    //       type: "menu",
    //     },
    //     {
    //       title: "属性",
    //       type: "menu",
    //     },
    //   ];
    // },
    handleMousedown() {
      //  桌面容器
      let container = this.$refs.folder_container;
      //  右键菜单
      let contextmenu = this.$refs.contextmenu;
      let menubar_contextmenu = this.$refs.menubar_contextmenu;
      //  选择器
      let selecter = this.$refs.selecter;
      let t = this;

      let folder = this.$refs.folder.parentNode.parentNode.parentNode;
      // console.log(folder.parentNode.parentNode.parentNode)

      let clickX, clickY;
      container.onmousedown = function (ev) {
        // ev.stopPropagation();

        menubar_contextmenu.hide();
        //  右键
        if (ev.button == 2) {
          //  桌面右键菜单
          contextmenu.show(ev).then((e) => {
            console.log(e);
          });
        } else {
          //  清除选中
          t.shrotcutList.forEach((item, index) => {
            item.selected = false;
          });

          if (ev.target.className == "folder_container") {
            //  设定状态
            let diffLeft = container.getBoundingClientRect().left;
            let diffTop = container.getBoundingClientRect().top;

            t.isCap = true;
            selecter.style.left = ev.clientX - diffLeft + "px";
            selecter.style.top = ev.clientY - diffTop + "px";
            clickX = ev.clientX;
            clickY = ev.clientY;
          }

          t.selectedCount = t.getselectedItemCount();
        }
      };
      container.onmouseup = function (ev) {
        //  清除状态
        if (t.isCap) {
          t.isCap = false;
          selecter.style.display = "none";

          // //  重置临时选中
          // t.selecterCapList.forEach((index) => {
          //   t.shrotcutList[index].selected = false;
          // });

          // //  重新计算碰撞
          // t.collideHandle();
        }
      };
      container.onmousemove = function (ev) {
        if (!t.isCap) {
          return;
        }
        selecter.style.display = "block";
        let diffLeft = container.getBoundingClientRect().left;
        let diffTop = container.getBoundingClientRect().top;

        let w = ev.clientX - selecter.style.left.replace("px", "") - diffLeft;
        let h = ev.clientY - selecter.style.top.replace("px", "") - diffTop;

        if (clickX > ev.clientX) {
          //  往左了
          selecter.style.left = ev.clientX - diffLeft + "px";

          //  重新计算宽度
          w = clickX - ev.clientX;
        }

        if (clickY > ev.clientY) {
          //  往左了
          selecter.style.top = ev.clientY - diffTop + "px";

          //  重新计算宽度
          h = clickY - ev.clientY;
        }

        selecter.style.width = w + "px";
        selecter.style.height = h + "px";

        t.collideHandle();
        // window.style.top = ev.clientY - diffY + "px";
      };
    },
    //  选择器碰撞处理
    collideHandle() {
      //  选择器
      let selecter = this.$refs.selecter;
      let boxX = selecter.getBoundingClientRect().left;
      let boxY = selecter.getBoundingClientRect().top;
      let t = this;
      let boxMaxX =
        boxX + Number.parseInt(selecter.style.width.replace("px", ""));
      let boxMaxY =
        boxY + Number.parseInt(selecter.style.height.replace("px", ""));

      // console.log(boxX + "," + boxY + "|" + boxMaxX + "," + boxMaxY);
      this.shrotcutList.forEach((item, index) => {
        let itemX = item.locationInfo.x;
        let itemMaxX = itemX + item.locationInfo.w;
        let itemY = item.locationInfo.y;
        let itemMaxY = itemY + item.locationInfo.h;

        // console.log(itemMaxX+","+itemMaxY)
        let isCollide = false;
        if (
          boxX >= itemX &&
          boxX <= itemMaxX &&
          boxY >= itemY &&
          boxY <= itemMaxY
        ) {
          isCollide = true;
          console.log(1);
        }

        if (
          boxX <= itemX &&
          boxMaxX >= itemX &&
          boxY <= itemY &&
          boxMaxY >= itemY
        ) {
          isCollide = true;
          console.log(2);
        }

        if (
          boxX >= itemX &&
          boxX <= itemMaxX &&
          boxY <= itemY &&
          boxMaxY >= itemY
        ) {
          console.log(3);
          isCollide = true;
        }

        if (
          boxMaxX >= itemX &&
          boxX <= itemX &&
          boxY <= itemY &&
          boxMaxY >= itemY
        ) {
          isCollide = true;
          console.log(4);
        }

        if (
          boxX <= itemX &&
          boxMaxX >= itemX &&
          boxY >= itemY &&
          boxY <= itemMaxY
        ) {
          isCollide = true;
        }
        if (isCollide) {
          item.selected = true;
        } else {
          item.selected = false;
        }
        t.selectedCount = t.getselectedItemCount();
      });
    },
    shortcutTap(e) {
      this.shrotcutList.forEach((item, index) => {
        item.selected = e.index == index ? true : false;
      });
      this.selectedCount = this.getselectedItemCount();
    },
    shortcutDbTap(e) {
      // this.runAppList.push({
      //   pid: this.runAppList.length + 1,
      //   name: e.app,
      // });
    },
    about() {
      this.$refs.aboutwindow.show();
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
.folder {
  /* height: 100%; */
}
.border {
  border: 1px solid #6d6d6d;
  border-right-color: #ffffff;
  border-bottom-color: #ffffff;
  /* height: 87%; */
}
.folder_container {
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
  /* height: 100%; */
}
.folder_container .shortcut {
  margin-bottom: 8px;
}
.folder_container .shortcut:last-child {
  margin-bottom: 0;
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
.selecter {
  position: absolute;
  z-index: 2;
  border: 1px dotted #000000;
  width: 0;
  height: 0;
  left: 0;
  right: 0;
}
.statusbar {
  border: 1px solid #6d6d6d;
  border-right-color: #ffffff;
  border-bottom-color: #ffffff;
  margin-top: 2px;
  text-align: left;
  padding: 1px;
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
