<template>
  <div>
    <FormProfile v-if="customer" ref="formProfile" :formData="customer" :submit="submit" :error="errorMessages" :fieldHide="fieldHide" class="mb-4"/>
    <a href="#" @click.prevent="toggleChangePassword">{{ isChangePasswordShowed ? $t('cancel_change_password') : $t('change_password') }}</a>
    <v-snackbar v-model="isSnackbarShowed" timeout="-1" rounded="pill" right bottom>
      {{ textSnackbar }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="isSnackbarShowed = false">{{ $t('close') }}</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">  
  import mixins from 'vue-typed-mixins'
  import { mapGetters, mapMutations } from 'vuex'
  import FormProfile from '@/components/FormProfile.vue'
  import customerUpdate from '@/mixins/customerUpdate'
  import toggleSnackbar from '@/mixins/toggleSnackbar'
  import signIn from '@/mixins/signIn'
  import clientStorageResetToken from '@/mixins/clientStorageResetToken'
  import customer from '@/graphql/Customer.gql'
  import { CustomerUserError } from '@/types/shopify-storefront'
  import { CustomerInput } from '@/types'

  export default mixins(customerUpdate, signIn, clientStorageResetToken, toggleSnackbar).extend({
    name: 'AccountProfileEdit',
    components: {
      FormProfile
    },
    metaInfo () {
      return {
        title: this.$t('profile'),
        titleTemplate: '%s | Pawkan - Your best pet care'      
      }    
    },
    data: () => ({
      errorMessages: [] as CustomerUserError[],
      isChangePasswordShowed: false as boolean,
      fieldHide: ['password', 'confirmPassword'] as Array<string>
    }),
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
        'setCustomerAccessToken',
        'removeCustomerAccessToken'
      ]),
      async submit (inputCustomerUpdate: CustomerInput): Promise<void> {    
        this.toggleSnackbar(true, this.$i18n.t('saving') + '...', -1)
        const result = await this.customer_update(this.customerAccessToken, inputCustomerUpdate)
        if (result.customerUserErrors.length) {
          this.toggleSnackbar(true, this.$i18n.t('oops_something_is_not_right') + '...')
          this.errorMessages = result.customerUserErrors
        } else {
          if (result.customerAccessToken) {
            this.setCustomerAccessToken(result.customerAccessToken.accessToken)
            this.clientStorageResetToken_reset(result.customerAccessToken.accessToken)
            this.toggleSnackbar(true, this.$i18n.t('updated') + '!')
          }
        }       
      },
      toggleChangePassword () {
        this.isChangePasswordShowed = !this.isChangePasswordShowed
        if (this.isChangePasswordShowed) {
          this.fieldHide = []
        } else {
          this.fieldHide = ['password', 'confirmPassword']
        }
      }      
    }
  })
</script>
