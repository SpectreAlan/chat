<template>
  <div class="user-search">
    <div class="top">
      <a-icon type="left" theme="outlined" @click="back" />
      <span class="title">群组搜索</span>
    </div>
    <a-input-search placeholder="输入关键字" @search="onSearch" />
    <ul class="users">
      <li v-if="!groupList.length" class="empty">
        `<img src="~@/assets/empty.png" alt="empty" />`
        <div class="empty">{{empty}}</div>
      </li>
      <li v-for="group in groupList" :key="group.userId" @click="handleGroupSelect(group)">
        <img src="~@/assets/group.png" class="avatar" alt="avatar">
        <span>
          {{ group.groupName }}
        </span>
      </li>
    </ul>
    <group-detail v-if="visibleDetail" :selected="selected" @scan="visibleDetail = false"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import * as apis from "@/api/apis";
import { processReturn } from "@/utils/common";
import GroupDetail from "./groupDetail.vue";

const chatModule = namespace("chat");
@Component({
  components: { GroupDetail }
})
export default class Nav extends Vue {
  @chatModule.Getter("friendGather") contacts: FriendGather;
  @chatModule.Mutation("set_active_room") _setActiveRoom: Function;
  visibleDetail: boolean = false;
  groupList: Array<Group> = [];
  selected: Group;
  empty: string = '输入关键字搜索一下';

  back() {
    this.$router.go(-1);
  }

  async onSearch(value: string) {
    if (!value) {
      this.groupList = []
      this.empty = '输入关键字搜索一下'
      return;
    }
    let res = await apis.getGroupsByName(value);
    let data = processReturn(res);
    console.log(data);
    this.groupList = data;
    if(!data.length){
      this.empty = '换个关键词试试'
    }
  }

  handleGroupSelect(group: Group) {
    this.$router.push(`/groupDetail?groupId=${group.groupId}`)
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
