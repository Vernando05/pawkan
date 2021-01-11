import VueI18n, { Path, Values, Locale } from 'vue-i18n/types'

declare module 'vue-i18n/types' {
  export default class VueI18n {
    t(key: Path, locale: Locale, values?: Values): string;
    t(key: Path, values?: Values): string;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    t: typeof VueI18n.prototype.t;
  }

  interface VueConstructor<V extends Vue = Vue> {
    i18n: typeof VueI18n.prototype;
    t: typeof VueI18n.prototype.t;
  }
}

export { }
