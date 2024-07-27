import App from '@webapp/App.vue'
import { createApp } from 'vue'
import { createVuetify } from 'vuetify/lib/framework.mjs'
import { createPinia } from 'pinia'

import { registerBlockly } from '@webapp/blockly/RegisterBlockly'
import { setupFluent } from '@localisation/Fluent';
import { useSettingsStore } from '@webapp/stores/SettingsStore';
import { setupRegistery } from '@registry/Registry';

import VueBrowser from "@webapp/desktopapi/v-browser.vue";
import VueDesktop from "@webapp/desktopapi/v-desktop.vue";

// Fonts
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Highlight js
import hljs from 'highlight.js/lib/core';
import arduino from 'highlight.js/lib/languages/arduino';

import "highlight.js/scss/atom-one-dark.scss"

// Registers arduino to highlight js for displaying the generated code
hljs.registerLanguage('arduino', arduino);

// Prepares the application
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
    // Note: Pinia must be registered before fluent tries to read the language
    .use(createPinia())
    .use(setupFluent(useSettingsStore().language))
    .component("v-browser", VueBrowser)
    .component("v-desktop", VueDesktop)
);

// Creates the registery
setupRegistery();

// Setups the blockly workspace
registerBlockly();

// Mounts the application
app.mount('#app');