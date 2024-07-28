<!--TODO: implement into taskbar-->

<template>
    <v-app>
      <v-main>
        <v-btn @click="onTest">
            Run all tests
        </v-btn>
      </v-main>
    </v-app>
</template>
  
<script setup lang="ts">
import {runAllTests} from "@test/AllTests.test";

function onTest() {
    runAllTests();
}

</script>
  