/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// Components
import App from '@webapp/App.vue'

// Composables
import { createApp } from 'vue'

// Fonts
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Types
import { createVuetify } from 'vuetify/lib/framework.mjs'
import { createPinia } from 'pinia'

const app = (
    createApp(App)
    .use(createVuetify({
      theme: {
        themes: {
          light: {
            colors: {
              primary: '#1867C0',
              secondary: '#5CBBF6',
            },
          },
        },
      },
    }))
    .use(createPinia())
).mount('#app')

