<template>
    <v-checkbox
        hide-details
        v-tooltip="$t('projectsettings_global_endLedPush-tooltip')"
        :label="$t('projectsettings_global_endLedPush')" v-model="store.loopPushLeds"></v-checkbox>

    <v-checkbox
        hide-details
        v-tooltip:top="$t('projectsettings_global_trimEmptyLines-tooltip')"
        :label="$t('projectsettings_global_trimEmptyLines')" v-model="store.trimEmptyLines"></v-checkbox>
        
    <v-number-input
        class="mt-4"
        :label="$t('projectsettings_global_pin')"
        hide-details
        variant="outlined"
        v-model="store.pin"
        :min="0"
        :max="999"
        v-tooltip="$t('projectsettings_global_pin-tooltip')"
        width="200"
        ></v-number-input>

    <v-number-input
        class="mt-4"
        :label="$t('projectsettings_global_amount')"
        hide-details
        variant="outlined"
        v-model="store.amount"
        :min="0"
        v-tooltip="$t('projectsettings_global_amount-tooltip')"
        width="200"
        ></v-number-input>
</template>

<script setup
    lang="ts">
    import { useProjectStore } from '@webapp/stores/ProjectStore';
    import { VNumberInput } from 'vuetify/labs/VNumberInput'
    const store = useProjectStore();

    </script>