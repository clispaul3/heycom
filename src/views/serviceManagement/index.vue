<!-- 联系客服 -->
<template>
  <div>
    <h3 class="title">联系客服</h3>
    <el-card>
      <flexbox>
        <label>您在使用系统过程中若遇到问题请首先和企业管理员联系，若无法解决请再联系平台客服，谢谢！</label>
      </flexbox>
      <flexbox>
        <label>{{ business_hoursInfo.label }}：{{ business_hoursInfo.value }}</label>
      </flexbox>
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
      <flexbox>
        <!-- <label>{{ phoneInfo.label }}：{{ phoneInfo.value }}</label> -->
        <label>{{ phoneInfo.label }}：13023776257</label>
      </flexbox>
    </el-card>
  </div>
</template>

<script>
import { customerService } from '@/api/customermanagement/call'
export default {
  data() {
    return {
      qqInfo: {},
      wechatInfo: {},
      phoneInfo: {},
      business_hoursInfo: {}
    }
  },

  created() {},

  mounted() {
    customerService().then(res => {
      if (res.code === 0) {
        this.qqInfo = res.data[0]
        this.wechatInfo = res.data[1]
        this.phoneInfo = res.data[2]
        this.business_hoursInfo = res.data[3]
      } else {
        this.$message.error('请求失败')
      }
    })
  },

  methods: {
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
    font-size: 18px;
  }
  .link {
    margin-left: 20px;
  }
}
.offset-div {
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
