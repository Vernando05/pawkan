import Vue from 'vue'
import { CustomerAccessTokenCreateInput, CustomerAccessTokenCreatePayload } from '@/types/shopify-storefront'
import customerAccessTokenCreate from '@/graphql/CustomerAccessTokenCreate.gql'

export default Vue.extend({
  methods: {    
    async signIn_createToken (inputCustomerAccessTokenCreate: CustomerAccessTokenCreateInput): Promise<CustomerAccessTokenCreatePayload> {
      try {
        const result = await this.$apollo.mutate({
          mutation: customerAccessTokenCreate,
          variables: {
            inputCustomerAccessTokenCreate: inputCustomerAccessTokenCreate
          }
        })        
        return result.data.customerAccessTokenCreate
      } catch (error) {
        console.log(error)
        alert(error)
        return error
      }
    }
  }
})