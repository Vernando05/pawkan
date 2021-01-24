import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { createProvider } from './plugins/vue-apollo'
import { i18n } from './plugins/i18n'
import './plugins/vue-meta'
import './plugins/firebase'
import './styles/index.scss'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  apolloProvider: createProvider(),
  i18n,
  render: h => h(App)
}).$mount('#app')
