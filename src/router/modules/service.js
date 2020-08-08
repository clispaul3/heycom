/** 客服支持 */
import Layout from '@/views/layout/serviceLayout'

// 联系客服
const contactService = {
  path: 'contactService',
  component: () => import('@/views/serviceManagement/index'),
  meta: {
    requiresAuth: true,
    title: '联系客服',
    icon: 'contacts',
    index: 1,
    type: 'service',
    subType: 'contactservice'
  }
}

export const serviceRouter = {
  path: '/service',
  component: Layout,
  redirect: '/service/contactService',
  name: 'service',
  hidden: true,
  meta: {
    requiresAuth: true,
    title: '联系客服',
    index: 0,
    type: 'service'
  },
  children: [
    contactService
  ]
}

export const serviceRouterMenu = [
  contactService
]

