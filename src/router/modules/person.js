/** 个人中心管理路由 */
import Layout from '@/views/layout/personCenterLayout'

const personRouter = {
  path: '/person',
  component: Layout,
  redirect: '/person/index',
  name: 'person',
  hidden: true,
  meta: {
    requiresAuth: true,
    title: '个人中心',
    index: 0,
    type: 'crm'
  },
  children: [{
    path: 'index',
    component: () => import('@/views/PersonCenter/index'),
    meta: {
      requiresAuth: true,
      title: '个人资料',
      icon: 'person-task',
      index: 1,
      type: 'crm',
      subType: 'call'
    }
  },
  {
    path: 'callSetting',
    component: () => import('@/views/PersonCenter/callSetting'),
    meta: {
      requiresAuth: true,
      title: '外呼号码设置',
      icon: 'set',
      index: 1,
      type: 'crm',
      subType: 'call'
    }
  },
  {
    path: 'systemPhone',
    component: () => import('@/views/PersonCenter/systemPhone'),
    meta: {
      requiresAuth: true,
      title: '系统来电号码',
      icon: 'task',
      index: 1,
      type: 'crm',
      subType: 'call'
    }
  },
  {
    path: 'changePass',
    component: () => import('@/views/PersonCenter/changePassword'),
    meta: {
      requiresAuth: true,
      title: '修改密码',
      icon: 'edit-task',
      index: 1,
      type: 'crm',
      subType: 'call'
    }
  }
  ]
}

export default personRouter
