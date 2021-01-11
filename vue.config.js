/* eslint @typescript-eslint/no-var-requires: "off" */
module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    https: true,
    host: process.env.NODE_ENV !== 'production' ? 'pawkan.local' : 'localhost',
    port: '8081',
    key: require('fs').readFileSync('./server.key'),
    cert: require('fs').readFileSync('./server.crt')
  },
  pages: {
    index: {
      entry: 'src/main.ts',
      title: 'Pawkan'
    }
  },
  parallel: process.env.PARALLEL === 'true',
  pwa: {
    name: 'Pawkan',
    themeColor: '#D49895',
    msTileColor: '#5E4262',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    assetsVersion: '1',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/sw/service-worker.js'
    },
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/msapplication-icon-144x144.png'
    }
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    },
    apollo: {
      lintGQL: false
    }
  },
  chainWebpack: config => {
    config.module
      .rule('graphql')
      .test(/\.graphql$/)
      .use('graphql-tag/loader')
        .loader('graphql-tag/loader')
        .end()
  },
  productionSourceMap: false
}
