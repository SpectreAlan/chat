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
    <div class="user-detail">
      <ul>
        <li class="center">
          <img :src="activeRoom.avatar" alt="avatar" />
        </li>
        <li>
          <span class="key">账号:</span>
          <span class="val">{{ activeRoom.username }}</span>
        </li>
        <li>
          <span class="key">昵称:</span>
          <span class="val">{{ activeRoom.nickName }}</span>
        </li>
        <li>
          <span class="key">性别:</span>
          <span class="val">{{ gender[activeRoom.gender || 0] }}</span>
        </li>
        <li>
          <span class="key">备注:</span>
          <span class="val">{{ chatName }}</span>
        </li>
        <li>
          <span class="key">简介:</span>
          <span class="val">{{ activeRoom.bio }}</span>
        </li>
        <a-popconfirm
          ok-text="确认"
          cancel-text="取消"
          @confirm="addRemark"
        >
          <a-input placeholder="备注名称..." slot="title" v-model="remark" />
          <li class="add center">设置备注</li>
        </a-popconfirm>

        <a-popconfirm title="确定要删除该好友吗？" placement="bottomRight" ok-text="删除" cancel-text="取消"
                      @confirm="del">
          <li class="del center">删除好友</li>
        </a-popconfirm>
      </ul>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import * as api from "@/api/apis";
import { getFriends } from "@/api/apis";

const chatModule = namespace("chat");
const appModule = namespace("app");
@Component
export default class UserDetail extends Vue {
  @chatModule.State("activeRoom") activeRoom: Group & Friend;
  @chatModule.State("socket") socket: SocketIOClient.Socket;
  @appModule.Getter("user") user: User;
  @chatModule.Getter("userGather") userGather: FriendGather;
  @chatModule.Getter("friendGather") friendGather: FriendGather;
  remark: string = "";
  gender = ['保密', '男', '女']

  created() {
    this.remark = this.friendGather[this.activeRoom.userId].remark || "";
  }
  get chatName() {
    const o = this.friendGather[this.activeRoom.userId]
    return o.remark || '';
  }

  back() {
    this.$emit("scan");
  }

  addRemark() {
    this.socket.emit("addRemark", {
      userId: this.user.userId,
      friendId: this.activeRoom.userId,
      remark: this.remark
    });
  }

  del() {
    this.socket.emit("exitFriend", {
      userId: this.user.userId,
      friendId: this.activeRoom.userId
    });
    this.$router.push('/recent')
  }

}
</script>
<style lang="scss">
.user-detail-modal {
  background: #fff;
  .ant-drawer-wrapper-body{
    overflow: hidden;
  }

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
        background: rgb(2, 190, 176);
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
