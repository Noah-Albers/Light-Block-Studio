<template>
  <v-card>
    <v-tabs v-model="tab"
      bg-color="primary">
      <v-tab value="one">Project Settings</v-tab>
      <v-tab value="two">Global Settings</v-tab>
    </v-tabs>

    <v-card-text class="pa-0" >
      <v-window v-model="tab"
        style="height: 80vh; min-width: 80vw; overflow: auto">
        <v-window-item value="one">
          <TheProjectSettings />
        </v-window-item>

        <v-window-item value="two">
          <TheGlobalSettings />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>

</template>

<style lang="scss" scoped>
.v-window-item {
  width: 100%;
  height: 100%;
}
</style>

<script setup
  lang="ts">
  import { ref } from 'vue';
  import TheProjectSettings from "./project/TheProjectSettings.vue";
  import TheGlobalSettings from "./global/TheGlobalSettings.vue";
  import { onUnmounted } from 'vue';
  import { SignalDispatcher } from '@webapp/utils/signals/SignalDispatcher';
  import { Signals } from '@webapp/utils/signals/Signals';
  const tab = ref();

  onUnmounted(() => SignalDispatcher.emit(Signals.REQUEST_CONFIG_BUILD));

</script>