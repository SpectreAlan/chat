<template>
  <div class="mine">
    <div class="top">
      <avatar />
      <span class="nickName">{{user.nickName}}</span>
      <span class="nickName">ID: {{user.username}}</span>
      <span class="nickName">{{user.bio}}</span>
    </div>
    <ul class="other">
      <li>
        <img src="~@/assets/icon4.png" alt="" />
        <span>我的资料</span>
        <a-icon type="right" theme="outlined" @click="$router.push('/info')" />
      </li>
      <li>
        <img src="~@/assets/icon2.png" alt="" />
        <span>问题反馈</span>
        <a-icon type="right" theme="outlined" @click="feedback" />
      </li>
      <li>
        <img src="~@/assets/icon1.png" alt="" />
        <span>修改密码</span>
        <a-icon type="right" theme="outlined" @click="changePassword" />
      </li>
      <li>
        <img src="~@/assets/icon3.png" alt="" />
        <span>注销登录</span>
        <a-icon type="right" theme="outlined" @click="logout" />
      </li>
    </ul>
    <change-pwd v-if="showModal" @close="changePassword"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
const appModule = namespace("app");
import Avatar from './avatar.vue'
import ChangePwd from './changePwd.vue'

@Component({
  components: {
    Avatar,
    ChangePwd
  },
})
export default class Nav extends Vue {
  @appModule.Getter("user") user: User;
  @appModule.Mutation('clear_user') clearUser: Function;
  showModal: boolean = false;

  logout () {
    this.clearUser();
    this.$router.push('/');
  }

  feedback () {
    this.$message.warning('暂未开放')
  }

  changePassword () {
    this.showModal = !this.showModal
  }

}
</script>
<style lang="scss" scoped>
.mine {
  background: rgb(236, 244, 250);
  width: 100%;
  height: 100%;
  .top{
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background: #E55D87;
    background: -webkit-linear-gradient(to right, #5FC3E4, #E55D87);
    background: linear-gradient(to right, #5FC3E4, #E55D87);
    padding: 40px 0 20px;
    color: #fff;
  }
  .other{
    text-align: left;
    width: calc(100% - 20px);
    margin: 20px auto;
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    li{
      margin-bottom: 10px;
      position: relative;
      box-shadow: 4px 4px 5px #888888;
      border-radius: 6px;
      i{
        position: absolute;
        right: 20px;
        top: 20px;
      }
    }
  }
}
</style>
