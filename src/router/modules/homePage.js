/** 项目管理路由 */
import Layout from '@/views/layout/homePageLayout'

const homePageRouter = {
  path: '/homePage',
  component: Layout,
  name: 'home',
  hidden: true,
  meta: {
    requiresAuth: true,
    title: '首页',
    index: 0,
    type: 'index'
  }
}

export default homePageRouter
