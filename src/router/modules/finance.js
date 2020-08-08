/** 财务管理管理路由 */
import Layout from '@/views/layout/financeLayout'

// 财务概览
const financialOverview = {
  path: 'financialOverview',
  component: () => import('@/views/financialManagement/index'),
  meta: {
    requiresAuth: true,
    title: '财务概览',
    icon: 'oa_analysis',
    index: 1,
    type: 'finance',
    subType: 'financeinfo'
  }
}

// 消费记录
const purchaseHistory = {
  requiresAuth: true,
  index: 1,
  type: 'finance',
  subType: 'spend'
}

const purchaseHistoryRouter = {
  path: 'spend',
  meta: {
    icon: 'schedule',
    title: '消费记录',
    ...purchaseHistory
  },
  hidden: false,
  children: [
    {
      path: 'realTimeBilling',
      component: () => import('@/views/financialManagement/purchaseHistory/realTimeBilling'),
      meta: {
        title: '实时账单',
        ...purchaseHistory
      }
    }, {
      path: 'historicalBill',
      component: () => import('@/views/financialManagement/purchaseHistory/historicalBill'),
      meta: {
        title: '历史账单',
        ...purchaseHistory
      }
    }
  ]
}

// 充值记录
const rechargeRecord = {
  path: 'recharge',
  component: () => import('@/views/financialManagement/rechargeRecord'),
  meta: {
    requiresAuth: true,
    title: '充值记录',
    icon: 'pay',
    index: 1,
    type: 'finance',
    subType: 'recharge'
  }
}

// 账单详情
const callHistoryDetail = {
  path: 'historyDetail/:date',
  component: () => import('@/views/financialManagement/callHistoryDetail'),
  meta: {
    requiresAuth: true,
    title: '账单详情',
    icon: 'money',
    index: 1,
    type: 'finance',
    subType: 'recharge'
  }
}

export const financeRouter = {
  path: '/finance',
  component: Layout,
  redirect: '/finance/financialOverview',
  name: 'finance',
  hidden: true,
  meta: {
    requiresAuth: false,
    title: '财务管理',
    index: 0,
    type: 'finance'
  },
  children: [
    financialOverview,
    ...purchaseHistoryRouter.children,
    rechargeRecord,
    callHistoryDetail
  ]
}

export const financeRouterMenu = [
  financialOverview,
  purchaseHistoryRouter,
  rechargeRecord
]

