<template>
  <div class="right">
    <!-- 企业免费注册 -->
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="registerRules"
      class="register-form"
      auto-complete="on"
    >
      <div class="title">企业免费注册</div>
      <el-form-item prop="name">
        <el-input
          ref="name"
          v-model="registerForm.name"
          autofocus="autofocus"
          name="name"
          type="text"
          auto-complete="on"
          placeholder="公司全称"
          @keyup.enter.native="handleRegister"
        />
      </el-form-item>
      <el-form-item prop="mobile">
        <el-input
          v-model="registerForm.mobile"
          type="text"
          name="mobile"
          auto-complete="on"
          placeholder="手机号"
          @keyup.enter.native="handleRegister"
        />
      </el-form-item>
      <el-form-item prop="code" class="phone-code">
        <el-input v-model="registerForm.code" placeholder="手机验证码"></el-input>
        <!-- 验证码倒计时 -->
        <countDown :moblieValue="registerForm.mobile" @sendCode="getCode" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          name="password"
          auto-complete="on"
          placeholder="设置密码"
          @keyup.enter.native="handleRegister"
        />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" class="submit-btn" @click.native.prevent="handleRegister">立即注册</el-button>
      </el-form-item>
    </el-form>
    <p style="width: 322px; text-align: left; margin-bottom: 10px;">
      注册即表示同意
      <el-link :underline="false" type="primary" style="font-size: 14px; color: #333;" @click="userService">《用户服务协议》</el-link>
    </p>
    <p style="margin-top: 10px; display: flex;">
      已有账户，
      <el-link :underline="false" type="primary" style="font-size: 14px;" @click="loginNow">直接登录</el-link>
    </p>
    <!-- <user-service-agreement
      :fullscreen="true"
      :show="showServiceDialog"
      width="100%"
      @close="showServiceDialog=false"
    /> -->
  </div>
</template>

<script>
import { regexIsNumber, regexIsPhone } from '@/utils'
import CountDown from './countDown'
// import UserServiceAgreement from './userServiceAgreement'
import { sendCode, register } from '@/api/login'
export default {
  name: 'Register',
  components: {
    CountDown
    //, UserServiceAgreement
  },
  data() {
    const validateCompanyname = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error('公司名称不能为空'))
      } else {
        callback()
      }
    }
    const validatePhoneNum = (rule, value, callback) => {
      if (!regexIsPhone(value) || value.length == 0) {
        callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (regexIsNumber(value) && value.length === 4) {
        callback()
      } else {
        callback(new Error('验证码必须为4数字'))
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        name: '',
        mobile: '',
        code: '',
        password: ''
      },
      registerRules: {
        name: [
          { required: true, trigger: 'blur', validator: validateCompanyname }
        ],
        mobile: [
          { required: true, trigger: 'blur', validator: validatePhoneNum }
        ],
        code: [
          { required: true, trigger: 'blur', validator: validateCode }
        ],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      showServiceDialog: false
    }
  },
  mounted() {},
  methods: {
    // 企业注册
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          register(this.registerForm).then(res => {
            if (res.code === 0) {
              this.$message.success('注册成功！')
              // this.$emit('showLoginVisible')
              // 注册成功后直接登录
              this.$store
              .dispatch('Login', { username: this.registerForm.mobile, password: this.registerForm.password, keep: 1, mobile: '', phoneCode: '' })
              .then(res => {
                this.loading = false
                this.$router.push({ path: this.redirect || '/' })
              })
              .catch(() => {
                this.loading = false
              })
            } else {
              this.$message.error('注册失败！')
            }
          })
          this.loading = false
        } else {
          return false
        }
      })
    },
    // 获取验证码
    getCode() {
      sendCode(this.registerForm.mobile, 'register').then(res => {
        if (res.code === 0) {
          this.$message.success('发送成功！')
        } else {
          this.$message.error('发送失败')
        }
      })
    },
    // 用户协议
    userService() {
      let routeUrl = this.$router.resolve({
        path: "/serviceAgreement"
      })
      window.open(routeUrl .href, '_blank');
      // this.$router.push('/serviceAgreement')
      // this.showServiceDialog = true
    },
    // 直接登录
    loginNow() {
      this.$emit('showLoginVisible')
    }
  }
}
</script>

<style lang="scss" scoped>
$dark_gray: #ccc;
$light_gray: #333;
$login_theme: #108ee9;

/deep/ input {
  background-color: white;
  -webkit-appearance: none;
  &:-webkit-autofill {
    background-image: none;
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
    -webkit-text-fill-color: $light_gray !important;
  }
}
/deep/ .el-input__inner {
  height: 40px;
  padding: 0 12px;
  background-color: white;
}
/deep/ .el-form-item__error {
  left: 12px;
}
/deep/ .el-link.el-link--primary {
  color: #108ee9;
}
.right {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 460px;
  height: 460px;
  background-color: #fff;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 41px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .el-form {
    width: 70%;
    .title {
      font-weight: bold;
      font-size: 16px;
      color: $light_gray;
      margin: 0 auto 20px;
      text-align: center;
    }
    .change-item {
      margin-bottom: 20px;
      p {
        cursor: pointer;
      }
      .active {
        font-weight: bold;
      }
      div {
        margin-left: 20px;
        margin-right: 20px;
      }
    }
    .submit-btn {
      width: 100%;
      color: white;
      background-color: $login_theme;
      display: block;
      border: 0 none;
    }
    .login__error {
      color: #f56c6c;
    }
    .el-button {
      height: 40px;
      border-radius: 3px;
    }
    .action-control {
      color: #999;
      margin-bottom: 10px;
      margin-top: -10px;
      /deep/ .el-checkbox {
        .el-checkbox__label {
          color: #999;
        }
        .el-checkbox__input.is-checked .el-checkbox__inner {
          background-color: $login_theme;
          border-color: $login_theme;
        }
      }
    }
    .register-wrap {
      .register-btn {
        width: 100%;
        display: block;
        color: $login_theme;
        border-color: $login_theme;
        background-color: #fff;
      }
    }
    .phone-code {
      position: relative;
      /deep/ .el-input__inner {
        padding-right: 90px;
      }
    }
  }
}
</style>
