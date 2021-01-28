import Vue from 'vue'
import { CustomerUserError, CustomerCreatePayload } from '@/types/shopify-storefront'
import customerCreate from '@/graphql/CustomerCreate.gql'

export default Vue.extend({
  data: () => ({
    firstName: '' as string,
    lastName: '' as string,
    email: '' as string,
    password: '' as string,
    mobilePhone: '' as string,    
    acceptsMarketing : false as boolean,    
    errorMessages: [] as CustomerUserError[]
  }),
  methods: {
    async signUp_createUser (): Promise<CustomerCreatePayload> {
      this.errorMessages = []
      try {
        const result = await this.$apollo.mutate({
          mutation: customerCreate,
          variables: {
            inputCustomerCreate: {
              firstName: this.firstName,
              lastName: this.lastName,
              email: this.email,
              phone: this.mobilePhone,
              password: this.password,
              acceptsMarketing: this.acceptsMarketing
            },
            inputCustomerAccessTokenCreate: {
              email: this.email,
              password: this.password
            }
          }
        })          
        return result.data
      } catch(error) {
        console.log(error)
        alert(error)
        return error
      }
    }
  }
})