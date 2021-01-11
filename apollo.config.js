import 'dotenv/config.js'
import { config } from 'dotenv/lib/main'
config({ path: './.env.local'})

module.exports = {
  client: {
    service: {
      name: 'shopify',
      url: process.env.VUE_APP_GRAPHQL_HTTP,
      headers: {
        'X-Shopify-Storefront-Access-Token': process.env.VUE_APP_SHOPIFY_STOREFRONT_ACCESS_TOKEN
      },
      skipSSLValidation: true
    }
  }
}
