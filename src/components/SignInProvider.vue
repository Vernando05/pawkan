<template>
  <div>
    <div id="firebaseui-auth-container"></div>
    <div id="loader" class="text-center" v-show="isLoading">Loading...</div>
    <div v-show="!isLoading" class="text-center">
      <v-btn class="text-normal mb-4 elevation-3 justify-start" :to="{ name: 'SignIn', params: { lang: 'en' } }" width="220px" color="main" data-testid="button-signin"><v-icon class="mr-3">mdi-email</v-icon>{{ $t('signInWithEmail') }}</v-btn>
      <v-btn class="text-normal elevation-3 justify-start" :to="{ name: 'SignUp', params: { lang: currentLanguage } }" width="220px" color="accent" depressed><v-icon class="mr-3">mdi-clipboard-account</v-icon>{{ $t('signUp') }}</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
  import mixins from 'vue-typed-mixins'
  import { mapGetters, mapMutations } from 'vuex'
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import * as firebaseui from 'firebaseui'
  import signInMultipass from '@/mixins/signInMultipass'
  import customerUpdate from '@/mixins/customerUpdate'
  import clientStorageResetToken from '@/mixins/clientStorageResetToken'
  import 'firebaseui/dist/firebaseui.css'
  import { CustomerInput } from '@/types'

  export default mixins(signInMultipass, customerUpdate, clientStorageResetToken).extend ({
    name: 'SignInProvider',
    data: () => ({
      ui: null,
      isLoading: true as boolean,
      user: {} as CustomerInput
    }),
    computed: {
      ...mapGetters([
        'customerAccessToken',
        'currentLanguage',
        'prevNav'
      ])
    },
    created () {
      this.initFirebase()
    },
    mounted () {
      this.initAuth()
    },
    methods: {
      ...mapMutations([
        'setCustomerAccessToken'
      ]),
      initFirebase (): void {
         if (!firebase.apps.length) {
          const firebaseConfig = {
            apiKey: 'AIzaSyBPSGHC3CO4LUrTODSRkFQo_PO0OR-0V7M',
            authDomain: 'pawkan-47fca.web.app'
          }
          firebase.initializeApp(firebaseConfig)          
        }
      },
      initAuth (): void {
        firebase.auth().setPersistence(process.env.NODE_ENV === 'test' ? firebase.auth.Auth.Persistence.NONE : firebase.auth.Auth.Persistence.LOCAL).then(() => {
          const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth())
          console.log(ui.isPendingRedirect())
          if (!ui.isPendingRedirect()) {
            ui.start('#firebaseui-auth-container', {
              callbacks: {
                signInSuccessWithAuthResult: (authResult) => {
                  console.log(authResult)
                  const profile = authResult.additionalUserInfo.profile
                  this.user = { firstName: profile.given_name, lastName: profile.family_name, email: profile.email }
                  this.signInWithMultipassToken(this.user)               
                  return false
                },
                uiShown: () => {
                  this.isLoading = false
                }
              },
              credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
              signInFlow: 'popup',
              signInOptions: [
                {
                  provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                  scopes: [
                    'openid',
                    'https://www.googleapis.com/auth/userinfo.email',
                    'https://www.googleapis.com/auth/userinfo.profile'
                  ],
                  customParameters: {
                    prompt: 'select_account'
                  }
                },
                {
                  provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                  scopes: [
                    'public_profile',
                    'email'
                  ]             
                }
              ]
            })
          }        
        })        
      },
      async signInWithMultipassToken (user: CustomerInput): Promise<void> {
        try {
          const { token } = await this.signIn_multipass(user)
          if (token) {
            const result = await this.signIn_accessTokenCreateWithMultipass(token)
            if (result.customerUserErrors.length) {
              this.errorMessages = result.customerUserErrors
            } else
            if (result.customerAccessToken) {
              this.setCustomerAccessToken(result.customerAccessToken.accessToken)
              this.clientStorageResetToken_reset(result.customerAccessToken.accessToken)
              this.customer_update(result.customerAccessToken.accessToken, user)
            }
          } else {
            console.log(token)
            alert(token)
          }        
        } catch (error) {
          console.log(error)
          alert(error)
          return error
        }
      }
    }
  })
</script>
