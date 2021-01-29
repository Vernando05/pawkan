<template>
  <div>
    <div v-if="errorMessages.length">
      <v-alert :key="index" v-for="(el, index) in errorMessages" type="error">{{ el.message }}</v-alert>
    </div>
    <ValidationObserver ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="submit" role="form">
        <ValidationProvider v-slot="{ errors }" :name="$t('email')" rules="required|email">
          <v-text-field
            v-model="email"
            :error-messages="errors"
            :label="$t('email')"
            required
          ></v-text-field>
        </ValidationProvider>
        <ValidationProvider v-slot="{ errors }" :name="$t('password')" rules="required|min:6|max:10">
          <v-text-field
            v-model="password"
            :counter="10"
            :error-messages="errors"
            :label="$t('password')"
            type="password"
            autocomplete
            required
          ></v-text-field>
        </ValidationProvider>
        <v-btn :disabled="invalid" class="mr-4 mt-4" type="submit">{{ $t('submit') }}</v-btn>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
  import store from '@/store'
  import mixins from 'vue-typed-mixins'
  import { mapGetters, mapMutations } from 'vuex'
  import { i18n } from '@/plugins/i18n'
  import { required, email, min, max } from 'vee-validate/dist/rules'
  import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
  import startCase from 'lodash/startCase'  
  import signIn from '@/mixins/signIn'
  import clientStorageResetToken from '@/mixins/clientStorageResetToken'
  import { CustomerUserError } from '@/types/shopify-storefront'

  setInteractionMode('aggressive')
  
  extend('required', {
    ...required,
    message: '{_field_} ' + i18n.t('cannotBeEmpty').toLowerCase()
  })

  extend('min', {
    ...min,
    message: '{_field_} ' + i18n.t('mustAtLeastHave', ['{length}']).toLowerCase()
  })

  extend('max', {
    ...max,
    message: '{_field_} ' + i18n.t('mayNotBeGreater', ['{length}']).toLowerCase()
  })

  extend('email', {
    ...email,
    message: i18n.t('emailMustBeValid'),
  })

  export default mixins(signIn, clientStorageResetToken).extend({
    name: 'SignIn',
    components: {
      ValidationProvider,
      ValidationObserver
    },
    metaInfo () {
      return {
        title: this.$t('signIn'),
        titleTemplate: '%s | Pawkan - Your best pet care'      
      }    
    },
    data: () => ({
      email: '' as string,
      password: '' as string,
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
      textCapitalize (text: string): string {
        return startCase(text)
      },
      async submit (): Promise<void> {
        const isValid = await (this.$refs.observer as InstanceType<typeof ValidationProvider>).validate()
        if (isValid) {
          const result = await this.signIn_createToken({ email: this.email, password: this.password })
          if (result.customerUserErrors.length) {
            this.errorMessages = result.customerUserErrors
          } else
          if (result.customerAccessToken) {
            this.setCustomerAccessToken(result.customerAccessToken.accessToken)
            this.clientStorageResetToken_reset(result.customerAccessToken.accessToken)            
            this.email = ''
            this.password = '';
            (this.$refs.observer as InstanceType<typeof ValidationProvider>).reset()
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