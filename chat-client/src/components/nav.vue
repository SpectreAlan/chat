<template>
  <ul class="nav">
    <li v-for="k in nav" :key="k.type">
      <a-icon :type="k.type" :class="[$route.path === k.route ? 'active' : '']" theme="outlined" @click="go(k.route)" />
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Nav extends Vue {
  nav: any = [
    { route: "/recent", type: "message" },
    { route: "/contact", type: "user" },
    { route: "/group", type: "team" },
    { route: "/mine", type: "menu" }
  ];

  go(route: string) {
    if (this.$route.path !== route) {
      this.$router.push(route);
    }
  }
}
</script>
<style lang="scss" scoped>
.nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  z-index: 666666666666;
  margin: 0 !important;
  display: flex;
  justify-content: space-between;
  padding: 0 12px;

  li {
    font-size: 16px;
    color: #27374D;
    height: 40px;
    line-height: 40px;
    .active{
      color: rgb(2, 190, 176);
      font-size: 18px;
    }
  }
}
</style>
