<template>

    <!-- Inner -->
    <circle v-if="isCircle"
        :cx="strPosX"
        :cy="strPosY"
        r="4px"
        stroke="white"
        stroke-width="2"
        fill="transparent" />
    <rect width="8px"
        v-else
        style="transform: translate(-4px, -4px);"
        height="8px"
        fill="transparent"
        stroke="white"
        stroke-width="2px"
        :x="strPosX"
        :y="strPosY" />

    <!-- Outer -->
    <circle v-if="isCircle"
        :cx="strPosX"
        :cy="strPosY"
        r="6px"
        :stroke="props.isLocked ? 'gray' : 'black'"
        stroke-width="2"
        fill="transparent" />

    <!-- Cursor (Secondary) -->

    <rect v-else
        width="12px"
        style="transform: translate(-6px, -6px);"
        height="12px"
        fill="transparent"
        :stroke="props.isLocked ? 'gray' : 'black'"
        stroke-width="2px"
        :x="strPosX"
        :y="strPosY" />

</template>

<script lang="ts"
    setup>
import { computed } from 'vue';


    const props = defineProps({
        posX: {
            required: true,
            type: Number
        },
        posY: {
            required: true,
            type: Number
        },

        isCircle: {
            default: true,
            type: Boolean
        },

        isLocked: {
            default: false,
            type: Boolean
        }
    })

    const strPosX = computed(()=>`${props.posX}%`)
    const strPosY = computed(()=>`${props.posY}%`)

</script>