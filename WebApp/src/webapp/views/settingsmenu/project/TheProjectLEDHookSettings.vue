<!--TODO: Add infos about what each hook does and which variables are available-->

<template>
    <v-select
        hide-details
        density="compact"
        :label="$t('ledhook_preset_ledapi')"
        chips
        @update:model-value="x=>onSelectPreview(x as any)"
        :items="['FastLED', 'Adafruit']"
        variant="outlined"></v-select>

    <HookPreview v-model="store.ledSystemHooks.includeCode" name="Include Code" />

    <HookPreview v-model="store.ledSystemHooks.globalCode" name="Global Code" />

    <HookPreview v-model="store.ledSystemHooks.setupCode" name="Setup Code" />

    <HookPreview v-model="store.ledSystemHooks.pushleds" name="PushLEDs" />

    <HookPreview v-model="store.ledSystemHooks.sethsv" name="SetLedHSV"
        :preview-options="{ idx: 0, hue: 255, saturation: 50, value: 200 }" />
    <v-textarea class="mb-4" hide-details :rows="1" auto-grow v-model="store.ledSystemHooks.reservedVariables"
        :label='$t("ledhook_reservedVariables")' variant="outlined"></v-textarea>
</template>

<script setup lang="ts">
import { useProjectStore } from "@webapp/stores/ProjectStore";
import HookPreview from "./HookPreview.vue";
import { LEDAPIFastLedPreset } from "@template/ledapi/LEDAPIFastLED";
import { LEDAPIAdafruitPreset } from "@template/ledapi/LEDAPIAdafruit";
const store = useProjectStore();

function onSelectPreview(key: "FastLED" | "Adafruit"){
    store.applyLEDSystemPreset(key === "FastLED" ? LEDAPIFastLedPreset : LEDAPIAdafruitPreset);
}

</script>