<template>
  <div>
    <v-row>
      <v-col cols="12">
        <p v-if="customer">Hi {{ customer.firstName }}</p>
        <p v-else>Hi there!</p>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { mapGetters } from 'vuex'
  import customer from '@/graphql/Customer.gql'

  export default Vue.extend({
    name: 'Home',
    data () {
      return {}
    },
    computed: {
      ...mapGetters([
        'customerAccessToken'
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
    }
  })
</script>
