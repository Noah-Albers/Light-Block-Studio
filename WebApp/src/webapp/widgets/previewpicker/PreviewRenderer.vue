<template>
    <v-card class="preview-card" height="300" @click="emit('click')">
        <v-toolbar density="compact" :color="props.highlighted ? 'warning' : 'primary'">
            <template v-slot:title v-if="properties.isBuildin">
                {{ props.preview }}
            </template>
            <template v-slot:title v-else>
                {{ displayName }}
            </template>

            <!--TODO: Lang-->
            <v-icon v-if="downloadable" @click="onDownloadClicked" class="mr-4" v-tooltip="'Download'" icon="mdi-download"/>
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
        <img v-if="properties.isBuildin" :src="(properties.path as string)" />
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
import PreviewGridSVGGenerator from "@webapp/utils/PreviewGridSVGGenerator";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import FileUtils from "@utils/FileUtils";
import { $t } from "@localisation/Fluent";

const emit = defineEmits<{
    (e: "click"): void,
    (e: "iconClicked"): void,
}>();

const store = useProjectStore();

const displayName = computed(()=>$t('visualizer_previewselector_customPreview', { index: typeof props.preview === "string" ? props.preview : (props.preview + 1) }));

const properties = computed(()=>{
    const isBuildin = typeof props.preview === "string";

    if(isBuildin) return {
        isBuildin,
        path: `previews/${props.preview}`
    }

    const raw = store.previews[props.preview];
    const path = typeof raw === "string" ? raw : PreviewGridSVGGenerator.generate({
        ...raw,
        rectSizeX: 7, rectSizeY: 7,
        spaceBetweenX: 2, spaceBetweenY: 2,
        stripePadding: 2
    })

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
    },
    downloadable: {
        type: Boolean,
        default: true
    }
});

// Event: When the download icon is clicked
async function onDownloadClicked(){
    try {
        // Gets the raw svg data
        const data = properties.value.isBuildin ? await (await fetch(properties.value.path)).text() : properties.value.path;

        const name = displayName.value + (displayName.value.endsWith(".svg") ? "" : ".svg");

        // Prompts the user to download the file
        FileUtils.promptDownload(data, "image/svg+xml", name);
    }catch(err){
        console.error("Failed to retreive build in preview",err);

        // TODO: Lang
        // Displays the error to the user
        SignalDispatcher.emit(Signals.DISPLAY_SNACKBAR, {
            text: "Failed to load data, are you online?",
            timeout: 5000,
            type: "error"
        });
    }
}

</script>