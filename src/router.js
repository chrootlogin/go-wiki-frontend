import {GlobalComponents, WikiComponents} from './components'
import VueRouter from 'vue-router'
import store from './store/index'

const routes = [
  {
    path: '/register',
    component: GlobalComponents.Register
  },
  {
    path: '/login',
    component: GlobalComponents.Login
  },
  {
    path: '/profile',
    component: GlobalComponents.Profile
  },
  {
    name: 'home',
    path: '/',
    redirect: { name: 'page' }
  },
  {
    name: 'edit',
    path: '/edit',
    component: WikiComponents.CreateEditPage
  },
  {
    name: 'page',
    path: '/wiki/:pageSlug*',
    component: WikiComponents.GetPage,
    props: true
  }
]

const router = new VueRouter({routes})

router.beforeEach((to, from, next) => {
  // Cleanup old notifications
  store.commit('setNotification', {notification: {}})

  next()
})

export default router
