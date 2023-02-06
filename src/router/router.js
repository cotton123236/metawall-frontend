import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
// 引入第三方登入
import { checkThirdPartyLogin } from '../utils/auth-third-party'

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior(to, from, savedPosition) {
    return {
      top: 0,
      // behavior: 'smooth'
    }
  },
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
      component: () => import('./../pages/Login.vue'),
      beforeEnter: async () => {
        const urlParams = new URLSearchParams(window.location.search)
        if (urlParams.get('from') === 'google') {
          await checkThirdPartyLogin.google()
          window.location.search = ''
          window.location.replace(`${window.location.origin}${window.location.pathname}`)
        }
      }
    }
  ]
})

router.beforeEach(async (to) => {
  if (to.name !== 'Login' && !localStorage.getItem("token")) {
    return { name: 'Login', replace: true }
  }
})

export default router