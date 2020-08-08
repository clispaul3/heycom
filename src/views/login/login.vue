<template>
  <div class="right">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="login-logo">
        <img :src="logo" />
      </div>
      <flexbox justify="center" align="center" class="change-item">
        <p :class="{active: isPassword}" @click="passwordLogin">账号密码登录</p>
        <el-divider direction="vertical"></el-divider>
        <p :class="{active: isQuick}" @click="quickLogin">手机快捷登录</p>
      </flexbox>
      <el-form-item v-if="isPassword" prop="username">
        <el-input
          ref="name"
          v-model="loginForm.username"
          autofocus="autofocus"
          name="username"
          type="text"
          auto-complete="on"
          placeholder="手机号"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
      <el-form-item v-if="isPassword" prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          name="password"
          auto-complete="on"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
      <el-form-item v-if="isQuick" prop="mobile">
        <el-input
          ref="name"
          v-model="loginForm.mobile"
          autofocus="autofocus"
          name="mobile"
          type="text"
          auto-complete="on"
          placeholder="手机号"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
      <el-form-item v-if="isQuick" prop="phoneCode" class="phone-code">
        <el-input v-model="loginForm.phoneCode" placeholder="手机验证码"></el-input>
        <!-- 验证码倒计时 -->
        <countDown :moblieValue="loginForm.mobile" @sendCode="getCode" />
      </el-form-item>
      <el-form-item class="action-control">
        <el-checkbox v-model="remember">10天内免登录</el-checkbox>
        <el-link v-show="isPassword" :underline="false" class="forget" @click="forgetPass">忘记密码？</el-link>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" class="submit-btn" @click.native.prevent="handleLogin">登录</el-button>
        <div v-show="loginErrorTips" class="login__error">该账号已被禁用，请联系企业管理员</div>
      </el-form-item>
      <el-form-item class="register-wrap">
        <el-button class="register-btn" @click="businessRegister">企业免费注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { objDeepCopy, regexIsNumber } from '@/utils'
import CountDown from './countDown'
import { sendCode } from '@/api/login'

export default {
  name: 'Login',
  components: {
    CountDown
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error('手机号不能为空'))
      } else {
        callback()
      }
    }
    const validateMobile = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error('手机号不能为空'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
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
    return {
      loginForm: {
        username: '',
        password: '',
        mobile: '',
        phoneCode: '',
        keep: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePass }
        ],
        mobile: [
          { required: true, trigger: 'blur', validator: validateMobile }
        ],
        phoneCode: [
          { required: true, trigger: 'blur', validator: validateCode }
        ]
      },
      loading: false,
      isPassword: true, // 账号密码登录
      isQuick: false, // 手机快捷登录
      remember: true, // 记住登录状态
      loginErrorTips: false, // 登录错误信息提醒
      phoneCode: '' // 手机验证码
    }
  },
  computed: {
    ...mapGetters(['logo', 'name'])
  },
  mounted() {},
  methods: {
    // 登录
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const copyLoginForm = { ...objDeepCopy(this.loginForm), keep: this.remember ? 1 : 0 }
          if (this.isPassword) {
            copyLoginForm.phoneCode = ''
            copyLoginForm.mobile = ''
          } else {
            copyLoginForm.username = ''
            copyLoginForm.password = ''
          }
          console.log(copyLoginForm)
          this.$store
          .dispatch('Login', copyLoginForm)
          .then(res => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          })
          .catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    // 账号密码登录
    passwordLogin() {
      this.isPassword = true
      this.isQuick = false
      this.$refs.loginForm.resetFields()
    },
    // 手机快捷登录
    quickLogin() {
      this.isPassword = false
      this.isQuick = true
      this.$refs.loginForm.resetFields()
    },
    // 企业注册
    businessRegister() {
      this.$emit('showRegisterVisible')
    },
    // 忘记密码
    forgetPass() {
      this.$emit('showResetVisible')
    },
    // 获取验证码
    getCode() {
      sendCode(this.loginForm.mobile, 'login').then(res => {
        if (res.code === 0) {
          this.$message.success('发送成功！')
        } else {
          this.$message.error('发送失败')
        }
      })
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

      .forget {
        color: $login_theme;
        cursor: pointer;
        float: right;
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

  .login-logo {
    text-align: center;
    margin-bottom: 30px;
    img {
      height: 40px;
    }
  }
}
</style>
