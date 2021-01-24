import Vue from 'vue'
import VueI18n, { LocaleMessages } from 'vue-i18n'
import requireContext from 'require-context.macro'

Vue.use(VueI18n)

const loadedLanguages = [process.env.VUE_APP_I18N_LOCALE]

function loadLocaleMessages (): LocaleMessages {
  const locales = requireContext('../locales', true, /en\.json$/i)
  const messages: LocaleMessages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

export const i18n = new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || process.env.VUE_APP_I18N_LOCALE,
  messages: loadLocaleMessages()
})

function setI18nLanguage (lang: string): string {
  i18n.locale = lang
  // axios.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html')?.setAttribute('lang', lang)
  return lang
}

export function loadLanguageAsync (lang: string): Promise<string> {
  if (i18n.locale === lang) {
    return Promise.resolve(setI18nLanguage(lang))
  }
  if (loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang))
  }

  return import(/* webpackChunkName: "lang-[request]" */ `@/locales/${lang}.json`).then(
    messages => {
      console.log(messages)
      i18n.setLocaleMessage(lang, messages.default)
      loadedLanguages.push(lang)
      return setI18nLanguage(lang)
    }
  ).catch(err => {
    console.log(err)
    return 'locale_not_available'
  })
}