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
import { registerBlockly } from '@webapp/blockly/RegisterBlockly'

import hljs from 'highlight.js/lib/core';
import arduino from 'highlight.js/lib/languages/arduino';

import "highlight.js/scss/atom-one-dark.scss"

// Then register the languages you need
hljs.registerLanguage('arduino', arduino);

// Registers the blockly-blocks
registerBlockly();

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

