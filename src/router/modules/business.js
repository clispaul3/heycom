/** 商业智能管理路由 */
import Layout from '@/views/layout/businessLayout'

// 通话分析
const callAnalysisAuth = {
  requiresAuth: true,
  index: 1,
  type: 'bi',
  subType: 'call'
}

const callAnalysisRouter = {
  path: 'call',
  meta: {
    icon: 'employeestatistics',
    title: '通话分析',
    ...callAnalysisAuth
  },
  hidden: false,
  children: [
    {
      path: 'callRate', // 接通率
      component: () => import('@/views/businessIntelligence/callAnalysis/CallConnectionRate'),
      meta: {
        title: '接通率',
        ...callAnalysisAuth
      }
    }, {
      path: 'callTime', // 通话总时长
      component: () => import('@/views/businessIntelligence/callAnalysis/CallTime'),
      meta: {
        title: '通话总时长',
        ...callAnalysisAuth
      }
    }, {
      path: 'callTimeAverage', // 平均通话时长
      component: () => import('@/views/businessIntelligence/callAnalysis/CallTimeAverage'),
      meta: {
        title: '平均通话时长',
        ...callAnalysisAuth
      }
    }, {
      path: 'callDurationPercentage', // 通话时长占比
      component: () => import('@/views/businessIntelligence/callAnalysis/CallDurationPercentage'),
      meta: {
        title: '通话时长占比',
        ...callAnalysisAuth
      }
    }
  ]
}

export const biRouter = {
  path: '/bi',
  component: Layout,
  redirect: '/bi/callRate',
  name: 'bi',
  hidden: true,
  meta: {
    requiresAuth: true,
    title: '统计分析',
    index: 0,
    type: 'bi'
  },
  children: [
    ...callAnalysisRouter.children
  ]
}

export const biRouterMenu = [
  callAnalysisRouter
]
