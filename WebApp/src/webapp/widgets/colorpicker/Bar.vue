<template>
    <rect :width="width"
        :height="height"
        :x="props.isVertical ? `${props.pos}%` : '0'"
        :y="props.isVertical ? '0' : `${props.pos}%`"
        :style="transformStyle"
        fill="transparent"
        stroke="black" />
</template>

<script lang="ts"
    setup>
    import { computed } from 'vue';

    const transformStyle = computed(() => `transform: translate(${props.isVertical ? '-4px, 0' : '0, -4px'})`);
    const width = computed(()=>props.isVertical ? '8px' : '100%');
    const height = computed(()=>props.isVertical ? '100%' : '8px');

    const props = defineProps({
        pos: {
            type: Number,
            required: true
        },

        isVertical: {
            default: true,
            type: Boolean
        }
    });


</script>