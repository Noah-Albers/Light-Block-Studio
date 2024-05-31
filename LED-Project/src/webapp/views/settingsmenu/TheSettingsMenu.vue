<template>
  <v-card class="ma-10">
    <v-tabs v-model="tab"
      bg-color="primary">
      <v-tab value="one">Project Settings</v-tab>
      <v-tab value="two">Global Settings</v-tab>
    </v-tabs>

    <v-card-text class="pa-0" >
      <v-window v-model="tab"
        style="max-height: 80vh; overflow: auto">
        <v-window-item value="one">
          <TheProjectSettings />
        </v-window-item>

        <v-window-item value="two"
          style="padding: 1rem;">
          <TheGlobalSettings />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script setup
  lang="ts">
  import { ref } from 'vue';
  import TheProjectSettings from "./project/TheProjectSettings.vue";
  import TheGlobalSettings from "./TheGlobalSettings.vue";
  import { onUnmounted } from 'vue';
  import { SignalDispatcher } from '@webapp/utils/signals/SignalDispatcher';
  import { Signals } from '@webapp/utils/signals/Signals';
  const tab = ref();

  onUnmounted(() => SignalDispatcher.emit(Signals.REQUEST_CONFIG_BUILD));

</script>