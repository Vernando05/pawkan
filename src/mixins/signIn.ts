import Vue from 'vue'
import { CustomerUserError, CustomerAccessTokenCreatePayload } from 'shopify-storefront-api-typings'
import customerAccessTokenCreate from '@/graphql/CustomerAccessTokenCreate.gql'

export default Vue.extend({
  data: () => ({
    email: '' as string,
    password: '' as string,
    errorMessages: [] as CustomerUserError[]
  }),
  methods: {    
    async signIn_createToken (): Promise<CustomerAccessTokenCreatePayload> {
      this.errorMessages = []
      try {
        const result = await this.$apollo.mutate({
          mutation: customerAccessTokenCreate,
          variables: {
            inputCustomerAccessTokenCreate: {
              email: this.email,
              password: this.password
            }
          }
        })        
        return result.data
      } catch (error) {
        console.log(error)
        alert(error)
        return error
      }
    }
  }
})