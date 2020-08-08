<template>
  <div class="right">
    <!-- 重置密码 -->
    <el-form
      ref="resetForm"
      :model="resetForm"
      :rules="resetRules"
      class="reset-form"
      auto-complete="on"
    >
      <div class="title">重置密码</div>
      <el-form-item prop="mobile">
        <el-input
          v-model="resetForm.mobile"
          type="text"
          name="mobile"
          auto-complete="on"
          placeholder="已注册手机号"
          @keyup.enter.native="handleReset"
        />
      </el-form-item>
      <el-form-item prop="code" class="phone-code">
        <el-input v-model="resetForm.code" placeholder="手机验证码"></el-input>
        <!-- 验证码倒计时 -->
        <countDown :moblieValue="resetForm.mobile" @sendCode="getCode" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="resetForm.password"
          type="password"
          name="password"
          auto-complete="on"
          placeholder="设置新密码"
          @keyup.enter.native="handleReset"
        />
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="resetForm.confirmPassword"
          type="password"
          name="confirmPassword"
          auto-complete="on"
          placeholder="确认新密码"
          @keyup.enter.native="handleReset"
        />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" class="submit-btn" @click.native.prevent="handleReset">确定</el-button>
      </el-form-item>
    </el-form>
    <p style="display: flex;">
      想起了密码，
      <el-link :underline="false" type="primary" style="font-size: 14px;" @click="loginNow">返回登录</el-link>
    </p>
  </div>
</template>

<script>
import { regexIsNumber } from '@/utils'
import CountDown from './countDown'
import { sendCode, resetPassword } from '@/api/login'
export default {
  name: 'Register',
  components: {
    CountDown
  },
  data() {
    const validatePhoneNum = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error('手机号不能为空'))
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
        if (this.resetForm.confirmPassword !== '') {
          this.$refs.resetForm.validateField('confirmPassword')
        }
        callback()
      }
    }
    const validateCheckPass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else if (value !== this.resetForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      resetForm: {
        mobile: '',
        code: '',
        password: '',
        confirmPassword: ''
      },
      resetRules: {
        mobile: [
          { required: true, trigger: 'blur', validator: validatePhoneNum }
        ],
        code: [
          { required: true, trigger: 'blur', validator: validateCode }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePass }
        ],
        confirmPassword: [
          { required: true, trigger: 'blur', validator: validateCheckPass }
        ]
      },
      loading: false,
      showServiceDialog: false
    }
  },
  mounted() {},
  methods: {
    // 重置密码
    handleReset() {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          this.loading = true
          resetPassword(this.resetForm).then(res => {
            if (res.code === 0) {
              this.$message.success('重置密码成功')
              this.$emit('showLoginVisible')
            } else {
              this.$message.error('重置密码失败！')
            }
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    // 获取验证码
    getCode() {
      sendCode(this.resetForm.mobile, 'reset').then(res => {
        if (res.code === 0) {
          this.$message.success('发送成功！')
        } else {
          this.$message.error('发送失败')
        }
      })
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
