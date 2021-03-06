import {
  asyncRouterMap
} from '@/router'
import Vue from 'vue'

/**
 *
 * @param {*} router
 * @param {*} authInfo
 */
function checkAuth(router, authInfo) {
  // 判断当前路由在权限数组中是否存在
  if (router.meta) {
    const metaInfo = router.meta
    if (!metaInfo.requiresAuth) {
      return true
    } else {
      // 顶部导航栏权限
      if (metaInfo.index == 0) {
        return !!authInfo[metaInfo.type]
      } else if (metaInfo.index == 1) { // 左侧导航栏一级权限
        if (authInfo[metaInfo.type]) {
          return !!authInfo[metaInfo.type][metaInfo.subType]
        }
        return false
      } else {
        // 左侧导航栏二级菜单权限
        var typeAuth = authInfo[metaInfo.type] // 左侧一级菜单权限列表(包含子权限)
        for (let index = 0; index < metaInfo.subType.length; index++) {
          const field = metaInfo.subType[index]
          typeAuth = typeAuth[field]
          // 二级权限有，并且二级权限之下也有三级权限
          if (typeAuth && metaInfo.subType.length - 1 == index) {
            return true
          } else if (!typeAuth) {
            return false
          }
        }
      }
    }
  }
  return true
}

/**
 *
 * @param {*} routers
 * @param {*} authInfo
 */
const filterAsyncRouter = function(routers, authInfo) {
  const res = []
  routers.forEach(router => {
    // 深拷贝
    const tmp = {
      ...router
    }
    if (checkAuth(tmp, authInfo)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, authInfo)
      }
      res.push(tmp)
      // console.log(res);
    }
  })
  return res
}

const permission = {
  state: {
    addRouters: [],
    homeRouters: {
      name: 'home',
      children: []
    },
    crmRouters: {
      name: 'crm',
      children: []
    },
    biRouters: {
      name: 'bi',
      children: []
    },
    manageRouters: {
      name: 'manager',
      children: []
    },
    financeRouters: {
      name: 'finance',
      children: []
    },
    serviceRouters: {
      name: 'service',
      children: []
    }
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      for (let index = 0; index < routers.length; index++) {
        const element = routers[index]
        if (element.name == 'home') {
          state.homeRouters = element
        } else if (element.name == 'finance') {
          state.financeRouters = element
        } else if (element.name == 'crm') {
          state.crmRouters = element
        } else if (element.name == 'bi') {
          state.biRouters = element
        } else if (element.name == 'manager') {
          state.manageRouters = element
        } else if (element.name == 'service') {
          state.serviceRouters = element
        }
      }
    },

    /**
     * 客户管理待办消息数
     */
    SET_CRMROUTERSNUM: (state, num) => {
      const messageItem = state.crmRouters.children[1]
      messageItem.meta.num = num
      Vue.set(state.crmRouters.children, 1, messageItem)
    }
  },
  actions: {
    GenerateRoutes({
      commit
    }, data) {
      return new Promise(resolve => {
        // console.log(asyncRouterMap);
        const accessedRouters = filterAsyncRouter(asyncRouterMap, data)
        let redirect = ''
        for (let index = 0; index < accessedRouters.length; index++) {
          const element = accessedRouters[index]
          if (element.children && element.children.length > 0) {
            element.redirect = element.path + '/' + element.children[0].path
          }

          // 获取跳转
          if (element.redirect && !redirect) {
            redirect = element.redirect
          }
        }
        if (redirect) {
          accessedRouters.push({
            path: '/',
            redirect: '/homePage',
            hidden: true
          })
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
