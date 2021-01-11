import Vue from 'vue'
import { CustomerUserError, CustomerUpdatePayload } from 'shopify-storefront-api-typings'
import { CustomerInput } from '@/types'
import customerUpdate from '@/graphql/CustomerUpdate.gql'

export default Vue.extend({
  data: () => ({
    errorMessages: [] as CustomerUserError[]
  }),
  methods: {
    async customer_update (customerAccessToken: string, customer: CustomerInput): Promise<CustomerUpdatePayload> {
      this.errorMessages = []
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