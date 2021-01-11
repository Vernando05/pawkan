import { ActionContext } from 'vuex'
import { LanguageState, RootState } from '@/types'
import { SET_LOCALE } from './mutations.type'
import { SET_CURRENT_LANGUAGE } from './actions.type'
import i18n, { selectedLocale } from '@/plugins/i18n'
import clientStorage from '@/plugins/vue-cookies'

const state: LanguageState = {
  language: selectedLocale
}

const getters = {
  currentLanguage (): string {
    return state.language
  }
}

const mutations = {
  [SET_LOCALE](state: LanguageState, lang: string): void {
    i18n.locale = lang
    state.language = lang
  }
}

const actions = {
  [SET_CURRENT_LANGUAGE](context: ActionContext<LanguageState, RootState>, lang: string): void {
    context.commit(SET_LOCALE, lang)
    clientStorage.removeItem('language')
    clientStorage.setItem('language', lang)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}