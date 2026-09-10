// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-03-01',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  app: {
    head: {
      title: 'Horizons — Language courses & linguistic stays',
      meta: [
        {
          name: 'description',
          content: 'Learn English, Spanish, French or German — then live the language in London, Madrid, Paris or Berlin.',
        },
      ],
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap',
        },
      ],
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: [
    '@nuxt/image',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    'shadcn-nuxt',
    '@nuxtjs/supabase',
  ],
  piniaPluginPersistedstate: {
    storage: 'localStorage',
    key: 'horizons_%id',
  },
  image: {
    domains: ['images.unsplash.com'],
  },
  shadcn: {
    prefix: '',
    componentDir: '~/components/ui',
  },
  supabase: {
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: ['/build-trip', '/my-trips'],
      cookieRedirect: true,
    },
    types: '~/types/database.types.ts',
  },
  runtimeConfig: {
    // Private / server-only — NOT under `public`, so the browser never gets this.
    // Overridden by TRIP_PRICING_SECRET from .env (see also NUXT_TRIP_PRICING_SECRET).
    tripPricingSecret: process.env.TRIP_PRICING_SECRET || '',
    public: {
      // Keep public keys here only (Supabase public vars stay managed by @nuxtjs/supabase).
    },
  },
})