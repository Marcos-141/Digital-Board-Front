import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    theme: {
      defaultTheme: 'tableroTheme',
      themes: {
        tableroTheme: {
          dark: false,
          colors: {
            primary: '#a1c1be',
            'primary-darken-1': '#89aba8',
            secondary: '#e2e3d9',
            'secondary-darken-1': '#c9caa8',
            background: '#f3f4e5',
            surface: '#ffffff',
            'surface-variant': '#e2e3d9',
            'on-background': '#59554e',
            'on-surface': '#59554e',
            'on-primary': '#2c3534',
            'on-secondary': '#423f39',
            text: '#59554e',
            accent: '#a1c1be',
            success: '#7bb0a6',
            warning: '#e0a96d',
            error: '#d96b6b',
            info: '#74a2be',
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})