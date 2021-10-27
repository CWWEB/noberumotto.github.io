<template>
  <div
    class="shortcut"
    :class="{ selected: selected }"
    v-on:click="$emit('tap', $props)"
    v-on:dblclick="onDbclick"
  >
    <div class="grid">
      <div class="icon" v-if="img && img != ''">
        <img :src="require('../assets/' + img + '.png')" />
      </div>
      <div
        class="name"
        v-bind:style="{
          color: color ? color : '#ffffff',
        }"
      >
        {{ name }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Shortcut",
  props: {
    id: Number,
    index: Number,
    icon: String,
    name: String,
    selected: Boolean,
    type: String,
    app: String,
    color: String,
    args: Object,
  },
  data() {
    return {
      img: "",
    };
  },
  computed: {
    ...mapState(["client"]),
  },
  mounted: function () {
    if (this.$props.type) {
      switch (this.$props.type) {
        case "disk":
          this.img = "desk";
          break;
        case "txt":
          this.img = "txt";
          break;
        case "word":
          this.img = "word";
          break;
        case "photo":
          this.img = "photos";
          if (this.$props.args) {
            let file = this.$props.args.data;
            if (file) {
              if (
                file.indexOf("http://") != -1 ||
                file.indexOf("https://") != -1
              ) {
                this.img = "webphoto";
              }
            }
          }
          break;
        case "folder":
          this.img = "folder";
          break;
        default:
          this.img = this.$props.icon;
      }
    } else {
      this.img = this.$props.icon;
    }

    let item = this;
    this.$nextTick(function () {
      // 仅在整个视图都被渲染之后才会运行的代码
      this.$emit("loaded", this);
    });

    window.onmouseup = function () {
      item.$emit("loaded", item);
    };
  },
  methods: {
    onDbclick() {
      this.$emit("dbtap", this.$props);
      this.open();
      // console.log(this.$props.app);
    },
    open() {
      if (this.$props.app != "") {
        let runAppList = this.$store.state.client.runAppList;
        runAppList.push({
          pid: runAppList.length + 1,
          name: this.$props.app,
          args: this.$props.args,
        });

        this.$store.dispatch("client/set", {
          runAppList: runAppList,
        });
      }
    },
  },
};
</script>

<style scoped>
.shortcut {
  display: inline-block;
  padding: 10px;
  width: 95px;
  height: 60px;
}
.grid {
  text-align: center;
}
.name {
  color: white;
  border: 1px solid transparent;
}
.shortcut:active .name,
.selected .name {
  border: 1px dotted white;
  background: #010083;
  color: #fff !important;
}
.shortcut:active img,
.selected img {
  filter: contrast(25%);
}
</style>
