<template>
  <div
    @mouseover="showUpload = true"
    @mouseleave="showUpload = false"
    class="user-avatar"
    :class="{ active: showUpload || uploading }"
  >
    <a-avatar :src="user.avatar" class="img" :size="120"></a-avatar>
    <a-upload v-if="showUpload && !uploading" class="tool-user-upload" :show-upload-list="false" :before-upload="beforeUpload">
      <div class="text">
        <a-icon type="upload" style="margin-right: 4px;" />
        <span>更换头像</span>
      </div>
    </a-upload>
    <a-icon class="loading" v-if="uploading" type="loading" spin />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { setUserAvatar } from '@/api/apis';
import {  DEFAULT_GROUP } from '@/const/index';
import { namespace } from 'vuex-class';
import { processReturn, } from '@/utils/common.ts';
const appModule = namespace('app');
const chatModule = namespace('chat');

@Component
export default class Tool extends Vue {
  @appModule.Getter('user') user: User;
  @appModule.Mutation('set_background') setBackground: Function;
  @appModule.Mutation('set_user') setUser: Function;

  @chatModule.Getter('socket') socket: SocketIOClient.Socket;
  @chatModule.Mutation('set_user_gather') setUserGather: Function;

  showUpload: boolean = false;
  uploading: boolean = false;
  avatar: any = '';

  beforeUpload(file: any) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif';
    if (!isJpgOrPng) {
      return this.$message.error('请上传jpeg/jpg/png/gif格式的图片!');
    }
    const isLt1M = file.size / 1024 / 1024 < 0.5;
    if (!isLt1M) {
      return this.$message.error('图片必须小于500K!');
    }
    this.avatar = file;
    this.handleUpload();
    return false;
  }

  async handleUpload() {
    this.uploading = true;
    const formData = new FormData();
    formData.append('avatar', this.avatar);
    formData.append('userId', this.user.userId);
    formData.append('password', this.user.password);
    let data = processReturn(await setUserAvatar(formData));
    if (data) {
      this.setUser(data);
      this.setUserGather(data);
      this.uploading = false;
      this.showUpload = false;
      // 通知其他用户个人信息改变
      this.socket.emit('joinGroupSocket', {
        groupId: DEFAULT_GROUP,
        userId: data.userId,
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.user-avatar {
  position: relative;
  width: 120px;
  overflow: hidden;
  margin: 0 auto 24px;
  border-radius: 50%;
  cursor: pointer;
  .tool-user-upload {
    .text {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      line-height: 120px;
      font-weight: bold;
    }
  }
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -18px 0 0 -18px;
    font-size: 35px;
    font-weight: bold;
    color: #fff;
  }
  .img {
    transition: 0.2s all linear;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.4);
  }
  &.active {
    .img {
      filter: blur(3px);
    }
  }
}
</style>