<template>
  <v-app>
    <v-overlay
      v-model="menuOpen"
      class="align-center justify-center"
    >
      <TheSettingsMenus/>
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
    <v-navigation-drawer width="60"
      permanent
      location="right">

      <!-- Upper list -->
      <v-list lines="one"
        density="default">
        <v-list-item v-for="(item, name) in MainViews"
          @click="store.mainView = name"
          :key="name"
          :active="store.mainView === name"
          :prepend-icon="item.icon">
          <v-tooltip activator="parent"
            location="left">
            {{ name }}
          </v-tooltip>
        </v-list-item>
      </v-list>

      <!-- Lower list -->
      <template v-slot:append>
        <v-list lines="one"
          density="comfortable">
          <v-list-item rounded="xl"
            v-for="(item, idx) in bottomItems"
            @click="item.action"
            :key="idx"
            :prepend-icon="item.icon">
            <v-tooltip activator="parent"
              location="left">
              {{ item.title }}
            </v-tooltip>
          </v-list-item>
        </v-list>
      </template>

    </v-navigation-drawer>
  </v-app>
</template>

<script setup
  lang="ts">

  import { Splitpanes, Pane } from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import TheWorkspace from "./views/workspace/TheWorkspace.vue";
  import TheSidebar from "./views/sidebar/TheSidebar.vue";
  import { MainViews, useSettingsStore } from "./stores/SettingsStore";
  import { SignalDispatcher } from './utils/signals/SignalDispatcher';
  import { Signals } from './utils/signals/Signals';
  import { sendSignalAwaitResponse } from "./utils/signals/SignalAwaiter";
  import { generateCode } from "./views/codeview/CodeGenerator"
  import { ProcedureWithOptions } from '@procedure/definitions/Procedure';
  import TheSettingsMenus from "./views/settingsmenu/TheSettingsMenu.vue";
  import { ref } from 'vue';

  const store = useSettingsStore();

  const menuOpen = ref(false);

  /**
   * When the copy-code button is clicked
   */
  async function onCopyCodeClicked() {

    try {
      // Gets the config
      const {setup, loop} = await sendSignalAwaitResponse(Signals.REQUEST_CONFIG_BUILD, undefined, Signals.BLOCKLY_ALL_CREATE_CONFIG) as {setup: ProcedureWithOptions<any>[], loop: ProcedureWithOptions<any>[]};

      // Build the code
      const code = generateCode(setup, loop);

      await navigator.clipboard.writeText(code);
    }catch(err){
      console.error("Failed to copy / create code",err);
    }
  }

  // Menu items on the bottom
  const bottomItems = [
    {
      title: "Settings",
      icon: "mdi-cog",
      action: ()=>menuOpen.value = true
    },
    {
      title: "Copy Code",
      icon: "mdi-code-tags",
      action: onCopyCodeClicked
    }
  ]


</script>

<style lang="scss"></style>
