<template>
  <el-container>
    <el-header class="nav-container">
      <manager-navbar nav-title="个人设置"/>
    </el-header>
    <el-container>
      <el-aside
        width="auto"
        class="aside-container">
        <sidebar
          :items="routerItems.children"
          create-button-title=""
          main-router="person"/>
      </el-aside>
      <el-main
        id="crm-main-container"
        style="padding:15px;">
        <app-main/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { ManagerNavbar, Sidebar, AppMain } from './components'
import { mapGetters } from 'vuex'
import personRouter from '@/router/modules/person'

export default {
  name: 'Layout',
  components: {
    ManagerNavbar,
    Sidebar,
    AppMain
  },
  data() {
    return {
      routerItems: []
    }
  },
  mounted() {
    this.routerItems = personRouter || []
  },
  computed: {
    ...mapGetters(['navActiveIndex'])
  },
  methods: {
    navClick(index) {}
  }
}
</script>

<style lang="scss" scoped>
.aside-container {
  position: relative;
  background-color: #2d3037;
  box-sizing: border-box;
  border-right: solid 1px #e6e6e6;
}

.nav-container {
  padding: 0;
  box-shadow: 0px 1px 2px #dbdbdb;
  z-index: 100;
  min-width: 1200px;
}
</style>
