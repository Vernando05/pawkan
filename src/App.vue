<template>
  <v-app>
    <v-app-bar
      color="primary"
      :src="$route.meta.showBackButton ? '' : 'https://source.unsplash.com/9SWHIgu8A8k/300x200'"
      scroll-target="#mainContent"
      app
      light
      hide-on-scroll
      flat
    >
      <div class="d-flex align-center w-100">
        <v-fade-transition mode="out-in">
          <v-btn :key="$route.path" v-if="$route.meta.showBackButton" @click="goPrev" class="ml-n4" icon>
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-fade-transition>
        <v-fade-transition mode="out-in">
          <p :key="$route.path" v-if="$route.meta.showPageTitle" class="mb-0 title" data-page-title>{{ $route.meta.showPageTitle }}</p>
        </v-fade-transition>
        <v-text-field
          :key="$route.path"         
          v-if="!$route.meta.showBackButton"            
          solo
          dense
          prepend-inner-icon="mdi-magnify"
          hide-details="true"
          placeholder="cat food"
        ></v-text-field>
      </div>
      <!-- <v-spacer></v-spacer> -->
      <!-- <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn
            color="primary"
            dark
            v-on="on"
          >
            {{ currentLang }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in langList"
            :key="index"
            @click="clickLang(item.value)"
          >
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu> -->
    </v-app-bar>
    <v-main id="mainContent">
      <v-container fluid>
        <Container />
      </v-container>
    </v-main>
    <v-footer app>
    </v-footer>
    <v-bottom-navigation
      :value="activeBottomBarBtn"
      color="accent"
      app
      grow
    >
      <v-btn :to="{ name: 'Home' }" class="px-2 mb-0">
        <span>{{ $t('home') }}</span>
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn class="px-2">
        <span>{{ $t('category') }}</span>
        <v-icon>mdi-format-list-bulleted</v-icon>
      </v-btn>
      <v-btn class="px-2">
        <span>{{ $t('updates') }}</span>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <v-btn class="px-2">
        <span>{{ $t('cart') }}</span>
        <v-icon>mdi-cart</v-icon>
      </v-btn>
      <v-btn :to="{ name: 'Account' }" class="px-2">
        <span>{{ $t('account') }}</span>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'
import clientStorage from '@/plugins/vue-cookies'
import { Language } from '@/types'
import find from 'lodash/find'
import Container from '@/views/Container.vue'
import customer from '@/graphql/Customer.gql'

export default Vue.extend({
  name: 'App',
  components: {
    Container
  },
  metaInfo () {
    return {
      title: this.$t('home'),
      titleTemplate: '%s | Pawkan - Your best pet care'      
    }    
  },
  data () {
    return {
      langList: [{
        text: 'English',
        value: 'en'
      }, {
        text: 'Bahasa',
        value: 'id'
      }] as Language[],
      activeBottomBarBtn: 0 as number
    }
  },
  computed: {
    ...mapGetters([
      'customerAccessToken'
    ]),
    currentLang (): string  { 
      const lang: Language | undefined = find(this.langList, { value: this.$root.$i18n.locale }) as Language | undefined
      if (lang) {
        return lang.text
      } else {
        return this.$root.$i18n.locale
      }
    }
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
  created () {
    const customerAccessToken = clientStorage.getItem('customerAccessToken')
    if (customerAccessToken) {
      this.setCustomerAccessToken(customerAccessToken)
    }
  },
  methods: {
    ...mapMutations([
      'setCustomerAccessToken'
    ]),
    clickLang (lang: string): void {
      this.$root.$i18n.locale = lang
    },
    goPrev () {
      this.$router.go(-1)
    }
  }
})
</script>
