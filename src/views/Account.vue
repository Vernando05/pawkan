<template>
  <div>
    <v-row v-if="!customerAccessToken" justify="center">
      <v-col>
        <SignInProvider class="mb-2" />
      </v-col>    
    </v-row>
    <v-btn v-else @click="destroyAccessToken" min-width="100%" outlined>{{ $t('signOut') }}</v-btn>
  </div>
</template>

<script lang="ts">  
  import mixins from 'vue-typed-mixins'
  import SignInProvider from '@/components/SignInProvider.vue'
  import { mapGetters, mapMutations } from 'vuex'
  import signIn from '@/mixins/signIn'
  import { UserError } from "shopify-storefront-api-typings"
  import clientStorage from '@/plugins/vue-cookies'
  import { CustomerUserError, CustomerAccessTokenCreatePayload } from 'shopify-storefront-api-typings'
  import customer from '@/graphql/Customer.gql'
  import customerAccessTokenCreateWithMultipass from '@/graphql/CustomerAccessTokenCreateWithMultipass.gql'
  import customerAccessTokenDelete from '@/graphql/CustomerAccessTokenDelete.gql'

  export default mixins(signIn).extend({
    name: 'Account',
    components: {
      SignInProvider
    },
    metaInfo () {
      return {
        title: this.$t('account'),
        titleTemplate: '%s | Pawkan - Your best pet care'      
      }    
    },
    data: () => ({
      errorMessages: [] as CustomerUserError[]      
    }),
    computed: {
      ...mapGetters([
        'customerAccessToken',
        'currentLanguage',
        'prevNav'
      ])
    },
    apollo: {
      customer: {
        query: customer,
        variables () {
          return {
            customerAccessToken: this.customerAccessToken
          }
        }
      }
    },       
    methods: {
      ...mapMutations([
        'removeCustomerAccessToken'
      ]),
      async createUser (): Promise<void> {
        this.errorMessages = []
        try {
          const result = await this.$apollo.mutate({
            mutation: customerAccessTokenCreateWithMultipass,
            variables: {
              multipassToken: ''
            }
          })          
          const { customerAccessTokenCreate: { customerAccessToken, customerUserErrors } }: { customerAccessTokenCreate: CustomerAccessTokenCreatePayload } = result.data
          if (customerUserErrors.length) {
            this.errorMessages = customerUserErrors
          } else
          if (customerAccessToken) {            
            clientStorage.removeItem('customerAccessToken')
            clientStorage.removeItem('customerAccessTokenExpiresAt')
            clientStorage.setItem('customerAccessToken', customerAccessToken.accessToken )
            clientStorage.setItem('customerAccessTokenExpiresAt', customerAccessToken.accessToken )
            this.$router.push(this.prevNav)
          }   
        } catch(error) {
          console.log(error)
          alert(error)
        }
      },
      async destroyAccessToken (): Promise<void> {
        try {
          const result = await this.$apollo.mutate({
            mutation: customerAccessTokenDelete,
            variables: {
              customerAccessToken: this.customerAccessToken
            }
          })
          const { userErrors }: { userErrors: UserError[] } = result.data.customerAccessTokenDelete
          if (userErrors.length) {
            console.log(userErrors)
          } else {
            // this.removeCustomerAccessToken()
          }
        } catch (error) {
          console.log(error)
          alert(error)
        }
      }
    }
  })
</script>
