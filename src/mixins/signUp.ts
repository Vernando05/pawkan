import Vue from 'vue'
import { CustomerAccessTokenCreateInput, CustomerCreateInput, CustomerCreatePayload } from '@/types/shopify-storefront'
import customerCreate from '@/graphql/CustomerCreate.gql'

export default Vue.extend({
  methods: {
    async signUp_createUser (inputCustomerCreate: CustomerCreateInput, inputCustomerAccessTokenCreate: CustomerAccessTokenCreateInput): Promise<CustomerCreatePayload> {
      try {
        const result = await this.$apollo.mutate({
          mutation: customerCreate,
          variables: {
            inputCustomerCreate: inputCustomerCreate,
            inputCustomerAccessTokenCreate: inputCustomerAccessTokenCreate
          }
        })          
        return result.data.customerCreate
      } catch(error) {
        console.log(error)
        alert(error)
        return error
      }
    }
  }
})