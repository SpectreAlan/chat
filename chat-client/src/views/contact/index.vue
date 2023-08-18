<template>
  <div class="contact">
    <div class="top">
      <span class="title">联系人</span>
      <a-icon type="user-add" theme="outlined" @click="handleUserSearch"/>
    </div>
    <user-list :list="contacts"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import UserList from '@/components/userList.vue'

const chatModule = namespace("chat");
@Component({
  components: {
    UserList
  }
})
export default class Nav extends Vue {
  @chatModule.Getter("friendGather") contacts: FriendGather;
  handleUserSearch () {
    this.$router.push('/userSearch')
  }
}
</script>
<style lang="scss" scoped>
.contact {
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
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    border-bottom: 1px solid #eee;
    text-align: center;
    line-height: 60px;
    font-size: 16px;

    i {
      position: absolute;
      right: 20px;
      top: 20px;
    }
  }
}
</style>
