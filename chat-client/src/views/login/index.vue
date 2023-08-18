<template>
  <div class="login">
    <a-modal header="" footer="" :visible="true" :closable="false">
      <a-tabs @change="changeType">
        <a-tab-pane key="login" tab="登录"> </a-tab-pane>
        <a-tab-pane key="register" tab="注册" force-render> </a-tab-pane>
      </a-tabs>
      <a-form id="components-form-demo-normal-login" :form="form" class="login-form" @submit="handleSubmit">
        <a-form-item>
          <a-input v-decorator="['username', { rules: [{ required: true, message: '请输入用户名!' }] }]" placeholder="username">
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="['password', { rules: [{ required: true, message: '请输入密码!' }] }]"
            type="password"
            placeholder="Password"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-checkbox
            v-decorator="[
              'remember',
              {
                valuePropName: 'checked',
                initialValue: false,
              },
            ]"
          >
            记住密码
          </a-checkbox>
          <a-button type="primary" html-type="submit" class="login-form-button">
            {{ buttonText }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { nameVerify } from '@/utils/common';
import { namespace } from "vuex-class";
const appModule = namespace("app");
const chatModule = namespace("chat");
@Component
export default class ChatJoin extends Vue {
  @appModule.Getter('user') user: User;
  @appModule.Action("login") login: Function;
  @appModule.Action("register") register: Function;
  @chatModule.Action("connectSocket") connectSocket: Function;
  form: any = null;
  type: string = 'login';
  buttonText: string = '登录';

  created() {
    this.form = this.$form.createForm(this, { name: 'normal_login' });
    if (this.user.userId) {
      this.handleJoin();
    }
  }

  changeType(type: string) {
    this.type = type;
    if (this.type === 'login') {
      this.buttonText = '登录';
    } else if (this.type === 'register') {
      this.buttonText = '注册';
    }
  }
  async handleJoin() {
    this.connectSocket();
    this.$router.push('/chat')
  }

  async handleLogin(user: User) {
    let res = await this.login(user);
    if (res) {
      // 进入系统事件
      this.handleJoin();
    }
  }

  // 注册
  async handleRegister(user: User) {
    let res = await this.register(user);
    if (res) {
      // 进入系统事件
      this.handleJoin();
    }
  }
  handleSubmit(e: any) {
    e.preventDefault();
    this.form.validateFields((err: any, user: User) => {
      if (!err) {
        if (this.type === 'register') {
          // this.$message.warning('暂未开放注册')
          // return
          user.createTime = new Date().valueOf();
          this.handleRegister(user)
          return
        }
        // @ts-ignore
        delete user.remember;
        if (!nameVerify(user.username)) {
          return;
        }
        this.handleLogin(user)
      }
    });
  }
}
</script>
<style lang="scss" scoped>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>
