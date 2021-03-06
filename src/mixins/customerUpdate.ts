import Vue from 'vue'
import { CustomerUpdatePayload } from '@/types/shopify-storefront'
import { CustomerInput } from '@/types'
import customerUpdate from '@/graphql/CustomerUpdate.gql'

export default Vue.extend({
  methods: {
    async customer_update (customerAccessToken: string, customer: CustomerInput): Promise<CustomerUpdatePayload> {
      try {
        const result = await this.$apollo.mutate({
          mutation: customerUpdate,
          variables: {
            customerAccessToken: customerAccessToken,      
            customer: {
              ...customer             
            }
          }
        })          
        return result.data.customerUpdate
      } catch(error) {
        console.log(error)
        alert(error)
        return error
      }
    }
  }
})