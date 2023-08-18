<template>
  <div class="group-search">
    <div class="circle" />
    <div class="top">
      <a-icon type="left" theme="outlined" @click="back" />
      <span class="title">群组信息</span>
      <a-popconfirm
        v-if="inGroup && user.role === 'admin'"
        :title="`确定要退出${groupInfo.groupName}吗？`"
        placement="bottomRight" ok-text="退出" cancel-text="取消"
        @confirm="exitGroup">
        <a-icon type="logout" theme="outlined" />
      </a-popconfirm>

    </div>
    <template v-if="!loading">
      <div class="base">
        <img src="~@/assets/group.png" alt="group" />
        <ul>
          <li class="groupName">{{ groupInfo.groupName }}</li>
          <li class="notice icon">{{ groupInfo.notice }}</li>
          <li class="members icon">{{ groupInfo.members.length }}</li>
          <li class="createTime icon">{{ formatTime(groupInfo.createTime) }}</li>
        </ul>
        <div class="join" @click="joinGroup">{{ inGroup ? "进入群聊" : "加入群聊" }}</div>
      </div>
      <ul class="list">
        <li v-for="(member,key) in groupInfo.members" :key="key">
          <div class="l">
            <img :src="member.avatar" alt="avatar">
            <span>{{ member.nickName || member.username }}</span>
          </div>
          <div v-if="member.groupRole < 2" class="r">
            <img v-if="!member.groupRole" src="~@/assets/icon5.png" alt="admin" />
            <img v-else src="~@/assets/icon8.png" alt="admin" />
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import moment from "moment";
import { DEL_FRIEND, SET_ACTIVE_ROOM } from "@/store/modules/chat/mutation-types";
import { DEFAULT_GROUP } from "@/const";

const chatModule = namespace("chat");
const appModule = namespace("app");
@Component({})
export default class Nav extends Vue {
  @chatModule.Getter("friendGather") contacts: FriendGather;
  @chatModule.Getter("activeGroupUser") activeGroupUser: ActiveGroupUser;
  @chatModule.Mutation("set_active_room") _setActiveRoom: Function;
  @chatModule.Getter("groupGather") groupGather: GroupGather;
  @chatModule.Getter("groupInfo") groupInfo: GroupInfo;
  @chatModule.Getter("socket") socket: SocketIOClient.Socket;
  @appModule.Getter("user") user: User;

  groupId: any = "";
  loading: boolean = true;

  async created() {
    this.groupId = this.$route.query.groupId!;
    this.socket.emit("infoGroup", {
      userId: this.user.userId,
      groupId: this.groupId
    });
  }

  @Watch("groupInfo", { deep: true })
  changeGroupInfo() {
    this.loading = false;
    console.log(this.groupInfo);
  }

  get inGroup() {
    return this.groupGather[this.groupId] !== undefined;
  }

  exitGroup() {
    this.socket.emit("exitGroup", {
      userId: this.user.userId,
      groupId: this.groupInfo.groupId
    });
    this.$router.push("/recent");
  }

  joinGroup() {
    if (this.inGroup) {
      this._setActiveRoom(this.groupGather[this.groupInfo.groupId]);
      this.$router.push("/chat");
      return;
    }
    this.socket.emit("joinGroup", {
      userId: this.user.userId,
      groupId: this.groupInfo.groupId
    });
  }

  formatTime(time: number) {
    return moment(time).format("YYYY-MM-DD");
  }

  back() {
    this.$router.go(-1);
  }
}
</script>
<style lang="scss" scoped>
.group-search {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 240px 20px 20px;
  position: relative;
  background: rgb(236, 244, 250);

  .top {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    text-align: center;
    line-height: 60px;
    font-size: 16px;
    color: #fff;

    .anticon-logout {
      position: absolute;
      right: 20px;
      top: 20px
    }

    .anticon-left {
      position: absolute;
      left: 20px;
      top: 20px
    }
  }


  .base {
    background: #fff;
    width: calc(100% - 40px);
    position: absolute;
    top: 60px;
    left: 20px;
    z-index: 3;
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 20px 20px 40px;

    .join {
      position: absolute;
      bottom: 0;
      left: 0;
      background: rgb(2, 190, 176);
      color: #fff;
      text-align: center;
      line-height: 40px;
      width: 100%;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }

    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 20px;
    }

    ul {
      text-align: left;

      .groupName {
        font-size: 16px;
        font-weight: bold;
      }

      .createTime {
        background-image: url(../../assets/icon7.png);
      }

      .members {
        background-image: url(../../assets/icon9.png);
      }

      .notice {
        background-image: url(../../assets/icon6.png);
      }

      .icon {
        padding-left: 24px;
        background-size: 16px 16px;
        background-repeat: no-repeat;
        background-position: 0 2px;
      }
    }
  }

  .list {
    height: 100%;
    overflow-y: scroll;
    text-align: left;

    li {
      padding: 4px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.03);
      display: flex;
      justify-content: space-between;
      align-items: center;

      .l {
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
        }
      }

      .r {
        img{
          width: 16px;
        }
      }
    }
  }
}
</style>
