<!-- 系统来电 -->
<template>
  <div v-loading="loading" class="main-container">
    <h3 class="title">系统来电号码</h3>
    <el-card>
      <h3>系统来电号码：</h3>
      <div class="phone-box" v-if="phoneList.length > 0">
        <p v-for="(item, index) in phoneList" :key="index">{{ item.mobile }}</p>
      </div>
      <div class="phone-box" v-else>
        <p>暂无号码</p>
      </div>
      <div class="tips">
        <p>温馨提示：</p>
        <p>1.请勿使用号码工具软件标记公司专用来电号码，以免影响呼出接通率；</p>
        <p>2.为便于您更好识别公司专用来电号码，请将系统来电号码存入手机通讯录，扫码使用小程序在“我的”-“设置”-“系统来电号码”中可更方便地保存到手机通讯录。</p>
      </div>
    </el-card>
  </div>
</template>

<script>
import { querySystemPhone } from '@/api/customermanagement/call'
export default {
  data () {
    return {
      loading: false,
      phoneList: []
    }
  },

  created() {
    querySystemPhone().then(res => {
      if (res.code === 0) {
        this.phoneList = res.data || []
      } else {
        this.$message.error('获取号码失败！')
      }
      this.loading = false
    })
  },

  methods: {}
}

</script>
<style lang='scss' scoped>
.title {
  font-weight: normal;
  margin-bottom: 10px;
  font-size: 18px;
}
h3 {
  font-weight: normal;
  color: #666;
  font-size: 13px;
}
.phone-box {
  margin-top: 20px;
  margin-bottom: 30px;
  p {
    font-size: 13px;
    color: #666;
    margin-bottom: 20px;
  }
}
.tips {
  color: #666;
  font-size: 13px;
  p {
    margin-bottom: 5px;
  }
}
</style>
