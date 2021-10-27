<template>
  <div class="desktopcontainer" ref="desktop_container">
    <context-menu :data="menuData" ref="desktop_contextmenu" />
    <shortcut
      v-for="(item, index) in shrotcutList"
      :key="'desktop' + index"
      :icon="item.icon"
      :name="item.name"
      :index="index"
      :selected="item.selected"
      :app="item.app"
      :args="item.args"
      v-on:tap="shortcutTap"
      v-on:dbtap="shortcutDbTap"
      v-on:loaded="shortcutLoaded"
    />
    <app
      v-for="item in client.runAppList"
      :key="item.pid"
      :info="item"
      v-on:close="onAppClose"
    />
    <div class="selecter" ref="selecter"></div>
  </div>
</template>

<script>
import Btn from "./Btn.vue";
import App from "./app/App.vue";
import { mapState } from "vuex";

import ContextMenu from "./ContextMenu.vue";
import Shortcut from "./Shortcut.vue";
export default {
  components: { Btn, ContextMenu, Shortcut, App },
  name: "Desktopcontainer",
  props: {},
  computed: {
    ...mapState(["client"]),
  },
  data() {
    return {
      //  是否抓住桌面
      isCap: false,
      menuData: [],
      isshowMenu: false,
      shrotcutList: [
        {
          icon: "shortcut/mycomputer",
          name: "我的电脑",
          app: "Folder",
          selected: false,
          locationInfo: {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
          },
          args: {
            title: "我的电脑",
            icon: "shortcut/mycomputer",
            data: [
              {
                icon: "mycomputer",
                name: "(C:)",
                app: "Folder",
                type: "disk",
                args: {
                  title: "(C:)",
                  data: [
                    {
                      name: "My photos",
                      app: "Folder",
                      type: "folder",
                      args: {
                        title: "My photos",
                        data: [
                          {
                            name: "project eye 截图",
                            app: "Photos",
                            type: "photo",
                            args: {
                              title: "My photos",
                              subtitle: "project eye",
                              data: "https://raw.githubusercontent.com/Planshit/ProjectEye/master/screenshot/tipwindow.jpg",
                            },
                          },
                          {
                            name: "狸花猫",
                            app: "Photos",
                            type: "photo",
                            args: {
                              title: "My photos",
                              subtitle: "狸花猫",
                              data: "data/photos/lihuamao.jpg",
                            },
                          },
                        ],
                      },
                    },
                    //  我的文档
                    {
                      name: "My Documents",
                      app: "Folder",
                      type: "folder",
                      args: {
                        title: "My Documents",
                        data: [
                          {
                            name: "试试记事本",
                            app: "Notepad",
                            type: "txt",
                            args: {
                              title: "试试记事本",
                              subtitle: "试试记事本",
                              data: "data/txt/test.txt",
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
                selected: false,
                locationInfo: {
                  x: 0,
                  y: 0,
                  w: 0,
                  h: 0,
                },
              },
              {
                icon: "mycomputer",
                name: "(D:)",
                app: "Folder",
                type: "disk",
                args: {
                  title: "(D:)",
                },
                selected: false,
                locationInfo: {
                  x: 0,
                  y: 0,
                  w: 0,
                  h: 0,
                },
              },
            ],
          },
        },
        {
          icon: "recycle",
          name: "回收站",
          app: "Mydocuments",
          selected: false,
          locationInfo: {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
          },
        },
        // {
        //   icon: "mycomputer",
        //   name: "我的电脑",
        //   selected: false,
        // },
        // {
        //   icon: "mycomputer",
        //   name: "我的电脑",
        //   selected: false,
        // },
        // {
        //   icon: "mycomputer",
        //   name: "我的电脑",
        //   selected: false,
        // },
      ],
      //  运行的app集合
      runAppList: [],
    };
  },
  mounted() {
    this.createDesktopRightMenu();
    this.handleMousedown();
  },
  methods: {
    //  当每个快捷方式被渲染完成时
    shortcutLoaded(item) {
      this.shrotcutList[item.index].locationInfo = {
        x: item.$el.getBoundingClientRect().left,
        y: item.$el.getBoundingClientRect().top,
        w: item.$el.offsetWidth,
        h: item.$el.offsetHeight,
      };
    },
    createDesktopRightMenu() {
      this.menuData = [
        {
          title: "刷新",
          type: "menu",
        },
        {
          type: "line",
        },
        {
          title: "新建",
          type: "menu",
        },
        {
          title: "属性",
          type: "menu",
        },
      ];
    },
    handleMousedown() {
      //  桌面容器
      let container = this.$refs.desktop_container;
      //  右键菜单
      let contextmenu = this.$refs.desktop_contextmenu;
      //  选择器
      let selecter = this.$refs.selecter;
      let t = this;

      let clickX, clickY;
      container.onmousedown = function (ev) {
        //  右键
        if (ev.button == 2 && ev.target.className == "desktopcontainer") {
          // console.log(ev.target.className)
          //  桌面右键菜单
          contextmenu.show(ev).then((e) => {
            console.log(e);
          });
          ev.stopPropagation();
        } else {
          //  清除选中
          t.shrotcutList.forEach((item, index) => {
            item.selected = false;
          });

          if (ev.target.className == "desktopcontainer") {
            //  设定状态
            t.isCap = true;
            selecter.style.left = ev.clientX + "px";
            selecter.style.top = ev.clientY + "px";
            clickX = ev.clientX;
            clickY = ev.clientY;
          }
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
      window.onmousemove = function (ev) {
        if (!t.isCap) {
          return;
        }
        selecter.style.display = "block";

        let w = ev.clientX - selecter.style.left.replace("px", "");
        let h = ev.clientY - selecter.style.top.replace("px", "");

        if (clickX > ev.clientX) {
          //  往左了
          selecter.style.left = ev.clientX + "px";

          //  重新计算宽度
          w = clickX - ev.clientX;
        }

        if (clickY > ev.clientY) {
          //  往左了
          selecter.style.top = ev.clientY + "px";

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
        }

        if (
          boxX <= itemX &&
          boxMaxX >= itemX &&
          boxY <= itemY &&
          boxMaxY >= itemY
        ) {
          isCollide = true;
        }

        if (
          boxX >= itemX &&
          boxX <= itemMaxX &&
          boxY <= itemY &&
          boxMaxY >= itemY
        ) {
          isCollide = true;
        }

        if (isCollide) {
          item.selected = true;
        } else {
          item.selected = false;
        }
      });
    },
    shortcutTap(e) {
      this.shrotcutList.forEach((item, index) => {
        item.selected = e.index == index ? true : false;
      });
    },
    shortcutDbTap(e) {
      // this.runAppList.push({
      //   pid: this.runAppList.length + 1,
      //   name: e.app,
      // });
    },
    onAppClose(app) {
      //  销毁app
      let runAppList = this.$store.state.client.runAppList;
      runAppList.forEach((item, index) => {
        if (item.pid == app.pid) {
          runAppList.splice(index, 1);
          return;
        }
      });

      this.$store.dispatch("client/set", {
        runAppList: runAppList,
      });
    },
  },
};
</script>

<style scoped>
.desktopcontainer {
  width: 100%;
  height: 97%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: flex-start;
}
.desktopcontainer .shortcut {
  margin-bottom: 8px;
}
.desktopcontainer .shortcut:last-child {
  margin-bottom: 0;
}
.selecter {
  position: absolute;
  z-index: 2;
  border: 1px dotted white;
  width: 0;
  height: 0;
  left: 0;
  right: 0;
}
</style>
