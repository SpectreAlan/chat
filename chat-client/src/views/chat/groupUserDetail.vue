<template>
  <a-drawer
    :visible="true"
    :closable="false"
    width="100%"
    class="user-detail-modal"
    placement="right"
  >
    <div slot="title" class="title">
      <a-icon type="left" theme="outlined" @click="back" />
      <span>用户信息</span>
    </div>
    <div v-if="info" class="user-detail">
      <ul>
        <li class="center">
          <img :src="info.avatar" alt="avatar" />
        </li>
        <li>
          <span class="key">账号:</span>
          <span class="val">{{ info.username }}</span>
        </li>
        <li>
          <span class="key">角色:</span>
          <span class="val">{{ groupRoleName }}</span>
        </li>
        <li>
          <span class="key">昵称:</span>
          <span class="val">{{ info.nickName }}</span>
        </li>
        <li>
          <span class="key">性别:</span>
          <span class="val">{{ gender[info.gender || 0] }}</span>
        </li>
        <li v-if="isFriend">
          <span class="key">备注:</span>
          <span class="val">{{ info.remark }}</span>
        </li>
        <li>
          <span class="key">简介:</span>
          <span class="val">{{ info.bio }}</span>
        </li>
        <li v-if="!isFriend && user.role === 'admin'" class="add center" @click="add">添加好友</li>
        <a-popconfirm
          v-if="isFriend"
          ok-text="确认"
          cancel-text="取消"
          @confirm="addRemark"
        >
          <a-input placeholder="备注名称..." slot="title" v-model="remark" />
          <li class="add center">设置备注</li>
        </a-popconfirm>

        <a-popconfirm
          v-if="setAdminShow"
          title="确定要设置该成员为管理员吗？"
          placement="bottomRight"
          ok-text="确定"
          cancel-text="取消"
          @confirm="setAdmin">
          <li class="del center">设置管理员</li>
        </a-popconfirm>
        <a-popconfirm
          v-if="cancelAdminShow"
          title="确定要取消该管理员吗？"
          placement="bottomRight"
          ok-text="确定"
          cancel-text="取消"
          @confirm="cancelAdmin">
          <li class="del center">取消管理员</li>
        </a-popconfirm>
        <a-popconfirm
          v-if="exitGroupShow"
          title="确定要移除该成员吗？"
          placement="bottomRight"
          ok-text="确定"
          cancel-text="取消"
          @confirm="cancelAdmin">
          <li class="del center">移除群聊</li>
        </a-popconfirm>
        <a-popconfirm
          v-if="isFriend && user.role === 'admin'"
          title="确定要删除该好友吗？"
          placement="bottomRight"
          ok-text="删除"
          cancel-text="取消"
          @confirm="del">
          <li class="del center">删除好友</li>
        </a-popconfirm>
      </ul>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import * as api from "@/api/apis";
import { getFriends } from "@/api/apis";

const chatModule = namespace("chat");
const appModule = namespace("app");
@Component
export default class UserDetail extends Vue {
  @Prop() userId: string;
  @chatModule.State("activeRoom") activeRoom: Group & Friend;
  @chatModule.State("socket") socket: SocketIOClient.Socket;
  @appModule.Getter("user") user: User;
  @chatModule.Getter("userGather") userGather: FriendGather;
  @chatModule.Getter("friendGather") friendGather: FriendGather;
  @chatModule.Getter("activeGroupUser") activeGroupUser: ActiveGroupUser;
  @chatModule.Getter("groupInfo") groupInfo: GroupInfo;
  remark: string = "";
  isFriend: boolean = false;
  gender = ["保密", "男", "女"];

  created() {
    if(!this.info){
      this.$message.warning('用户已退群')
      this.back()
    }
  }

  get info() {
    const info = this.friendGather[this.userId];
    if (info) {
      this.isFriend = true;
      this.remark = info.remark || "";
      return info;
    }
    return this.activeGroupUser[this.activeRoom.groupId][this.userId];
  }

  get admins() {
    return this.groupInfo.members.filter((member) => member.groupRole < 2).map((item) => item.userId);
  }

  get setAdminShow() {
    return this.user.userId === this.admins[0] && !this.admins.includes(this.userId);
  }

  get groupRoleName() {
    if(this.userId === this.admins[0]){
      return '群主'
    }
    if(this.admins.includes(this.userId)){
      return '管理员'
    }
    return '普通成员'
  }

  get exitGroupShow() {
    return (this.user.userId === this.admins[0] && !this.admins.includes(this.userId)) || (this.admins.includes(this.user.userId) && !this.admins.includes(this.userId));
  }

  get cancelAdminShow() {
    return this.user.userId === this.admins[0] && this.admins.includes(this.userId);
  }

  setAdmin() {
  }

  cancelAdmin() {
  }

  add() {
    this.socket.emit("addFriend", {
      userId: this.user.userId,
      friendId: this.userId,
      createTime: new Date().valueOf()
    });
  }

  back() {
    this.$emit("scan");
  }

  addRemark() {
    this.socket.emit("addRemark", {
      userId: this.user.userId,
      friendId: this.userId,
      remark: this.remark
    });
  }

  del() {
    this.socket.emit("exitFriend", {
      userId: this.user.userId,
      friendId: this.info.userId
    });
    this.$router.push("/recent");
  }

}
</script>
<style lang="scss">
.user-detail-modal {
  background: #fff;

  .title {
    text-align: center;
    position: relative;

    i {
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .user-detail {
    background: #fff;

    .center {
      text-align: center;

      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
    }

    ul {
      padding: 4px 20px;

      li {
        .key {
          font-size: 14px;
          color: black;
        }

        .val {
          color: rgba(0, 0, 0, 0.6);
          margin-left: 10px;
        }
      }

      .add {
        background: rgb(22, 119, 255);
        text-align: center;
        margin: 20px auto;
        width: 200px;
        padding: 4px;
        border-radius: 4px;
        color: #fff;
      }

      .del {
        background: rgb(255, 77, 79);
        text-align: center;
        margin: 20px auto;
        width: 200px;
        padding: 4px;
        border-radius: 4px;
        color: #fff;
      }
    }
  }
}
</style>
