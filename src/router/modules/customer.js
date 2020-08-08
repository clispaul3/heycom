/** 客户管理路由 */
import Layout from '@/views/layout/customerLayout'

const customerRouter = {
  path: '/crm',
  component: Layout,
  redirect: '/crm/dial',
  name: 'crm',
  hidden: true,
  meta: {
    requiresAuth: true,
    title: '客户管理',
    index: 0,
    type: 'crm'
  },
  children: [{
    path: 'dial', // 拨号
    component: () => import('@/views/customermanagement/dial/Dial'),
    meta: {
      requiresAuth: true,
      title: '拨号',
      icon: 'employeestatistics',
      index: 1,
      type: 'crm',
      subType: 'call'
    }
  },
  {
    path: 'talkingList', // 话单
    component: () => import('@/views/customermanagement/dial/TalkingList'),
    meta: {
      requiresAuth: true,
      title: '话单',
      icon: 'address',
      index: 2,
      type: 'crm',
      subType: ['call','index']
    }
  }
  ]
}

export default customerRouter
