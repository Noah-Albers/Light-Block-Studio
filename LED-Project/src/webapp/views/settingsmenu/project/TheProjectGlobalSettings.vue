<template>

    <v-tooltip text="If a final led push is added at the end of the loop code. Disable to prevent"
        location="top">
        <template v-slot:activator="{ props }">
            <v-checkbox v-bind="props"
                label="Add Led Push on Loop end"
                v-model="store.loopPushLeds"></v-checkbox>
        </template>
    </v-tooltip>
</template>

<script setup
    lang="ts">
    import { useProjectStore } from '@webapp/stores/ProjectStore';
    const store = useProjectStore();

</script>