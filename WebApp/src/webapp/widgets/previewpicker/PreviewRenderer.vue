<template>
    <v-card class="preview-card" height="300" @click="emit('click')">
        <v-toolbar density="compact" :color="props.highlighted ? 'warning' : 'primary'">
            <template v-slot:title v-if="properties.isBuildin">
                {{ props.preview }}
            </template>
            <template v-slot:title v-else>
                {{ $t('visualizer_previewselector_customPreview', { index: typeof preview === "string" ? preview : (preview + 1) }) }}
            </template>
            <slot></slot>
            <template v-if="properties.isBuildin">
                <v-icon class="mr-4" v-tooltip="$t('visualizer_previewselector_icon_buildin')" color="#ddd"
                    icon="mdi-wrench" />
            </template>
            <template v-else>
                <v-icon v-if="props.customIcon !== undefined" class="mr-4" v-tooltip="props.iconTooltip" color="#ddd" :icon="props.customIcon"
                @click="emit('iconClicked')" />
            </template>
        </v-toolbar>
        <img v-if="properties.isBuildin" :src="properties.path" />
        <div class="__visualizer_menu_svg" v-else v-html="properties.path"></div>
    </v-card>
</template>


<style lang="scss" scoped>
.preview-card {

    img,
    div {
        width: 100%;
        height: calc(100% - 48px);
        padding: .5rem;
        padding-bottom: 1.5rem;
        padding-top: 1.5rem;
    }
}
</style>

<script lang="ts" setup>
import { PropType, computed } from "vue";
import { useProjectStore } from "@webapp/stores/ProjectStore"

const emit = defineEmits<{
    (e: "click"): void,
    (e: "iconClicked"): void,
}>();

const store = useProjectStore();

const properties = computed(()=>{
    const isBuildin = typeof props.preview === "string";
    const path = isBuildin ? `previews/${props.preview}` : store.previews[props.preview];

    return {
        isBuildin,
        path
    }
});

const props = defineProps({
    preview: {
        type: [String, Number] as PropType<string | number>,
        required: true
    },
    customIcon: String,
    iconTooltip: String,
    highlighted: {
        type: Boolean,
        default: false
    }
});

</script>