import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
// 引入第三方登入
import { checkThirdPartyLogin } from '../utils/auth-third-party'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: () => import('./../pages/Index.vue'),
      children: [
        {
          path: '',
          component: () => import('./../pages/Home.vue'),
        },
        {
          path: 'settings',
          component: () => import('./../pages/Settings.vue')
        },
        {
          path: ':id',
          component: () => import('./../pages/Profile.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('./../pages/Login.vue')
    }
  ]
})

router.beforeEach(async (to) => {
  await checkThirdPartyLogin.google()
  window.location.search = ''
  if (to.name !== 'Login' && !localStorage.getItem("token")) {
    return { name: 'Login', replace: true }
  }
})

export default router