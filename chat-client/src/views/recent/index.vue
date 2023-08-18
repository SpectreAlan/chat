<template>
  <div class="recent">
    <div class="top">
      <span class="title">最近联系</span>
    </div>
   <recent/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import Recent from "@/components/Room.vue";

const chatModule = namespace("chat");
@Component({
  components: {
    Recent
  },
})
export default class Nav extends Vue {
}
</script>
<style lang="scss" scoped>
.recent {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 60px 0;
  position: relative;
  background: rgb(236, 244, 250);

  .contacts {
    height: 100%;
    overflow-y: scroll;
    width: 100%;

    li {
      text-align: left;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      img{
        height: 40px;
        width: 40px;
        border-radius: 50%;
      }
    }
  }

  .top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    border-bottom: 1px solid #eee;
    text-align: center;
    line-height: 60px;
    background: #fff;
    font-size: 16px;

    i {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }
}
</style>
