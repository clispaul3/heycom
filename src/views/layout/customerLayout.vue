<template>
  <el-container>
    <el-header class="nav-container">
      <navbar :nav-index="1" @nav-items-click="navClick" />
    </el-header>
    <el-container>
      <el-aside width="auto" class="aside-container">
        <sidebar :items="crmRouters.children" main-router="crm"></sidebar>
      </el-aside>
      <el-main id="crm-main-container" style="padding:15px;">
        <app-main />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { Navbar, Sidebar, AppMain } from './components'

export default {
  name: 'Layout',

  components: {
    Navbar,
    Sidebar,
    AppMain
  },

  data() {
    return {
      isCreate: false,
      createCRMType: ''
    }
  },

  computed: {
    ...mapGetters(['crm', 'crmRouters'])
  },

  created() {},

  mounted() {},

  methods: {
    navClick(index) {}
  }
}
</script>

<style lang="scss" scoped>
@import './styles/common.scss';
.el-container {
  min-height: 0;
}
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
