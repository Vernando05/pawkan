<template>
  <div>
    <FormProfile ref="formProfile" :submit="submit" :error="errorMessages" />
  </div>
</template>

<script lang="ts">
  import store from '@/store'
  import mixins from 'vue-typed-mixins'  
  import { mapGetters, mapMutations } from 'vuex'
  import FormProfile from '@/components/FormProfile.vue'
  import signUp from '@/mixins/signUp'
  import signIn from '@/mixins/signIn'
  import clientStorageResetToken from '@/mixins/clientStorageResetToken'
  import { CustomerCreateInput, CustomerUserError } from '@/types/shopify-storefront'

  export default mixins(signUp, signIn, clientStorageResetToken).extend ({
    name: 'SignUp',
    components: {
      FormProfile
    },
    metaInfo () {
      return {
        title: this.$t('signUp'),
        titleTemplate: '%s | Pawkan - Your best pet care'      
      }    
    },
    data: () => ({
      errorMessages: [] as CustomerUserError[]
    }),
    computed: {
      ...mapGetters([
        'prevNav'
      ])
    },
    methods: {
      ...mapMutations([
        'setCustomerAccessToken'
      ]),
      async submit (inputCustomerCreate: CustomerCreateInput): Promise<void> {
        const { email, password } = inputCustomerCreate
        const inputCustomerAccessTokenCreate =  { email, password }
        const result = await this.signUp_createUser(inputCustomerCreate, inputCustomerAccessTokenCreate)
        if (result.customerUserErrors.length) {
          this.errorMessages = result.customerUserErrors
        } else {
          const result = await this.signIn_createToken(inputCustomerAccessTokenCreate)                    
          if (result.customerUserErrors.length) {
            this.errorMessages = result.customerUserErrors
          } else
          if (result.customerAccessToken) {
            (this.$refs.formProfile as InstanceType<typeof FormProfile>).reset()
            this.setCustomerAccessToken(result.customerAccessToken.accessToken)
            this.clientStorageResetToken_reset(result.customerAccessToken.accessToken)    
            this.$router.push(this.prevNav)
          }
        }       
      }
    },
    beforeRouteEnter (...[, , next]) {
      if (store.getters.customerAccessToken) {
        next({ name: 'Home', params: { lang: 'en' } })
      } else {
        next()
      }
    }
  })
</script>