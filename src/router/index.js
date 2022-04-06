import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/agencyList',
    children: [{
      path: 'agencyList',
      name: '代理列表',
      component: () => import('@/views/agency/agencyList'),
      meta: { title: '代理列表', icon: 'dashboard' },
      hidden: true
    }]
  },

  {
    path: '/agency',
    component: Layout,
    redirect: '/agencyList',
    name: '代理管理',
    alwaysShow: true,
    meta: { title: '代理管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/agencyList',
        name: '代理列表',
        component: () => import('@/views/agency/agencyList'),
        meta: { title: '代理列表', icon: 'table' }
      },
      {
        path: '/agencyTest',
        name: '测试列表',
        component: () => import('@/views/agency/agencyTest'),
        meta: { title: '测试列表', icon: 'table' },
      },
      {
        path: '/orderDetail',
        name: '订单详情',
        component: () => import('@/views/agency/orderDetail'),
        meta: { title: '订单详情', icon: 'printer' },
        hidden: true
      },
      {
        path: '/agencyInviteCode',
        name: '邀请码',
        component: () => import('@/views/agency/agencyInviteCode'),
        meta: { title: '邀请码', icon: 'dashboard' },
      }
    ]
  },
  // {
  //   path: '/property',
  //   component: Layout,
  //   redirect: '/property/rechageAudit',
  //   name: '资产管理',
  //   alwaysShow: true,
  //   meta: { title: '资产管理', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'rechageAudit',
  //       name: '充值审核',
  //       component: () => import('@/views/property/rechageAudit'),
  //       meta: { title: '充值审核', icon: 'table' }
  //     },
  //     {
  //       path: 'withdrawalAudit',
  //       name: '提现审核',
  //       component: () => import('@/views/property/withdrawalAudit'),
  //       meta: { title: '提现审核', icon: 'table' }
  //     },

  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
