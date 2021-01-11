import Vue from 'vue'
import Vuex from 'vuex'
import language from './language.module'
import ui from './ui.module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    language,
    ui
  },
  strict: process.env.NODE_ENV !== 'production'
})