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

// Global compoenents
import VueBrowser from "@webapp/desktopapi/v-browser.vue";
import VueDesktop from "@webapp/desktopapi/v-desktop.vue";

// Highlight js
import hljs from 'highlight.js/lib/core';
import arduino from 'highlight.js/lib/languages/arduino';

import "highlight.js/scss/atom-one-dark.scss"

// Registers arduino to highlight js for displaying the generated code
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
    .component("v-browser", VueBrowser)
    .component("v-desktop", VueDesktop)
).mount('#app')