import Vue from 'vue'
import { CustomerAccessTokenDeletePayload } from '@/types/shopify-storefront'
import customerAccessTokenDelete from '@/graphql/CustomerAccessTokenDelete.gql'

export default Vue.extend({
  methods: {
    async signOut_deleteToken (customerAccessToken: string): Promise<CustomerAccessTokenDeletePayload> {
      try {
        const result = await this.$apollo.mutate({
          mutation: customerAccessTokenDelete,
          variables: {
            customerAccessToken: customerAccessToken
          }
        })
        return result.data.customerAccessTokenDelete
      } catch (error) {
        console.log(error)
        alert(error)
        return error
      }
    }
  }
})