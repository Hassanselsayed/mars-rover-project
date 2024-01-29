export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  app: {
    head: {
      title: 'Mars Rover',
      meta: [
        {name: 'description', content: 'Images from the Mars Rover'}
      ]
    }
  },
  runtimeConfig: {
    apiKey: process.env.NASA_API_KEY
  }
})
