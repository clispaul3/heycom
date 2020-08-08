<!-- 倒计时 -->
<template>
  <div class="count-down">
    <el-link v-show="showCode" :underline="false" type="primary" @click="getCode">获取验证码</el-link>
    <span v-show="!showCode">{{ count }} 秒后可重发</span>
  </div>
</template>

<script>
import { regexIsPhone } from '@/utils'
export default {
  props: {
    moblieValue: String,
    ifReset: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showCode: true, // 展示获取验证码
      count: '',
      timer: null,
      currentMobile: ''
    }
  },

  created() {},

  mounted() {},

  watch: {
    moblieValue: {
      handler: function() {
        this.currentMobile = this.moblieValue
      },
      deep: true //用于监听e对象内部值的变化
    },
    ifReset: {
      handler: function() {
        this.showCode = true
        clearInterval(this.timer)
        this.timer = null
      }
    }
  },

  methods: {
    // 获取验证码
    getCode() {
      if (regexIsPhone(this.moblieValue)) {
        this.$emit('sendCode')
        const TIME_COUNT = 60
        if (!this.timer) {
          this.count = TIME_COUNT
          this.showCode = false
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--
            } else {
              this.showCode = true
              clearInterval(this.timer)
              this.timer = null
            }
          }, 1000)
        }
      } else {
        this.$message.error('手机号格式不正确！')
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.count-down {
  position: absolute;
  top: 0;
  right: 10px;
  text-align: center;
  span {
    color: #8590a6;
  }
}
</style>
