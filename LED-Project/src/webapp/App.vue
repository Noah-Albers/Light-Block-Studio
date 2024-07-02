<template>
  <v-app>
    <!-- Snackbar to display information-->
    <v-snackbar :timeout="popupOptions!.timeout || 800" v-model="popupOpen">
        {{ popupOptions?.text }}
    </v-snackbar>

    <v-overlay v-model="menuOpen"
      class="align-center justify-center">
      <TheSettingsMenus />
    </v-overlay>

    <!-- Workspace and sidebar -->
    <v-main>
      <Splitpanes class="default-theme"
        :push-other-panes="false">
        <Pane>
          <TheWorkspace />
        </Pane>
        <Pane>
          <TheSidebar />
        </Pane>
      </Splitpanes>
    </v-main>

    <!-- Navigation bar -->
    <TheNavbar @settings-icon-clicked="menuOpen = true" />
  </v-app>
</template>

<script setup
  lang="ts">

  import { Splitpanes, Pane } from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import TheWorkspace from "./views/workspace/TheWorkspace.vue";
  import TheSidebar from "./views/sidebar/TheSidebar.vue";
  import TheSettingsMenus from "./views/settingsmenu/TheSettingsMenu.vue";
  import { ref } from 'vue';
  import TheNavbar from "./views/TheNavbar.vue";
  import { useSignal } from './utils/vue/VueSignalListener';
  import { Signals } from './utils/signals/Signals';
  import { EventArgsPopup } from './utils/signals/SignalArgumentTypes';
  import { Ref } from 'vue';

  const popupOpen = ref(false);
  const popupOptions: Ref<EventArgsPopup> = ref({});

  useSignal(Signals.DISPLAY_POPUP, opts=>{
    popupOptions.value = opts;
    popupOpen.value = true;
  });

  const menuOpen = ref(false);
</script>
