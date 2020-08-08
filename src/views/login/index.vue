<template>
  <div class="wrapper">
    <div class="left">
      <div class="left-pic" />
    </div>
    <login v-if="isLogin" @showRegisterVisible="showRegisterVisible" @showResetVisible="showResetVisible" />
    <register v-if="isRegister" @showLoginVisible="showLoginVisible" />
    <reset-password v-if="isResetPass" @showLoginVisible="showLoginVisible" />
    <div
      class="copyright"
    >Copyright ©2020 heycom.cn All Rights Reserved. 浙ICP备18046913号-1 增值电信业务经营许可证编号：浙B2-20184735</div>
    <el-dialog
      :visible.sync="registDialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      title="企业注册须知"
      width="320px"
      top="33vh"
      center
      custom-class="businessDialog"
    >
      <p>本平台服务仅面向正规合法经营企业开放，且须经电信运营商备案、认证审核后才能开通服务。</p>
      <p>严禁用于：个人业务/新房销售/店铺/金融/信用卡/催缴/保健品/茶叶/运营商增值业务/旅游推销/POS机业务/装修/盲呼/群呼等业务。</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="registDialogVisible = false">我知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Login from './login'
import Register from './register'
import ResetPassword from './resetPassword'
export default {
  name: 'LoginIndex',
  components: {
    Login,
    Register,
    ResetPassword
  },
  data() {
    return {
      redirect: undefined,
      registDialogVisible: false, // 企业注册须知对话框
      isLogin: true,
      isRegister: false,
      isResetPass: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    showRegisterVisible() {
      this.registDialogVisible = true
      this.isRegister = true
      this.isLogin = false
      this.isResetPass = false
    },
    showLoginVisible() {
      this.isLogin = true
      this.isRegister = false
      this.isResetPass = false
    },
    showResetVisible() {
      this.isResetPass = true
      this.isLogin = false
      this.isRegister = false
    }
  }
}
</script>

<style lang="scss" scoped>
$dark_gray: #ccc;
$light_gray: #333;
$login_theme: #108ee9;

.wrapper {
  position: relative;
  width: 100%;
  min-width: 1300px;
  display: flex;
  .left {
    width: 100%;
    .left-pic {
      width: 100%;
      height: 100%;
      background: url('../../assets/img/login/login.png') no-repeat center;
      background-size: cover;
      filter: blur(10px);
    }
  }
  .copyright {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 60px;
    line-height: 60px;
    background-color: #fff;
    color: #d0d0d0;
    font-size: 12px;
    text-align: center;
  }
  .businessDialog {
    .el-dialog__body {
      p:nth-child(1) {
        margin-bottom: 10px;
      }
      p {
        line-height: 22px;
      }
    }
  }
  /deep/ .el-dialog__title {
    font-weight: bold;
  }
  /deep/ .el-dialog--center .el-dialog__body {
    padding: 10px 25px 0px;
  }
  /deep/ .el-dialog--center .el-dialog__footer {
    padding-bottom: 10px;
  }
}
</style>
