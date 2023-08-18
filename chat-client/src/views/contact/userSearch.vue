<template>
  <div class="user-search">
    <div class="top">
      <a-icon type="left" theme="outlined" @click="back" />
      <span class="title">搜索用户</span>
    </div>
    <a-input-search placeholder="输入关键字" @search="onSearch" />
    <ul class="users">
      <li v-if="!userArr.length" class="empty">
        <img src="~@/assets/empty.png" alt="empty" />
        <div class="empty">{{empty}}</div>
      </li>
      <li v-for="user in userArr" :key="user.userId" @click="handleUserSelect(user)">
        <img :src="user.avatar" class="avatar" alt="avatar">
        <span>
          {{ user.remark || user.username }}
        </span>
      </li>
    </ul>
    <user-detail v-if="visibleDetail" :selected="selected" @scan="visibleDetail = false"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import * as apis from "@/api/apis";
import { processReturn } from "@/utils/common";
import UserDetail from "./uerDetail.vue";

const chatModule = namespace("chat");
@Component({
  components: { UserDetail }
})
export default class Nav extends Vue {
  @chatModule.Getter("friendGather") contacts: FriendGather;
  @chatModule.Mutation("set_active_room") _setActiveRoom: Function;
  visibleDetail: boolean = false;
  userArr: Array<User> = [];
  selected: User;
  empty: string = '输入关键字搜索一下';

  scan(contact: User & Group) {
    this._setActiveRoom(contact);
    this.$router.push("chat");
  }

  back() {
    this.$router.go(-1);
  }

  async onSearch(value: string) {
    if (!value) {
      this.userArr = []
      this.empty = '输入关键字搜索一下'
      return;
    }
    let res = await apis.getUsersByName(value);
    let data = processReturn(res);
    this.userArr = data;
    if(!data.length){
      this.empty = '换个关键词试试'
    }
  }

  handleUserSelect(user: User) {
    this.selected = user;
    this.visibleDetail = true
  }

}
</script>
<style lang="scss" scoped>
.user-search {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 132px 20px 20px;
  position: relative;
  background: rgb(236, 244, 250);
  box-sizing: border-box;
  .ant-input-search{
    position: absolute;
    top: 80px;
    left: 20px;
    width: calc(100% - 40px);
  }

  .users {
    height: 100%;
    background: #fff;
    border-radius: 8px;
    overflow-y: scroll;
    width: 100%;
    padding: 10px;

    li {
      text-align: left;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);

      .avatar {
        height: 40px;
        width: 40px;
        border-radius: 50%;
      }
    }
    .empty{
      text-align: center;
      border: none;
      img{
        width: 60%;
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
      left: 20px;
      top: 20px;
    }
  }
}
</style>
