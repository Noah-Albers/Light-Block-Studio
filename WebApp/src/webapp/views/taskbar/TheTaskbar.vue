<template>
    <VueTaskbar :taskbar="TheTaskbar" />
</template>

<script lang="ts" setup>
import { Reactive, reactive, computed } from "vue"
import VueTaskbar from "@webapp/utils/taskbar/TaskBar.vue"
import { Menu } from "@webapp/utils/taskbar/TaskBar"
import { createFileTab } from "./FileTab";
import { createViewTab } from "./ViewTab";
import { createDeveloperTab } from "./DeveloperTab";
import { useSettingsStore } from "@webapp/stores/SettingsStore";
import { createHelpTab } from "./HelpTab";
import { createEditTab } from "./EditTab";

const settings = useSettingsStore();

// The taskbar to show at the top of the screen
const TheTaskbar = computed(()=>[
    createFileTab(),
    createViewTab(),
    createEditTab(),
    settings.isDeveloper ? createDeveloperTab() : undefined,
    createHelpTab()
].filter(x=>x!==undefined) as Menu[])

</script>