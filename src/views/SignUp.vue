<template>
  <div>
    <div v-if="errorMessages.length">
      <v-alert :key="index" v-for="(el, index) in errorMessages" type="error">{{ el.message }}</v-alert>
    </div>
    <ValidationObserver ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="submit">
        <ValidationProvider v-slot="{ errors }" :name="textCapitalize($t('firstName'))" rules="required|max:30">
          <v-text-field
            v-model="firstName"
            :counter="30"
            :error-messages="errors"
            :label="$t('firstName')"
            required
          ></v-text-field>
        </ValidationProvider>
        <ValidationProvider v-slot="{ errors }" :name="textCapitalize($t('lastName'))" rules="max:30">
          <v-text-field
            v-model="lastName"
            :counter="30"
            :error-messages="errors"
            :label="$t('lastName')"
            required
          ></v-text-field>
        </ValidationProvider>
        <ValidationProvider v-slot="{ errors }" :name="$t('email')" rules="required|email">
          <v-text-field
            v-model="email"
            :error-messages="errors"
            :label="$t('email')"
            required
          ></v-text-field>
        </ValidationProvider>
        <TelephoneInput 
          v-model="mobilePhone"
          @validate="isTelValid"
          :label="$t('mobile')"
          :preferredCountries="['id']"
          :dynamicPlaceholder="true" />
        <ValidationProvider v-slot="{ errors }" :name="$t('password')" rules="required|min:6|max:10" vid="confirmation">
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
        <ValidationProvider v-slot="{ errors }" :name="textCapitalize($t('confirmPassword'))" rules="required|confirmed:confirmation">
          <v-text-field
            v-model="confirmPassword"
            :counter="10"
            :error-messages="errors"
            :label="textCapitalize($t('confirmPassword'))"
            type="password"
            autocomplete
            required
          ></v-text-field>
        </ValidationProvider>
        <ValidationProvider v-slot="{ errors }" name="acceptsMarketing">
          <v-checkbox
            v-model="acceptsMarketing"
            :error-messages="errors"
            :label="$t('receiveNewsletterAndUpdates')"
            type="checkbox"
            required
          ></v-checkbox>
        </ValidationProvider>
        <v-btn :disabled="invalid || !isMobileNumberValid" class="mr-4" type="submit">{{ $t('submit') }}</v-btn>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
  import mixins from 'vue-typed-mixins'  
  import { mapGetters, mapMutations } from 'vuex'
  import i18n from '@/plugins/i18n'
  import { required, email, min, max, confirmed } from 'vee-validate/dist/rules'
  import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
  import TelephoneInput from '@/components/TelephoneInput.vue'
  import startCase from 'lodash/startCase'
  import signUp from '@/mixins/signUp'
  import signIn from '@/mixins/signIn'
  import clientStorageResetToken from '@/mixins/clientStorageResetToken'

  setInteractionMode('eager')
  
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

  extend('confirmed', {
    ...confirmed,
    message: i18n.t('typedPasswordMustBeSame'),
  })

  export default mixins(signUp, signIn, clientStorageResetToken).extend ({
    name: 'SignUp',
    components: {
      ValidationProvider,
      ValidationObserver,
      TelephoneInput
    },
    metaInfo () {
      return {
        title: this.$t('signUp'),
        titleTemplate: '%s | Pawkan - Your best pet care'      
      }    
    },
    data: () => ({      
      confirmPassword: '' as string,        
      isMobileNumberValid: false as boolean      
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
      isTelValid (isValid: boolean): void {
        this.isMobileNumberValid = isValid
      },
      async submit (): Promise<void> {
        const isValid = await (this.$refs.observer as InstanceType<typeof ValidationProvider>).validate()
        if (isValid) {
          const result = await this.signUp_createUser()          
          if (result.customerUserErrors.length) {
            this.errorMessages = result.customerUserErrors
          } else {
            const result = await this.signIn_createToken()                    
            if (result.customerUserErrors.length) {
              this.errorMessages = result.customerUserErrors
            } else
            if (result.customerAccessToken) {
              this.firstName = '' 
              this.lastName = ''
              this.email = ''
              this.mobilePhone = ''
              this.password = ''
              this.confirmPassword = ''
              this.acceptsMarketing = false
              this.isMobileNumberValid = false;
              (this.$refs.observer as InstanceType<typeof ValidationProvider>).reset()
              this.setCustomerAccessToken(result.customerAccessToken.accessToken)
              this.clientStorageResetToken_reset(result.customerAccessToken.accessToken)    
              this.$router.push(this.prevNav)
            }        
          }
        }        
      }
    }
  })
</script>