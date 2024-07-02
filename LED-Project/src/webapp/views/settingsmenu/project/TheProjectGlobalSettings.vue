<template>
    <v-checkbox label="Add Led Push on Loop end" v-model="store.loopPushLeds"></v-checkbox>

    <v-checkbox
        v-tooltip:top="'If set, multiple empty lines will be trimmed down to a single one, improving code readability'"
        label="Trim empty lines" v-model="store.trimEmptyLines"></v-checkbox>
</template>

<script setup
    lang="ts">
    import { useProjectStore } from '@webapp/stores/ProjectStore';
    const store = useProjectStore();

    </script>