<template>
  <div class="taskbar">
    <start-menu :data="startmenuData" ref="startmenu" />
    <div class="border">
      <btn class="btn" v-on:click.native="onShowStartMenu"
        ><img class="btnimg" src="@/assets/logo-small.png" /> 开始</btn
      >

      <div class="runing-app"></div>

      <div class="notification-bar">
        <div class="notification-border">
          <div class="time">{{ time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Btn from "./Btn.vue";
import StartMenu from "./StartMenu.vue";
export default {
  components: { Btn, StartMenu },
  name: "TaskBar",
  props: {},
  data() {
    return {
      time: "",
      timer: null,
      startmenuData: [
        {
          title: "应用程序",
          icon: "programs",
          type: "menu",
          showmore: false,
          more: [
            {
              title: "浏览器",
              icon: "programs",
              type: "menu",
            },
          ],
        },
        {
          title: "收藏",
          icon: "favorites",

          type: "menu",
        },
        {
          title: "文档",
          icon: "documents",

          type: "menu",
        },
        {
          type: "line",
        },
        {
          title: "锁定",
          type: "menu",
        },
        {
          title: "关机",
          type: "menu",
        },
      ],
    };
  },
  mounted() {
    this.updateTime();
    this.startTimer();
  },
  methods: {
    startTimer() {
      if (this.timer == null) {
        let t = this;
        this.timer = setInterval(() => {
          t.updateTime();
        }, 1000 * 60);
      }
    },
    updateTime() {
      let date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      minutes = minutes <= 9 ? "0" + minutes : minutes;
      let range = "下午";
      if (hours >= 1 && hours <= 12) {
        range = "上午";
      }
      this.time = hours + ":" + minutes + " " + range;
    },
    onShowStartMenu() {
      this.$refs.startmenu.show();
    },
  },
};
</script>

<style scoped>
.taskbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #c0c0c0;
  box-sizing: border-box;
  text-align: left;
}
.border {
  margin: 1px;
  border: 1px solid #ffffff;
  border-right-color: #656566;
  border-bottom-color: #656566;
  padding: 2px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
}
.btn {
  width: auto;
}
.btnimg {
  height: 16px;
  margin-right: 2px;
}
.notification-bar {
  background: #b4b4b4;
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
}
.notification-border {
  border: 1px solid #6d6d6d;
  border-right-color: #ffffff;
  box-sizing: border-box;
  border-bottom-color: #ffffff;
  display: flex;
  align-items: center;
}
.time {
  margin: 0 10px;
}
</style>
