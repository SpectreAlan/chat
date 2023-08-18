<template>
  <div class="user-info">
    <div class="circle" />
    <div class="top">
      <a-icon type="left" class="back" @click="$router.go(-1)" />
      <span>个人资料</span>
    </div>
    <div class="form">
      <a-form :model="formState">
        <a-form-item label="用户名:">
          <a-input disabled v-model="formState.username" placeholder="昵称..." />
        </a-form-item>
        <a-form-item label="昵称:">
          <a-input v-model="formState.nickName" placeholder="昵称..." />
        </a-form-item>
        <a-form-item label="性别:">
          <a-select v-model="formState.gender">
            <a-select-option :value="1">男</a-select-option>
            <a-select-option :value="2">女</a-select-option>
            <a-select-option :value="0">保密</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="简介:">
          <a-textarea
            showCount
            maxlength="20"
            v-model="formState.bio"
            placeholder="个人简介..."
            :auto-size="{ minRows: 3, maxRows: 3 }"
          />
        </a-form-item>
        <div class="save" @click="onSubmit">保存</div>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import * as apis from "@/api/apis";
import { processReturn } from "@/utils/common";
import { DEFAULT_GROUP } from "@/const";

const appModule = namespace("app");
const chatModule = namespace("chat");

@Component
export default class Tool extends Vue {
  @appModule.Getter("user") user: User;
  @appModule.Mutation("set_background") setBackground: Function;
  @appModule.Mutation("set_user") setUser: Function;

  @chatModule.Getter("socket") socket: SocketIOClient.Socket;
  @chatModule.Mutation("set_user_gather") setUserGather: Function;

  uploading: boolean = false;
  formState: any = {};

  created() {
    const { bio, gender, nickName, username } = this.user;
    this.formState = { bio, gender, nickName, username };
  }

  async onSubmit() {
    const user: User = JSON.parse(JSON.stringify({ ...this.user, ...this.formState }));
    let res = await apis.patchUserName(user);
    let data = processReturn(res);
    if (data) {
      this.setUser(data);
      this.setUserGather(data);
      // 通知其他用户个人信息改变
      this.socket.emit("joinGroupSocket", {
        groupId: DEFAULT_GROUP,
        userId: data.userId
      });
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.user-info {
  width: 100%;
  height: 100%;
  background: rgb(236, 244, 250);

  .top {
    position: relative;
    height: 60px;
    line-height: 60px;
    color: #fff;
    font-size: 16px;
    z-index: 2;

    i {
      position: absolute;
      top: 20px;
      left: 20px;
    }
  }

  .form {
    position: absolute;
    top: 60px;
    left: 20px;
    background: #fff;
    border-radius: 8px;
    z-index: 3;
    width: calc(100% - 40px);
    padding: 20px;

    .save {
      background: rgb(2,189,176);
      text-align: center;
      margin: 20px auto;
      width: 100%;
      padding: 6px;
      border-radius: 4px;
      color: #fff;
      font-weight: bold;
    }
  }
}
</style>