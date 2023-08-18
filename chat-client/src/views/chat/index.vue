<template>
  <div class="chat">
    <message v-if="activeRoom" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Message from "@/components/Message.vue";
import { namespace } from "vuex-class";

const appModule = namespace("app");
const chatModule = namespace("chat");

@Component({
  components: {
    Message
  }
})
export default class GenalChat extends Vue {
  @appModule.Getter("user") user: User;

  @chatModule.Getter("socket") socket: SocketIOClient.Socket;
  @chatModule.Getter("activeRoom") activeRoom: Friend & Group;
  @chatModule.Action("connectSocket") connectSocket: Function;

  created() {
    if(!this.activeRoom){
      this.$router.push('/recent')
    }
    if(this.activeRoom?.groupId){
      this.socket.emit("infoGroup", {
        userId: this.user.userId,
        groupId: this.activeRoom.groupId
      });
    }
  }

  addGroup(groupName: string) {
    this.socket.emit("addGroup", {
      userId: this.user.userId,
      groupName: groupName,
      createTime: new Date().valueOf()
    });
  }


  // 添加好友
  addFriend(friendId: string) {
    this.socket.emit("addFriend", {
      userId: this.user.userId,
      friendId: friendId,
      createTime: new Date().valueOf()
    });
  }

}
</script>
<style lang="scss" scoped>
.chat {
  font-size: 16px;
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  background: rgb(236, 244, 250);
}
</style>
