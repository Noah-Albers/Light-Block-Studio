<template>
  <Runtests v-if="true"/>
  <v-app v-else>
    <v-main>
      <HelloWorld />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Runtests from '@webapp/dev/Runtests.vue';
</script>
