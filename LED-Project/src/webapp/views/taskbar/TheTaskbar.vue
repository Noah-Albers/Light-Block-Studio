<template>
    <VueTaskbar :taskbar="TheTaskbar" />
</template>

<script lang="ts" setup>

import VueTaskbar from "@webapp/utils/taskbar/TaskBar.vue"
import { Menu } from "@webapp/utils/taskbar/TaskBar"

// The taskbar to show at the top of the screen
// TODO: Update taskbar
const TheTaskbar: Menu[] = [
{
        text: "File",
        items: ()=>([
            { text: "Item 1", action: ()=>console.log('lul') },
            "seperator",
            { text: "Item 2", action: ()=>console.log('lul') },
            { text: "Item 3", items: ()=>([
                { text: "Item 4", action: ()=>console.log('lul') },
                { text: "Item 5", action: ()=>console.log('lul') },
                { text: "Item 6", action: ()=>console.log('lul') },
            ]) },
            { text: "Item 7", action: ()=>console.log('lul') },
        ])
    }
]

</script>