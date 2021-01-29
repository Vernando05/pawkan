import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from '@/store'
import { loadLanguageAsync } from '@/plugins/i18n'
import Container from '../views/Container.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/', redirect: () => `/${process.env.VUE_APP_I18N_LOCALE}`
  },
  {
    path: '/:lang?',
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
      },
      {
        path: 'account/edit',
        name: 'AccountEdit',
        component: () => import('../views/AccountEdit.vue'),
        meta: {
          showBackButton: true,
          showPageTitle: 'Edit account'
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
  const route = { 
    fullPath: from.fullPath,
    hash: from.hash,
    meta: from.meta,
    name: from.name || 'Home',
    params: from.name ? from.params : { lang: 'en' },
    path: from.path,
    query: from.query
  }
  store.commit('setPrevNav', route)
  to.params.lang = to.params.lang ? to.params.lang : process.env.VUE_APP_I18N_LOCALE as string
  const lang = to.params.lang
  const languageCode = /^[a-zA-Z]{2}(?:-[a-zA-Z]{2}){0,2}$/
  if (languageCode.test(to.params.lang)) {
    loadLanguageAsync(lang).then((lang) => {
      if (lang === 'locale_not_available') {
        next({ path: `${to.path.replace(/[a-zA-Z]{2}(?:-[a-zA-Z]{2}){0,2}/, process.env.VUE_APP_I18N_LOCALE as string)}` })
      } else {
        if (languageCode.test(to.path.split('/')[1])) {
          next()  
        } else {
          next({ path: `/${lang}${to.path}` })
        }
      }
    })    
  } else {
    next({ path: `/${process.env.VUE_APP_I18N_LOCALE}${to.path}` })
  }
})

export default router
