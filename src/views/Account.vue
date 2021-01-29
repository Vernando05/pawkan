<template>
  <div>
    <v-row v-if="!customerAccessToken" justify="center">
      <v-col>
        <SignInProvider :customer="customer" class="mb-2" />
      </v-col>    
    </v-row>
    <v-list shaped>
      <v-list-item-group color="primary">
        <v-list-item v-if="customerAccessToken" :to="{ name: 'AccountEdit' }">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('profile') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="customerAccessToken" @click="destroyAccessToken">
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('signOut') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script lang="ts">  
  import mixins from 'vue-typed-mixins'
  import SignInProvider from '@/components/SignInProvider.vue'
  import { mapGetters, mapMutations } from 'vuex'
  import signOut from '@/mixins/signOut'
  import { UserError } from '@/types/shopify-storefront'
  import customer from '@/graphql/Customer.gql'

  export default mixins(signOut).extend({
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
    computed: {
      ...mapGetters([
        'customerAccessToken',
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
      async destroyAccessToken (): Promise<void> {
        const result = await this.signOut_deleteToken(this.customerAccessToken)
        const { userErrors }: { userErrors: UserError[] } = result
        if (userErrors.length) {
          console.log(userErrors)
        } else {
          this.removeCustomerAccessToken()
        }
      }
    }
  })
</script>
