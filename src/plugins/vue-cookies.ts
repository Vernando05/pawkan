import Vue from 'vue'
import VueCookies from 'vue-cookies'

Vue.use(VueCookies)

export default {
  setItem(key: string, value: string): void {
    Vue.$cookies.set(key, value)
  },
  removeItem(key: string): void {
    Vue.$cookies.remove(key)
  },
  getItem(key: string): string {
    return Vue.$cookies.get(key)
  },
  isItem(key: string): boolean {
    return Vue.$cookies.isKey(key)
  }
}