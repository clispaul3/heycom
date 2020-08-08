<template>
  <el-container>
    <el-header class="nav-container">
      <navbar
        :nav-index="4"
        @nav-items-click="navClick"/>
    </el-header>
    <el-container>
      <el-aside
        width="auto"
        class="aside-container">
        <sidebar
          :items="serviceRouterMenus"
          create-button-title=""
          main-router="service"/>
      </el-aside>
      <el-main id="crm-main-container">
        <app-main/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { Navbar, Sidebar, AppMain } from './components'
import { serviceRouterMenu } from '@/router/modules/service'

export default {
  name: 'ServiceLayout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['service']),
    serviceRouterMenus() {
      console.log(serviceRouterMenu)
      for (let index = 0; index < serviceRouterMenu.length; index++) {
        const routerMenuItem = serviceRouterMenu[index]
        routerMenuItem.hidden = false
      }
      return serviceRouterMenu
    }
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

.el-container {
  overflow: hidden;
}
</style>
