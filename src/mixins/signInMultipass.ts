import Vue from 'vue'
import { Customer, CustomerAccessTokenCreateWithMultipassPayload, CustomerUserError } from '@/types/shopify-storefront' 
import { CustomerInput } from '@/types'                                                  
import createMultipassToken from '@/graphql/CustomerMultipassTokenCreate.gql'
import customerAccessTokenCreateWithMultipass from '@/graphql/CustomerAccessTokenCreateWithMultipass.gql'

export default Vue.extend({ 
  data: () => ({
    errorMessages: [] as CustomerUserError[]
  }),
  methods: {    
    async signIn_multipass (user: CustomerInput): Promise<Customer> {      
      try {
        const result = await this.$apollo.mutate({
          client: 'apolloClientMultiPass',
          mutation: createMultipassToken,
          variables: {
            data: {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email
            }
          }
        })            
        return result.data.createMultipassToken
      } catch (error) {
        console.log(error)
        alert(error)
        return error
      }
    },
    async signIn_accessTokenCreateWithMultipass (token: string): Promise<CustomerAccessTokenCreateWithMultipassPayload> {
      this.errorMessages = []
      try {
        const result = await this.$apollo.mutate({          
          mutation: customerAccessTokenCreateWithMultipass,
          variables: {
            multipassToken: token
          }
        })        
        return result.data.customerAccessTokenCreateWithMultipass
      } catch (error) {
        console.log(error)
        alert(error)
        return error
      }
    }
  }
})