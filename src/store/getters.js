const getters = {
  userInfo: state => state.user.userInfo,
  lang: state => state.app.lang,
  logo: state => {
    if (state.app.logo) {
      return state.app.logo
    }
    return require('@/assets/img/logo.png')
  },
  name: state => {
    if (state.app.name) {
      return state.app.name
    }
    return 'Heycom客户关系管理系统'
  },
  activeIndex: state => state.app.sidebar.activeIndex,
  navActiveIndex: state => state.app.navbar.activeIndex,
  // 权限
  allAuth: state => state.user.allAuth,
  home: state => state.user.home,
  crm: state => state.user.crm,
  bi: state => state.user.bi,
  manage: state => state.user.manage,
  finance: state => state.user.finance,
  service: state => state.user.service,
  project: state => state.user.project,
  // 路由
  addRouters: state => state.permission.addRouters,
  homeRouters: state => state.permission.homeRouters,
  financeRouters: state => state.permission.financeRouters,
  crmRouters: state => state.permission.crmRouters,
  biRouters: state => state.permission.biRouters,
  serviceRouters: state => state.permission.serviceRouters,
  manageRouters: state => state.permission.manageRouters,
  // 客户管理信息
  messageNum: state => state.customer.messageNum,
  messageOANum: state => state.oa.messageOANum,
  // 配置信息
  CRMConfig: state => state.app.CRMConfig
}
/**
 * 使用说明
 * import { mapGetters } from 'vuex'
 * computed: {
    ...mapGetters([
      'userInfo'
    ])
  }
 */

export default getters
