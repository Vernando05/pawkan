<template>
  <v-btn v-if="isScriptLoaded" @click="clickSignInFacebook" min-width="100%" outlined data-testid="button-signin-facebook">Facebook {{ $t('signIn') }}</v-btn>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend ({
    name: 'SignInFacebook',
    data: () => ({
      isScriptLoaded: false as boolean    
    }),
    created () {     
      this.loadScript()
    },
    methods: {
      loginDialog (): void {
        window.FB.login((response) => {
          console.log(response)
         if (response.status === 'connected') {
            alert('logged in')
            window.FB.api('/me', { fields: 'first_name,last_name,email' }, (response) => {
              console.log(response)
            })
          } else {
            alert('dialog unknwon')      
          }
        }, {scope: 'public_profile,email'})
      },
      statusChangeCallback (response: any): void {
        console.log('statusChangeCallback')
        console.log(response)
        if (response.status === 'connected') {
          alert('logged in')
        } else {
          this.loginDialog()      
        }
      },
      clickSignInFacebook (): void {
        window.FB.getLoginStatus((response) => {
          console.log(response)
          this.statusChangeCallback(response)
        })      
      },
      fbAsyncInit (): void {
        window.FB.init({
          appId      : '4204215259648993',
          cookie     : true,
          xfbml      : false,
          version    : 'v8.0'
        })        
        window.FB.AppEvents.logPageView()         
      }, 
      loadFacebook () {
        this.fbAsyncInit()
        this.isScriptLoaded = true
      },    
      loadScript (): void {
        const tag = document.createElement('script')       
        tag.src = 'https://connect.facebook.net/en_US/sdk.js'
        tag.id = 'facebook-jssdk'
        tag.async = true
        tag.defer = true
        tag.onload = this.loadFacebook
        if (document.getElementsByTagName('script').length) {
          const firstScriptTag = document.getElementsByTagName('script')[0]
          firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
        }        
      }
    }
  })
</script>
