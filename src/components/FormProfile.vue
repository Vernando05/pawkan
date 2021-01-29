<template>
  <div>
    <div v-if="error.length">
      <v-alert :key="index" v-for="(el, index) in error" type="error">{{ el.message }}</v-alert>
    </div>
    <ValidationObserver ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="submitForm">
        <ValidationProvider v-if="!isFieldHide('firstName')" v-slot="{ errors }" name="firstName" rules="required|max:30">
          <v-text-field
            v-model="firstName"
            :counter="30"
            :error-messages="errors"
            :label="$t('firstName')"
            required
          ></v-text-field>
        </ValidationProvider>
        <ValidationProvider v-if="!isFieldHide('lastName')" v-slot="{ errors }" name="lastName" rules="max:30">
          <v-text-field
            v-model="lastName"
            :counter="30"
            :error-messages="errors"
            :label="$t('lastName')"
            required
          ></v-text-field>
        </ValidationProvider>
        <ValidationProvider v-if="!isFieldHide('email')" v-slot="{ errors }" name="email" rules="required|email">
          <v-text-field
            v-model="email"
            :error-messages="errors"
            :label="$t('email')"
            required
          ></v-text-field>
        </ValidationProvider>
        <TelephoneInput
          v-if="!isFieldHide('telephone')"
          v-model="mobilePhone"
          :value="mobilePhone"
          @validate="isTelValid"
          :label="$t('mobile')"
          :preferredCountries="['id']"
          :dynamicPlaceholder="true" />
        <ValidationProvider v-if="!isFieldHide('password')" v-slot="{ errors }" name="password" rules="required|min:6|max:10" vid="confirmation">
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
        <ValidationProvider v-if="!isFieldHide('confirmPassword')" v-slot="{ errors }" name="confirmPassword" rules="required|confirmed:confirmation">
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
        <ValidationProvider v-if="!isFieldHide('acceptsMarketing')" v-slot="{ errors }" name="acceptsMarketing">
          <v-checkbox
            v-model="acceptsMarketing"
            :error-messages="errors"
            :label="$t('receiveNewsletterAndUpdates')"
            type="checkbox"
          ></v-checkbox>
        </ValidationProvider>
        <v-btn :disabled="invalid || !isMobileNumberValid" class="mr-4" type="submit">{{ $t('submit') }}</v-btn>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
  import mixins from 'vue-typed-mixins'
  import { i18n } from '@/plugins/i18n'
  import { required, email, min, max, confirmed } from 'vee-validate/dist/rules'
  import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
  import TelephoneInput from '@/components/TelephoneInput.vue'
  import startCase from 'lodash/startCase'
  import isEmpty from 'lodash/isEmpty'
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
    name: 'FormProfile',
    components: {
      ValidationProvider,
      ValidationObserver,
      TelephoneInput
    },
    props: {
      formData: { type: Object, required: false },
      error: { type: Array, required: false, default: () => [] },
      submit: { type: Function, required: true },
      fieldHide: { type: Array, required: false, default: () => [] }
    },
    data: () => ({
      firstName: '' as string,
      lastName: '' as string,
      email: '' as string,
      password: '' as string,
      mobilePhone: '' as string,    
      acceptsMarketing: false as boolean,    
      confirmPassword: '' as string,
      isMobileNumberValid: false as boolean
    }),
    created () {
      if (!isEmpty(this.formData)) {
        this.firstName = this.formData.firstName || ''
        this.lastName = this.formData.lastName || ''
        this.email = this.formData.email || ''
        this.mobilePhone = this.formData.phone || ''
        this.acceptsMarketing = this.formData.acceptsMarketing || false    
      }
    },
    methods: {
      textCapitalize (text: string): string {
        return startCase(text)
      },
      isFieldHide (name: string): boolean {
        return this.fieldHide.indexOf(name) > -1
      },
      isTelValid (isValid: boolean): void {
        this.isMobileNumberValid = isValid
      },
      async submitForm (): Promise<void> {
        const isValid = await (this.$refs.observer as InstanceType<typeof ValidationProvider>).validate()
        if (isValid) {
          this.submit({
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
            phone: this.mobilePhone,    
            acceptsMarketing: this.acceptsMarketing
          })
        }
      },
      reset (): void {
        this.firstName = '' 
        this.lastName = ''
        this.email = ''
        this.mobilePhone = ''
        this.password = ''
        this.confirmPassword = ''
        this.acceptsMarketing = false
        this.isMobileNumberValid = false;
        (this.$refs.observer as InstanceType<typeof ValidationProvider>).reset()
      }
    }
  })
</script>
