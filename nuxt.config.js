export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Star Wars Search',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  css: [
    '@/assets/scss/search.scss'
  ],

  plugins: [
  ],

  components: true,

  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/google-fonts',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@chakra-ui/nuxt',
    '@nuxtjs/emotion',
    '@nuxtjs/axios',
    '@nuxtjs/apollo',
    'nuxt-vuex-localstorage',
    '@nuxtjs/pwa',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  // Apollo configuration
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: 'https://star-wars-api.deant.work/graphql',
      },
    },
  },

  pwa: {
    icon: {
      fileName: 'icon.png'
    },
    manifest: {
      name: 'Star Wars Search',
      short_name: 'Star Wars Search',
      lang: 'en',
      description: 'Star Wars Characters Search'
    }
  },

  googleFonts: {
    prefetch: true,
    preconnect: true,
    preload: true,
    families: {
      Lato: [300, 500, 700],
      Inter: [300, 500, 700],
      'Poller+One': [300, 500, 700],
    },
  },

  loading:{
    continuous: true
  }



}
