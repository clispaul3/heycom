<!-- 拨号 -->
<template>
  <div>
    <h3 class="title">拨号</h3>
    <el-card>
      <div class="step-wrap">
        <div class="step-item">
          <div class="num">1</div>
          <span>发起呼叫</span>
          <div class="line"></div>
        </div>
        <div class="step-item">
          <div class="num">2</div>
          <span>接听来电</span>
          <div class="line"></div>
        </div>
        <div class="step-item">
          <div class="num">3</div>
          <span>接通被叫</span>
        </div>
      </div>
      <el-form
        ref="ruleForm"
        :model="callForm"
        :rules="callRules"
        label-width="100px"
        class="callForm"
      >
        <el-form-item label="被叫号码" prop="mobile">
          <el-input v-model="callForm.mobile" placeholder="请输入或粘贴被叫号码"></el-input>
        </el-form-item>
        <el-form-item label="主叫号码" prop="id">
          <el-select v-model="callForm.id" placeholder="请选择主叫号码" @change="selectChange">
            <el-option
              v-for="item in callingOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-link
            v-if="showSetting"
            :underline="false"
            style="margin-left: 10px"
            type="primary"
            @click="goSetting"
          >设置</el-link>
        </el-form-item>
        <el-form-item v-if="showCall">
          <el-button type="primary" @click="handleCalling">发起呼叫</el-button>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div class="tips">
        <p>温馨提示：</p>
        <p>1.请勿使用号码工具软件标记公司专用来电号码，以免影响呼出接通率</p>
        <p>2.为便于您更好识别公司专用来电号码，请将来电号码存入手机通讯录</p>
        <div>
          <span v-for="(item, index) in phoneNums" :key="index">{{ item }}</span>
        </div>
      </div>
    </el-card>
    <!-- 发起呼叫提示框 -->
    <div class="call-success-tips" v-show="showSuccess">
      <i class="el-icon-circle-check"></i>
      <p>
        请求成功，请接听系统来电，勿标记
        <!--<span>{{ prefix }}</span> 开头的来电，勿标记-->
      </p>
    </div>
    <!-- 请求异常提示框 -->
    <div class="call-success-tips" v-show="showError">
      <i class="el-icon-warning-outline"></i>
      <p>请求异常</p>
    </div>
  </div>
</template>

<script>
import {
  callSend,
  queryPhoneByUser,
  querySystemPhone
} from '@/api/customermanagement/call'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      callForm: {
        mobile: '', // 被叫
        id: '' // 主叫
      },
      mobile: '',
      prefix: '',
      showSuccess: false,
      showError: false,
      timer1: null,
      timer2: null,
      callRules: {
        mobile: [
          { required: true, message: '请输入被叫号码', trigger: 'change' }
        ],
        id: [{ required: true, message: '请输入主叫号码', trigger: 'change' }]
      },
      callingOptions: [],
      phoneNums: [
        // '13818767678'
      ],
      queryPhoneParams: {
        status: '1',
        mobile: '',
        pageType: 0
      }
    }
  },

  created() {},

  mounted() {
    this.getQueryPhoneByUser()
    this.getQuerySystemPhone()
  },

  computed: {
    ...mapGetters(['crm']),
    // 展示发送呼叫
    showCall() {
      return this.crm.call.send
    },
    // 展示设置
    showSetting() {
      return this.crm.call.setting
    }
  },

  beforeDestroy() {
    clearInterval(this.timer1)
    clearInterval(this.timer2)
    this.timer1 = null
    this.timer2 = null
  },

  methods: {
    selectChange() {
      const id = this.callForm.id
      this.callingOptions.forEach((element, index) => {
        if (element.value === id) {
          this.mobile = element.mobile
        }
      })
    },
    handleCalling() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          callSend(this.callForm).then(res => {
            if (res.code === 0) {
              // this.prefix = res.data.prefix
              this.showSuccess = true
              this.timer1 = setTimeout(() => {
                this.showSuccess = false
              }, 5000)
            } else {
              this.showError = true
              this.timer2 = setTimeout(() => {
                this.showError = false
              }, 3000)
            }
          })
        } else {
          return false
        }
      })
    },
    getQueryPhoneByUser() {
      queryPhoneByUser(this.queryPhoneParams).then(res => {
        if (res.code === 0) {
          if (res.data.length > 0) {
            res.data.forEach((element, index) => {
              this.callingOptions.push({
                mobile: `${element.mobile}`,
                label: `${element.mobile}  ${element.remark}`,
                value: element.id,
                default: element.default
              })
            })
            let defaultObj = this.callingOptions.find(n => {
              return n.default === 1
            })
            this.callForm.id = defaultObj.value
          }
        } else {
          this.$message.error('请求失败')
        }
      })
    },
    getQuerySystemPhone() {
      querySystemPhone().then(res => {
        if (res.code === 0) {
          const phoneNums = []
          for (let item of res.data) {
            phoneNums.push(item.mobile)
          }
          this.phoneNums = phoneNums
        }
      })
    },
    goSetting() {
      this.$router.push('/person/callSetting')
    }
  }
}
</script>
<style lang='scss' scoped>
$gray: #999;
/deep/ .el-input__inner,
.el-button {
  width: 250px;
  height: 40px;
}
.el-button {
  font-size: 16px;
}
/deep/ .el-form-item__label {
  color: $gray;
}
.title {
  font-weight: normal;
  margin-bottom: 10px;
  font-size: 18px;
}
.step-wrap {
  width: 460px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px auto 0;
  font-size: 14px;
  color: #ccc;
  .step-item {
    display: flex;
    align-items: center;
    .num {
      width: 30px;
      height: 30px;
      line-height: 30px;
      margin-right: 10px;
      text-align: center;
      border: 2px solid #ccc;
      border-radius: 50%;
    }
    span {
      display: block;
      width: 60px;
      color: $gray;
    }
  }
  .line {
    width: 74px;
    height: 1px;
    background-color: #ccc;
  }
}
.callForm {
  width: 390px;
  margin: 60px auto 60px;
}
.tips {
  width: 460px;
  margin: 0 auto 15px;
  p {
    margin-bottom: 15px;
    color: $gray;
  }
  > div {
    display: flex;
    flex-wrap: wrap;
    span {
      display: block;
      width: 25%;
      margin-bottom: 15px;
      color: $gray;
    }
  }
}
.call-success-tips {
  position: absolute;
  left: 50%;
  top: 14%;
  margin-left: 30px;
  width: 200px;
  height: 200px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  i {
    font-size: 60px;
  }
  p {
    font-size: 16px;
    line-height: 20px;
    span {
      font-weight: bold;
    }
  }
}
</style>
