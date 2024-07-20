<template>
    <VueTaskbar :taskbar="TheTaskbar" />
</template>

<script lang="ts" setup>

import VueTaskbar from "@webapp/utils/taskbar/TaskBar.vue"
import { Menu } from "@webapp/utils/taskbar/TaskBar"
import { FileTab } from "./FileTab";
import { ViewTab } from "./ViewTab";

// The taskbar to show at the top of the screen
// TODO: Update taskbar
const TheTaskbar: Menu[] = [
    FileTab,
    ViewTab
]

</script>