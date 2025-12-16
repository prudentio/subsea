import Aura from '@primeuix/themes/aura';
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    jwtSecret: "",
  },
   modules: [
        '@pinia/nuxt',
        '@primevue/nuxt-module'
  ],
  primevue: {
        options: {
            theme: {
                preset: Aura
            }
        }
    },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  css: ['./app/assets/css/main.css'],
})
