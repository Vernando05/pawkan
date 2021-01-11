import Vue from 'vue'
import clientStorage from '@/plugins/vue-cookies'

export default Vue.extend({
  methods: {
    clientStorageResetToken_reset (accessToken: string) {
      clientStorage.removeItem('customerAccessToken')
      clientStorage.removeItem('customerAccessTokenExpiresAt')
      clientStorage.setItem('customerAccessToken', accessToken )
      clientStorage.setItem('customerAccessTokenExpiresAt', accessToken )
    }   
  }
})