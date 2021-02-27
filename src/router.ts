import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'

import routes from 'vue-auto-routing'

import { createRouterLayout } from 'vue-router-layout'

// Create <RouterLayout> component.
const RouterLayout = createRouterLayout((layout) => {
  // Resolves a layout component with layout type string.
  return import('@/layouts/' + layout + '.vue')
})

const router = createRouter({
  history: process.env.IS_ELECTRON
    ? createWebHashHistory()
    : createWebHistory(process.env.BASE_URL),
  routes: [{ path: '/', component: RouterLayout, children: routes }],
})

// router.beforeEach((to, from, next) => {
//   if (!localStorage.getItem('userId')) {
//     return next({
//       path: '/login',
//       query: { redirect: to.fullPath },
//     })
//   }
//   return next(to)
// })

export default router
