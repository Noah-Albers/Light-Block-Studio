<!--TODO: Add infos about what each hook does and which variables are available-->

<template>

    <HookPreview v-model="store.hooks.sleep"
        :preview-options="{ time: 2000 }"
        name="Sleep" />

    <HookPreview v-model="store.hooks.millis"
        name="Millis" />

    <HookPreview v-model="store.hooks.pushleds"
        name="PushLEDs" />

    <HookPreview v-model="store.hooks.sethsv"
        name="SetLedHSV"
        :preview-options="{ idx: 0, hue: 255, saturation: 50, value: 200 }" />

    <HookPreview v-model="store.hooks.setup"
        name="Setup"
        :preview-options="{ count: 1, code: 'IAmAnAnimation();' }" />

    <HookPreview v-model="store.hooks.loop"
        name="Loop"
        :preview-options="{ count: 1, code: 'IAmAnAnimation();' }" />

</template>

<script setup lang="ts">
    import { useProjectStore } from "@webapp/stores/ProjectStore";
    import HookPreview from "./HookPreview.vue";

    const store = useProjectStore();

</script>