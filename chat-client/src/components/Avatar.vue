<template>
  <div class="avatar" v-if="userGather[data.userId]">
    <a-avatar class="avatar-img" :src="userGather[data.userId].avatar" @click="showDetail"/>
    <div>
      <span class="avatar-name">{{ showName }}</span>
      <span class="avatar-time" v-if="showTime">{{ _formatTime(data.time) }}</span>
    </div>
    <user-detail v-if="showDetailUser" @scan="showDetailUser = false" :userId="data.userId"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import * as api from "@/api/apis";
import { namespace } from "vuex-class";

const chatModule = namespace("chat");
const appModule = namespace("app");
import { formatTime } from "@/utils/common";
import { processReturn } from "@/utils/common.ts";
import UserDetail from "@/views/chat/groupUserDetail.vue";

@Component({
  components: { UserDetail }
})
export default class Avatar extends Vue {
  @Prop() data: User; // 用户信息
  @Prop({ default: true }) showTime: boolean; // 是否显示时间

  @appModule.Getter("user") user: User;
  @chatModule.Getter("userGather") userGather: FriendGather;
  @chatModule.Getter("friendGather") friendGather: FriendGather;
  @chatModule.Getter("socket") socket: SocketIOClient.Socket;
  @chatModule.Mutation("set_active_room") setActiveRoom: Function;

  get showName() {
    const info = this.friendGather[this.data.userId];
    if (info) {
      return info.remark || info.nickName || info.username;
    }
    const userInfo = this.userGather[this.data.userId]
    return userInfo.nickName || userInfo.username
  }
  showDetailUser:boolean = false

  showDetail () {
    if(this.data.userId !== this.user.userId){
      this.showDetailUser = true
    }
  }

  addFriend(friendId: string) {
    this.socket.emit("addFriend", {
      userId: this.user.userId,
      friendId: friendId,
      createTime: new Date().valueOf()
    });
  }

  _formatTime(time: number) {
    return formatTime(time);
  }

  async deleteUser(userId: string) {
    let res = await api.deleteUser({
      uid: this.user.userId,
      psw: this.user.password,
      did: userId
    });
    let data = processReturn(res);
  }

  _setActiveRoom(userId: string) {
    this.setActiveRoom(this.friendGather[userId]);
  }
}
</script>
<style lang="scss" scoped>
.avatar {
  display: flex;
  align-items: center;
  height: 37px;

  .avatar-img {
    cursor: pointer;
    width: 35px;
    height: 35px;
  }

  .avatar-name {
    margin-left: 5px;
    font-size: 14px;
  }

  .avatar-time {
    font-size: 12px;
    color: rgb(0, 0, 0, 0.35);
    margin-left: 3px;
  }
}

.avatar-card {
  display: flex;
  font-size: 18px;
  flex-direction: column;
  align-items: center;

  > div {
    margin: 4px;
  }
}
</style>
