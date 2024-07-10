<template>
    <v-checkbox
        hide-details
        v-tooltip="`If a final pushLed's call shall be ended at the end of the loop code`"
        label="Add Led Push on Loop end" v-model="store.loopPushLeds"></v-checkbox>

    <v-checkbox
        hide-details
        v-tooltip:top="'If set, multiple empty lines will be trimmed down to a single one, improving code readability'"
        label="Trim empty lines" v-model="store.trimEmptyLines"></v-checkbox>
        
    <v-number-input
        class="mt-4"
        label="Pin"
        hide-details
        variant="outlined"
        v-model="store.pin"
        :min="0"
        :max="999"
        v-tooltip="'Which PIN the WS2812 (Neopixel) Stripe is connected to'"
        width="200"
        ></v-number-input>

    <v-number-input
        class="mt-4"
        label="Pixel-Amount"
        hide-details
        variant="outlined"
        v-model="store.amount"
        :min="0"
        v-tooltip="'How many pixels are connected to the LED-Stripe'"
        width="200"
        ></v-number-input>
</template>

<script setup
    lang="ts">
    import { useProjectStore } from '@webapp/stores/ProjectStore';
    import { VNumberInput } from 'vuetify/labs/VNumberInput'
    const store = useProjectStore();

    </script>