<template>
  <v-app>
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

  const menuOpen = ref(false);
</script>
