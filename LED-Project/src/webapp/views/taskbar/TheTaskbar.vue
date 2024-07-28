<template>
    <VueTaskbar :taskbar="TheTaskbar" />
</template>

<script lang="ts" setup>
import VueTaskbar from "@webapp/utils/taskbar/TaskBar.vue"
import { Menu } from "@webapp/utils/taskbar/TaskBar"
import { createFileTab } from "./FileTab";
import { createViewTab } from "./ViewTab";

// The taskbar to show at the top of the screen
// TODO: Update taskbar
const TheTaskbar: Menu[] = [
    createFileTab(),
    createViewTab()
]

</script>