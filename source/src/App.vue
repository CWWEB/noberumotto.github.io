<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view />
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["client"]),
  },
  mounted() {
  },
  methods: {
   
  },
};
</script>
<style>
* {
  box-sizing: border-box;
  font-family: "宋体";
  outline: none;
  /* font-family: "simsun" !important; */
}
@font-face {
  font-family: "simsun";
  src: url("assets/simsun.ttf");
}
@font-face {
  font-family: "dos";
  src: url("assets/dos.ttf");
}
#app {
  /* font-family: "simsun" !important; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 12px;
  
}
input{
  outline:none;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
