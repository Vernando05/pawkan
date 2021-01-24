import Vue from 'vue'
import Vuex from 'vuex'
import ui from './ui.module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ui
  },
  strict: process.env.NODE_ENV !== 'production'
})