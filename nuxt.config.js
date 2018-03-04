const nodeExternals = require('webpack-node-externals')
const config = require('./config')
const apiEnv = process.env.API_ENV || 'production'
const {
  BASE_URL: baseApiUrl,
  EVENTS_API_BASE_URL: eventsApiBaseUrl
} = config.getApiConfig(apiEnv)

console.log(baseApiUrl)

module.exports = {
  env: {
    eventsApiBaseUrl
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'Software Daily',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Software Engineering Daily' }
    ],
    link: [
      { rel: 'shortcut icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css' },
      { rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ],
    script: [
      { src: 'https://code.jquery.com/jquery-3.1.1.slim.min.js' },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js' },
      { src: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js' },
      { src: 'https://js.stripe.com/v3/' }
    ]
  },

  /*
  ** Customize the progress bar color
  */
  loading: false,
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient, isServer }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      if (isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/\.(?!(?:js|json)$).{1,5}$/i, /^phoenix/]
          })
        ]
      }
    },
    vendor: [
      'vue-infinite-scroll',
      'vee-validate',
      'vue-slider-component',
      'vue-social-sharing',
      'moment'
    ]
  },
  plugins: [
    { src: '~/plugins/filters' },
    { src: '~/plugins/social-sharing' },
    { src: '~/plugins/vee-validate' },
    { src: '~/plugins/channel', ssr: false },
    { src: '~/plugins/vue-infinite-scroll', ssr: false },
    { src: '~/plugins/vue-slider', ssr: false }
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  auth: {
    endpoints: {
      login: { url: baseApiUrl + '/auth/login', method: 'post', propertyName: 'token' },
      logout: false,
      user: { url: baseApiUrl + '/users/me', method: 'get', propertyName: false }
    }
  },
  axios: {
    baseURL: baseApiUrl
  }
}
