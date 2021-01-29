import Vue from 'vue'
import 'regenerator-runtime/runtime'
import VueApollo, { ApolloProvider } from 'vue-apollo'
import { createApolloClient } from 'vue-cli-plugin-apollo/graphql-client'

// Install the vue plugin
Vue.use(VueApollo)

// Name of the localStorage item
const AUTH_TOKEN = 'apollo-token'

// Http endpoint
const clientStoreFront = {
  httpLinkOptions: {
    uri: process.env.VUE_APP_GRAPHQL_HTTP,
    headers: {
      'X-Shopify-Storefront-Access-Token': process.env.VUE_APP_SHOPIFY_STOREFRONT_ACCESS_TOKEN
    }
  }  
}
const clientMultiPass = {
  httpLinkOptions: {
    uri: process.env.VUE_APP_GRAPHQL_MULTIPASS
  }
}

// Config
const defaultOptions = {    
  // You can use `wss` for secure connection (recommended in production)
  // Use `null` to disable subscriptions
  // LocalStorage token
  tokenName: AUTH_TOKEN,
  // Enable Automatic Query persisting with Apollo Engine
  persisting: false,
  // Use websockets for everything (no HTTP)
  // You need to pass a `wsEndpoint` for this to work
  websocketsOnly: false,
  // Is being rendered on the server?
  ssr: false,

  // Override default apollo link
  // note: don't override httpLink here, specify httpLink options in the
  // httpLinkOptions property of defaultOptions.
  // link: myLink

  // Override default cache
  // cache: myCache

  // Override the way the Authorization header is set
  // getAuth: (tokenName) => ...

  // Additional ApolloClient options
  apollo: {
    fetch: fetch
  },

  // Client local data (see apollo-link-state)
  resolvers: {}
}

// Call this in the Vue app file
export function createProvider (options = {}): ApolloProvider {
  // Create apollo client
  const { apolloClient: apolloClientStoreFront } = createApolloClient({
    ...clientStoreFront,
    ...defaultOptions,
    ...options,
  })
  const { apolloClient: apolloClientMultiPass } = createApolloClient({
    ...clientMultiPass,
    ...defaultOptions,
    ...options,
  })

  // Create vue apollo provider
  const apolloProvider = new VueApollo({
    clients: {
      apolloClientStoreFront,
      apolloClientMultiPass,
    },
    defaultClient: apolloClientStoreFront,
    defaultOptions: {
      $query: {
        fetchPolicy: 'cache-and-network'
      },
    },
    errorHandler (error) {
      // eslint-disable-next-line no-console
      console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message)
    },
  })

  return apolloProvider
}
