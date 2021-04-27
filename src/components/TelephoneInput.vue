<template>
  <div :ref="telId" class="mstyle mb-2">
    <label v-if="label" :for="telId" class="v-label theme--light d-block mt-5 mb-2">{{ label }}</label>
    <vue-tel-input
      :inputOptions="{ id: telId }"
      v-model="mobilePhone"
      @input="onInput"
      @validate="onValidate"
      @blur="onBlur"
      :preferredCountries="preferredCountries"
      class="mstyle-field"
    ></vue-tel-input>
    <p :class="[errorMessage? '' : 'invisible', 'v-text-field__details caption error--text mb-0']">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { VueTelInput } from 'vue-tel-input'
  import startCase from 'lodash/startCase'
  import 'vue-tel-input/dist/vue-tel-input.css'  
  let telId = 0

  export default Vue.extend ({
    name: 'TelephoneInput',    
    components: {
      VueTelInput
    },
    props: {
      label: { type: String, required: false },
      preferredCountries: { type: Array, required: false },
      value: { type: String, required: false, default: ''}
    },
    data () {
      return {
        telId: '' as string,
        mobilePhone: '' as string,
        isMobileNumberValid: false as boolean,
        isMobilePhoneDirty: false as boolean
      }
    },
    computed: {
      errorMessage (): string {
        if (this.mobilePhone.length && !this.isMobileNumberValid) {
          return this.$t('phoneNumberIsInvalid')
        } else
        if (!this.mobilePhone.length && this.isMobilePhoneDirty) {
          return startCase(this.$t('phoneNumber')) + ' ' + this.$t('cannotBeEmpty').toLowerCase()
        } else {
          return ''
        }
      }
    },
    created () {
      this.telId = 'telInput' + telId.toString()
      telId += 1
      this.mobilePhone = this.value
    },
    methods: {
      onBlur (): void {
        this.isMobilePhoneDirty = true
        if (!this.mobilePhone.length || !this.isMobileNumberValid) {
          (this.$refs[this.telId] as InstanceType<typeof HTMLDivElement>).classList.add('mstyle-field-error')
        } else {
          (this.$refs[this.telId] as InstanceType<typeof HTMLDivElement>).classList.remove('mstyle-field-error')
        }
      },
      onInput (_number: string, { number }: { number: string }): void {
        this.isMobilePhoneDirty = true
        this.mobilePhone = number || ''
        this.$emit('input', number)
      },
      onValidate ({ valid }: { valid: boolean }): void {
        this.isMobileNumberValid = valid
        this.$emit('validate', valid)
      }
    }
  })
</script>

<style lang="scss" scoped>
  ::v-deep ul.vti__dropdown-list {
    padding-left: 0 !important;
  }
</style>
