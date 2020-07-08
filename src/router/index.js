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
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '权限管理', icon: 'el-icon-user-solid' }
    }]
  },
  {
    path: '/cardistribution',
    name: 'Cardistribution',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/cardistribution/index'),
        meta: { title: '车辆分配', icon: 'el-icon-s-help' }
      }
    ]
  },

  {
    path: '/vehiclesonline',
    name: 'Vehiclesonline',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/vehiclesonline/index'),
        meta: { title: '车辆上线', icon: 'el-icon-truck' }
      }
    ]
  },

  {
    path: '/terminalmanagement',
    component: Layout,
    redirect: '/terminalmanagement/information',
    name: 'TerminalManagement',
    meta: {
      title: '终端管理',
      icon: 'nested'
    },
    children: [
      {
        path: 'information',
        name: 'Information',
        component: () => import('@/views/terminalmanagement/information/index'), // Parent router-view
        meta: { title: '终端信息' },
      },
      {
        path: 'trackview',
        component: () => import('@/views/terminalmanagement/trackview/index'), // Parent router-view
        name: 'Trackview',
        meta: { title: '轨迹查看' },
      },
      {
        path: 'associated',
        component: () => import('@/views/terminalmanagement/information/associatedDIalog'), // Parent router-view
        name: 'Associated',
        meta:{title:"关联"},
        hidden:true
      },

      // 404 page must be placed at the end !!!
      { path: '*', redirect: '/404', hidden: true }
    ]
  }]

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
