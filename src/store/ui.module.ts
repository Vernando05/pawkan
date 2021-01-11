// import { ActionContext } from 'vuex'
import { UiState } from '@/types'
import { 
  SET_PREV_NAV,
  SET_CUSTOMER_ACCESS_TOKEN,
  REMOVE_CUSTOMER_ACCESS_TOKEN
} from './mutations.type'
// import { 
//   SET_LOGOUT
// } from './actions.type'
import { RouteConfig } from 'vue-router'
import clientStorage from '@/plugins/vue-cookies'

const state: UiState = {
  customerAccessToken: '',
  prevNav: {
    path: '/',
    name: 'home'
  }
}

const getters = {
  customerAccessToken (): string {
    return state.customerAccessToken
  },
  prevNav(): RouteConfig {
    return state.prevNav
  }
}

const mutations = {
  [SET_CUSTOMER_ACCESS_TOKEN](state: UiState, customerAccessToken: string): void {
    state.customerAccessToken = customerAccessToken
  },
  [SET_PREV_NAV](state: UiState, prevNav: RouteConfig): void {
    state.prevNav = prevNav
  },
  [REMOVE_CUSTOMER_ACCESS_TOKEN](state: UiState): void {
    state.customerAccessToken = ''
    clientStorage.removeItem('customerAccessToken')
    clientStorage.removeItem('customerAccessTokenExpiresAt')
  }
}

// const actions = {
//   [SET_LOGOUT](context: ActionContext<UiState, RootState>) {
//     context.commit(REMOVE_CUSTOMER_ACCESS_TOKEN)
//     clientStorage.removeItem('accessToken')
//     clientStorage.removeItem('accessTokenExpiresAt')
//   }
// }

export default {
  state,
  mutations,
  getters
}