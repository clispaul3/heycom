<!-- 财务概览 -->
<template>
  <div>
    <h3 class="title">财务概览</h3>
    <el-card>
      <flexbox>
        <label>当前话费余额：</label>
        <span class="s1">￥{{ financeData.amount }}</span>
      </flexbox>
      <flexbox>
        <label>本月实时消费：</label>
        <span>￥{{ financeData.currentMonthBill }}</span>
        <el-link type="primary" class="link" @click="getRealTime">查看实时账单</el-link>
      </flexbox>
      <flexbox>
        <label>上月消费金额：</label>
        <span>￥{{ financeData.lastMonthBill }}</span>
        <el-link type="primary" class="link" @click="gethistory">查看历史账单</el-link>
      </flexbox>
      <p>联系客服充值：</p>
      <flexbox class="offset-div">
        <label>{{ qqInfo.label }}：</label>
        <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=1126014446&site=qq&menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:1126014446:41" alt="点击这里给我发消息" title="点击这里给我发消息"/></a>
        <!-- <a href="javascript:;">
          <img
            src="https://axure-file.lanhuapp.com/9737ab6d-b51a-4077-ad29-7cd4b0eddd3b__17ec37bb0330ff020399a0e2791ec1bf.png"
            @click="openQQ"
          />
        </a> -->
      </flexbox>
      <flexbox class="offset-div">
        <label style="margin-right: 0;">{{ wechatInfo.label }}：</label>
        <div>
          <img
            src="https://axure-file.lanhuapp.com/9737ab6d-b51a-4077-ad29-7cd4b0eddd3b__e632922a74c8a7e7fe03925c5fb96b25.png"
            alt
          />
          <p>扫码加好友</p>
        </div>
      </flexbox>
      <flexbox class="offset-div">
        <label>充值电话：13023776257</label>
        <span>{{ financeData.phone }}</span>
      </flexbox>
      <flexbox>
        <label>预警阈值设置：</label>
        <el-switch
          v-model="switchValue"
          active-color="#1890FF"
          inactive-color="#ff4949"
          @change="changeConfig"
        ></el-switch>
      </flexbox>
      <flexbox class="offset-div">
        <span>当前话费余额低于</span>
        <el-input v-model="balanceVal" style="width: 60px ;margin-left: 10px; margin-right: 10px;" :disabled="!switchValue"></el-input>
        <span>元时发送充值提醒短信给</span>
        <el-input v-model="phoneVal" style="width: 120px ;margin-left: 10px; margin-right: 10px;" :disabled="!switchValue"></el-input>
      </flexbox>
      <flexbox>
        <label>当前资费标准：</label>
        <span>{{ financeData.chargeFormat }}</span>
      </flexbox>
    </el-card>
  </div>
</template>

<script>
import { financeAll, updateConfig } from '@/api/financeManagement/index'
export default {
  data() {
    return {
      flag: true, // 设置阈值成功提醒提示信息
      switchValue: true,
      balanceVal: 300,
      phoneVal: '',
      financeData: {},
      configParams: {
        isWarning: 1,
        warningPhone: '',
        warningMoney: ''
      },
      qqInfo: {},
      wechatInfo: {}
    }
  },

  created() {},

  mounted() {
    this.getAllFinance()
  },

  watch: {
    balanceVal: {
      handler() {
        this.changeConfig()
      },
      immediate: true
    },
    phoneVal: function() {
      this.changeConfig()
    }
  },

  methods: {
    getAllFinance() {
      financeAll().then(res => {
        if (res.code === 0) {
          this.financeData = res.data
          this.financeData.isWarning === 1
            ? (this.switchValue = true)
            : (this.switchValue = false)
          this.balanceVal = this.financeData.warningMoney
          this.phoneVal = this.financeData.warningPhone
          this.configParams.warningPhone = this.financeData.warningPhone
          this.configParams.warningMoney = this.financeData.warningMoney
          this.qqInfo = this.financeData.service[0]
          this.wechatInfo = this.financeData.service[1]
        } else {
          this.$message.error('请求失败')
        }
      })
    },
    getRealTime() {
      this.$router.push('/finance/realTimeBilling')
    },
    gethistory() {
      this.$router.push('/finance/historicalBill')
    },
    changeConfig() {
      if (this.switchValue) { // 开
        this.configParams.isWarning = 1
      } else { // 关
        this.configParams.isWarning = 0
      }
      this.configParams.warningPhone = this.phoneVal
      this.configParams.warningMoney = this.balanceVal
      updateConfig(this.configParams).then(res => {
        if (res.code === 0) {
          if (this.flag) {
            this.flag = false
          } else {
            this.$message.success('设置成功')
          }
        }
      })
    },
    openQQ() {
      window.open(
        'http://wpa.qq.com/msgrd?v=3&uin=' + this.qqInfo.value + '&site=qq&menu=yes',
        '_brank'
      )
    }
  }
}
</script>
<style lang='scss' scoped>
/deep/ .el-card__body {
  font-size: 13px;
}
.title {
  font-weight: normal;
  margin-bottom: 10px;
  font-size: 18px;
}
.vux-flexbox {
  margin-bottom: 30px;
  label {
    margin-right: 10px;
  }
  .s1 {
    font-weight: bold;
    font-size: 13px;
  }
  .link {
    margin-left: 20px;
  }
}
.offset-div {
  padding-left: 90px;
  > div {
    img {
      width: 96px;
      height: 96px;
    }
    p {
      text-align: center;
    }
  }
}
</style>
