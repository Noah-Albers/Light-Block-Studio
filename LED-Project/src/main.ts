// Components
import App from '@webapp/App.vue'
// Composables
import { createApp } from 'vue'
// Types
import { createVuetify } from 'vuetify/lib/framework.mjs'
import { createPinia } from 'pinia'

//#region Desktop/Browser components

// Global compoenents
import VueBrowser from "@webapp/desktopapi/v-browser.vue";
import VueDesktop from "@webapp/desktopapi/v-desktop.vue";

//#endregion

//#region Fonts

// Fonts
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

//#endregion

//#region Highlight.js

// Highlight js
import hljs from 'highlight.js/lib/core';
import arduino from 'highlight.js/lib/languages/arduino';

import "highlight.js/scss/atom-one-dark.scss"

// Registers arduino to highlight js for displaying the generated code
hljs.registerLanguage('arduino', arduino);

//#endregion

//#region Blockly
import { registerBlockly } from '@webapp/blockly/RegisterBlockly'
import { Fluent } from '@localisation/Fluent';

// Registers the blockly-blocks
registerBlockly();

//#endregion

//#region Create application

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
    .use(Fluent)
    .component("v-browser", VueBrowser)
    .component("v-desktop", VueDesktop)
).mount('#app')

//#endregion