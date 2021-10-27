<template>
  <div class="framework" ref="framework">
    <div class="login" v-if="!islogin">
      <message-box
        :title="'提示'"
        :content="'密码错误'"
        ref="msgbox"
        :icon="'warning'"
        :callBack="msgboxCallBack"
      />
      <window
        :title="'欢迎登录'"
        :width="500"
        :height="150"
        :icon="'key'"
        ref="loginWindow"
        :helpBtn="true"
      >
        <div class="login-panel">
          <div class="icon"><img src="../assets/key.png"/></div>
          <div class="login-input">
            <p>我的名字是来自哪部动画中的主角？</p>
            <div class="item">
              口令:<text-box
                style="margin-left: 20px"
                v-model="loginData.key"
              />
            </div>
          </div>
          <div class="login-btns">
            <div>
              <btn v-on:click.native="login" :width="100" :height="25"
                >确定</btn
              >
            </div>
            <div style="margin-top: 5px">
              <btn v-on:click.native="shutdown" :width="100" :height="25"
                >取消</btn
              >
            </div>
          </div>
        </div>
      </window>
    </div>

    <div class="desktop" v-if="islogin">
      <desktopcontainer />
      <task-bar />
    </div>
    <audio
      ref="audio"
      src="@/assets/win95.mp3"
      preload
      id="audio"
      muted
    ></audio>
  </div>
</template>
<script>
import Btn from "../components/Btn.vue";
import TextBox from "../components/TextBox.vue";
import Window from "../components/Window.vue";
import { mapState } from "vuex";
import MessageBox from "../components/MessageBox.vue";
import { startupMusic } from "../assets/win95.mp3";
import TaskBar from "../components/TaskBar.vue";
import Desktopcontainer from "../components/Desktopcontainer.vue";

export default {
  components: { Window, Btn, TextBox, MessageBox, TaskBar, Desktopcontainer },
  data() {
    return {
      loginData: {
        key: "",
      },
      islogin: false,
    };
  },
  computed: {
    ...mapState(["client"]),
  },
  mounted() {
    this.$refs.loginWindow.show();
  },
  methods: {
    startupMusic() {
      new Audio(startupMusic).play();
      // console.log(startupMusic);
    },
    shutdown() {
      this.$store.dispatch("client/shutdown");
      window.opener = null;
      window.open("about:blank", "_top").close();
    },
    login() {
      // console.log(this.$store.state.client.windowList);
      if (this.loginData.key != "1") {
        this.$refs.msgbox.show("提示", "输入的口令不对。");
      } else {
        this.islogin = true;
        this.$refs.loginWindow.close();
        // this.$refs.framework.style.cursor = "wait";
        this.$refs.audio.play();
      }
    },
    msgboxCallBack(btnNumber) {
      // console.log(btnNumber);
    },
  },
};
</script>

<style scoped>
.framework {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #55AAAA;
}
.desktop {
  width: 100%;
  height: 100%;
  position: relative;
}
.login-panel {
  display: flex;
  justify-content: space-between;
  flex: 1;
  padding:10px;
}
.login-panel .icon{
  text-align: center;
  width: 15%;
}
.login-input {
  text-align: left;
  width: 54%;
}
.login-input p {
  margin: 0;
}
.login-input .item {
  display: flex;
  align-items: center;
  margin-top: 20px;
}
</style>