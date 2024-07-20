<template>
    <VueTaskbar :taskbar="TheTaskbar" />
</template>

<script lang="ts" setup>

import VueTaskbar from "@webapp/utils/taskbar/TaskBar.vue"
import { Menu } from "@webapp/utils/taskbar/TaskBar"
import { createBrowserStorageMenuItems } from "@webapp/storage/browser/BrowserStorage";

// The taskbar to show at the top of the screen
// TODO: Update taskbar
const TheTaskbar: Menu[] = [
{
        text: "File",
        items: [
            ...createBrowserStorageMenuItems(),
        ]
    }
]

</script>