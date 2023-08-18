<template>
  <div id="app">
    <router-view />
    <nav-chat v-if="showNav" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { DEFAULT_BACKGROUND } from "@/const";

const appModule = namespace("app");
const chatModule = namespace("chat");
import NavChat from "@/components/nav.vue";

@Component({
  components: {
    NavChat
  }
})
export default class GenalChat extends Vue {
  @appModule.Getter("user") user: User;
  @appModule.Getter("background") background: string;
  @appModule.Mutation("set_mobile") setMobile: Function;
  @appModule.Mutation("set_background") set_background: Function;
  @chatModule.Action("connectSocket") connectSocket: Function;

  mounted() {
    this.setMobile(this.isMobile());
  }

  created() {
    if (!this.user.userId) {
      this.$router.push("/");
    } else {
      this.connectSocket();
    }
  }

  get showNav() {
    return this.$route.meta.nav
  }

  isMobile() {
    let flag = navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    return flag && flag.length;
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-size: cover;
  color: rgba(0, 0, 0, 0.85);
  background-color: #fff;
}

ul, li {
  list-style: none;
  padding: 0;
  margin: 0;
}
.circle {
  background: rgb(87, 87, 87);
  position: absolute;
  top: -650px;
  left: -200px;
  z-index: 1;
  height: 800px;
  width: 800px;
  border-radius: 50%;
}
</style>
