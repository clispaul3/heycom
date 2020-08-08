<!-- 倒计时 -->
<template>
  <div class="change-item">
    <p :class="{active: isToday}" @click="handleToday">今日</p>
    <el-divider direction="vertical"></el-divider>
    <p :class="{active: !isToday}" @click="handleYesterday">昨日</p>
  </div>
</template>

<script>
export default {
  props: {
    today: {
      type: Boolean
    }
  },

  data() {
    return {
      isToday: this.today
    }
  },

  created() {},

  methods: {
    handleToday() {
      this.isToday = true
      this.$emit('update:today', true)
    },
    handleYesterday() {
      this.isToday = false
      this.$emit('update:today', false)
    }
  }
}
</script>
<style lang='scss' scoped>
$blue_theme: #409eff;
.change-item {
  display: flex;
  p {
    cursor: pointer;
  }
  div {
    margin-left: 10px;
    margin-right: 10px;
  }
  .active {
    color: $blue_theme;
  }
}
</style>
