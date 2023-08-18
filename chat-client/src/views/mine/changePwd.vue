<template>
  <a-modal
    :visible="true" title="修改密码"
    @ok="handleOk"
    width="300px"
    @cancel="close"
    cancelText="取消"
    okText="提交"
  >
    <a-form :model="formState" :form="form">
      <a-form-item label="旧密码:" name="oldPassword">
        <a-input-password
          v-model.trim="formState.oldPassword"
          placeholder="旧密码..."
          v-decorator="['oldPassword', rules.oldPassword]"
        />
      </a-form-item>
      <a-form-item label="新密码:" name="password">
        <a-input-password
          v-model.trim="formState.password"
          placeholder="新密码..."
          v-decorator="['password', rules.password]"
        />
      </a-form-item>
      <a-form-item label="确认密码:" name="confirmPassword">
        <a-input-password
          v-model.trim="formState.confirmPassword"
          v-decorator="['confirmPassword', rules.confirmPassword]"
          placeholder="确认密码..."
        />
      </a-form-item>
      <div class="tips">
        密码格式: 至少8个字符，包括至少一个大写字母，一个小写字母，一个数字和一个特殊字符，如：Aa12345@
      </div>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

const appModule = namespace("app");
const chatModule = namespace("chat");
import { passwordVerify, processReturn } from "@/utils/common";
import * as apis from "@/api/apis";

@Component
export default class Nav extends Vue {
  @appModule.Getter("user") user: User;
  @appModule.Mutation("set_user") setUser: Function;
  @chatModule.Mutation("set_user_gather") setUserGather: Function;

  formState: any = {
    password: "",
    oldPassword: "",
    confirmPassword: ""
  };
  form: any = null;

  created() {
    this.form = this.$form.createForm(this, { name: "normal_login" });
  }

  rules: any = {
    oldPassword: {
      rules: [
        { required: true, message: "请输入旧密码", trigger: "blur" }
      ]
    },
    password: {
      rules: [
        { required: true, message: "请输入新密码" }
      ]
    },
    confirmPassword: {
      rules: [
        { required: true, message: "请输入确认密码", trigger: "blur" }
      ]
    }
  };

  checkPwd(val: string, key: string, reg: RegExp) {
    if (!reg.test(val)) {

    }
  }

  async handleOk() {
    this.form.validateFields(async (err: any, values: any) => {
      if (!err) {
        const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const { oldPassword, password, confirmPassword } = values;
        if (!reg.test(oldPassword)) {
          this.$message.error("旧密码格式不正确");
          return;
        }
        if (!reg.test(password)) {
          this.$message.error("新密码密码格式不正确");
          return;
        }
        if (!reg.test(confirmPassword)) {
          this.$message.error("确认密码格式不正确");
          return;
        }
        if (oldPassword === password) {
          this.$message.error("新旧密码不能一样");
          return;
        }
        if (confirmPassword !== password) {
          this.$message.error("新密码与确认密码不一致");
          return;
        }
        let user: User = JSON.parse(JSON.stringify(this.user));
        let res = await apis.patchPassword(user, password, oldPassword);
        let data = processReturn(res);
        if (data) {
          this.setUser(data);
          this.setUserGather(data);
          this.close();
        }
      }
    });
  }

  close() {
    this.$emit("close");
  }
}
</script>
<style lang="scss" scoped>
.tips{
  font-size: 12px;
  background: rgb(236, 244, 250);
  color: #27374D;
  padding: 10px;
  border-radius: 6px;
}
</style>
