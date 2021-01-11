import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from '@/store'
import { languages } from '@/plugins/i18n'
import Container from '../views/Container.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'root'
  },
  {
    path: '/:lang',
    component: Container,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue')
      },
      {
        path: 'signup',
        name: 'SignUp',
        component: () => import('../views/SignUp.vue'),
        meta: {
          showBackButton: true,
          showPageTitle: 'Sign Up'
        }
      },
      {
        path: 'signin',
        name: 'SignIn',
        component: () => import('../views/SignIn.vue'),
        meta: {
          showBackButton: true,
          showPageTitle: 'Sign In'
        }
      },
      {
        path: 'account',
        name: 'Account',
        component: () => import('../views/Account.vue'),
        meta: {
          showBackButton: true,
          showPageTitle: 'Account'
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  console.log(from)
  const route = { 
    fullPath: from.fullPath,
    hash: from.hash,
    meta: from.meta,
    name: from.name || 'Home',
    params: from.params,
    path: from.path,
    query: from.query
  }
  store.commit('setPrevNav', route)
  const lang = to.params.lang
  if (/^[a-zA-Z]{2}(?:-[a-zA-Z]{2}){0,2}$/.test(to.params.lang)) {
    if (languages.includes(lang)) {
      if (store.getters.currentLanguage !== lang) {
        store.dispatch('setCurrentLanguage', lang)
      }
      return next()
    } else {
      return next({ path: store.getters.currentLanguage })
    }
  } else {
    return next({ path: store.getters.currentLanguage + to.path })
  }
})

export default router
