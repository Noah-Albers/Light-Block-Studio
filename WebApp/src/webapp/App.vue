<template>
  <v-app style="height:100%" theme="dark">

    <!--Banner ad to install the app as a pwa-->
    <ThePWABanner/>

    <!--The application bar on top-->
    <v-app-bar :elevation="1" height="20">
      <TheTaskbar/>
    </v-app-bar>


    <!-- Snackbar to display information-->
    <v-snackbar :color="snackbarOptions.type || 'info'" :timeout="snackbarOptions!.timeout || 800" v-model="snackbarOpen">
      {{ snackbarOptions?.text }}
    </v-snackbar>

    <!-- Holds the settings menu -->
    <TheSettingsMenus />

    <!-- Popup for user requests that shall popup to ask -->
    <TheRequestPopup/>

    <!-- Workspace and sidebar -->
    <v-main>
      <Splitpanes class="splitpanes-dark-theme" :push-other-panes="false">
        <Pane>
          <TheWorkspace />
        </Pane>
        <Pane>
          <TheSidebar />
        </Pane>
      </Splitpanes>
    </v-main>

    <!-- Navigation bar -->
    <TheNavbar />
  </v-app>
</template>

<style lang="scss">

// Global splitpane scss
.splitpanes-dark-theme {
  background: #313131;

  .splitpanes__splitter{
    background: #212121;
  }
}

.splitpanes--vertical > .splitpanes__splitter{
  min-width: 10px;
}

.splitpanes--horizontal > .splitpanes__splitter{
  min-height: 10px;
}


</style>

<script setup
  lang="ts">

  import { Splitpanes, Pane } from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import TheWorkspace from "./views/workspace/TheWorkspace.vue";
  import TheSidebar from "./views/sidebar/TheSidebar.vue";
  import TheSettingsMenus from "./views/settingsmenu/TheSettingsMenu.vue";
  import TheTaskbar from "./views/taskbar/TheTaskbar.vue";
  import { ref } from 'vue';
  import TheNavbar from "./views/navbar/TheNavbar.vue";
  import { useSignal } from './utils/vue/VueSignalListener';
  import { Signals } from './utils/signals/Signals';
  import { EventArgsSnackbar } from './utils/signals/SignalArgumentTypes';
  import { Ref } from 'vue';
  import TheRequestPopup from "./views/popup/TheRequestPopup.vue";
  import ThePWABanner from './views/pwa/ThePWABanner.vue';

  const snackbarOpen = ref(false);
  const snackbarOptions: Ref<EventArgsSnackbar> = ref({});

  useSignal(Signals.DISPLAY_SNACKBAR, opts => {
    snackbarOptions.value = opts;
    snackbarOpen.value = true;
  });
</script>
