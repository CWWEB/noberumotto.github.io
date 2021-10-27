<template>
  <div class="framework">
    <div class="startup">
      <div class="logo">
        <img src="../assets/Microsoft_Windows_95_logo.png" />
      </div>
    </div>
    <div class="loading" :class="{ hide: starting }">
      <p v-for="(item, index) in info" :key="index">{{ item }}</p>
      <label></label>
    </div>
  </div>
</template>
<script>
import SystemInfo from "@/library/systeminfo.js";
import { mapState } from "vuex";
export default {
  data() {
    return {
      starting: false,
      info: [],
      locationTimer: null,
      index: 0,
    };
  },
  computed: {
    ...mapState(["client"]),
  },
  mounted() {
    this.checkState();
  },
  methods: {
    checkState() {
      let token = localStorage.getItem("token");
      if (token) {
        this.$store.dispatch("client/set", {
          isCheck: true,
        });
        this.$router.push("/Desktop");
      } else {
        this.startup();
      }
    },
    startup() {
      this.print("Verifying Client Info .........");
      this.osCheck(() => {
        this.browserCheck(() => {
          this.checkPass();
        });
      });
    },
    osCheck(goto) {
      let os = SystemInfo.getOSName();
      if (!os) {
        this.print("Error!This operating system is not supported! :-(");
        this.print("Code : 01");
      } else {
        this.print("Operating system : " + os + " [check]");
        goto();
      }
    },
    browserCheck(goto) {
      let bn = SystemInfo.getBrowserName();
      if (!bn) {
        this.print("Error!This browser is not supported! :-(");
        this.print("Code : 02");
      } else {
        this.print("Browser : " + bn + " [check]");
        goto();
      }
    },
    checkPass() {
      let t = this;
      this.print("Starting machine...");

      setTimeout(function () {
        t.starting = true;
        setTimeout(function () {
          t.$store.dispatch("client/set", {
            isCheck: true,
          });
          localStorage.setItem("token", "true");
          t.$router.push("/desktop");
        }, 3000);
      }, 6000);
    },
    /**
     * 打印消息
     */
    print(msg) {
      let t = this;
      this.index++;
      setTimeout(function () {
        t.info.push(msg);
        this.index--;
      }, 1000 * this.index);
    },
  },
};
</script>

<style scoped>
.hide {
  display: none;
}
p {
  margin: 0;
  margin-bottom: 5px;
  opacity: 0;
  animation: print 0.5s forwards;
}
.framework {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.startup {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgb(93, 188, 243);
  display: flex;
  justify-content: center;
  align-items: center;
}
.loading {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: black;
  color: white;
  padding: 20px;
  font-family: "dos";
  text-align: left;
}
.loading label {
  width: 10px;
  display: inline-block;
  border-bottom: 2px solid white;
  animation: flash 0.5s infinite;
}
.logo {
}
.logo img {
  width: 100px;
  animation: flash 2s infinite;
}
@keyframes flash {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes print {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>