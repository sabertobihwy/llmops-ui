import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/views/layouts/DefaultLayout.vue'
import BlankLayout from '@/views/layouts/BlankLayout.vue'
import { isLogin } from '@/utils/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          redirect: 'home',
        },
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/pages/HomeView.vue'),
        },
        {
          path: 'space/app',
          name: 'space-apps-list',
          component: () => import('@/views/space/apps/ListView.vue'),
        },
      ],
    },
    {
      path: '/',
      component: BlankLayout,
      children: [
        {
          path: 'auth/login',
          name: 'auth-login',
          component: () => import('@/views/auth/LoginView.vue'),
        },
        {
          path: 'space/app/:api_key',
          name: 'space-apps-detail',
          component: () => import('@/views/space/apps/DetailView.vue'),
        },
      ],
    },
  ],
})

// todo: router guards logic
router.beforeEach((to, from) => {
  if (!isLogin() && to.name != 'auth-login') {
    return { path: '/auth/login' } // redirect to
  }
  console.log('to:', to)
  console.log('from:', from)
})
export default router
