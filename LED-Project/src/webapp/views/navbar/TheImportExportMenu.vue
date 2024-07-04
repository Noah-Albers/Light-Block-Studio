<template>
    <v-menu v-model="isOpen" :close-on-content-click="false" location="left center">
        <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" rounded="xl" prepend-icon="mdi-content-save-outline" v-tooltip:left="'Import / Export'" />
        </template>

        <v-card class="pa-3 pb-5" min-width="300">
            <h1 class="text-h5 text-center mb-5">Import / Export</h1>
            <div class="d-flex justify-space-around">
                <v-btn @click="onExportClicked" color="primary" prepend-icon="mdi-application-export">Export</v-btn>
                <v-btn color="primary" prepend-icon="mdi-application-import">Import</v-btn>
            </div>
        </v-card>
    </v-menu>
</template>

<script lang="ts" setup>
import { exportProject } from '@webapp/importexport/ImportExportSystem';
import { ref } from 'vue';

const isOpen = ref(false);

// Event: When the export button is clicked
async function onExportClicked(){

    // TODO: Handle exports
    console.log(JSON.parse(await exportProject()));
}

</script>