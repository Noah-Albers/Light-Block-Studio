<template>
    <v-card class="ma-10" style="height: 80vh; min-width: 80vw; overflow: auto">
        <v-toolbar :elevation="4" :title="$t('visualizer_previewselector_open')" color="primary">
            <v-btn @click="$el.querySelector('.custom_upload_file').click()"
                v-tooltip="$t('visualizer_previewselector_upload-tooltip')" prepend-icon="mdi-upload"
                :text="$t('visualizer_previewselector_upload')" elevation="3" class="mr-2" />
           

            <!--Hidden file input-->
            <input accept="svg" multiple class="custom_upload_file" type="file" @change="onFileUpload" hidden>
        </v-toolbar>
        <v-container>
            <v-row>
                <v-col v-for="preview in allPreviews" :key="preview.value" cols="12" md="4">
                    <PreviewRenderer
                        :deleteable-if-extern="true"
                        :highlighted="vModel === preview.key"
                        :preview="preview.key"
                        @click="vModel = preview.key"
                        @icon-clicked="onTrashClicked(preview)"
                        customIcon="mdi-delete"
                        :icon-tooltip="$t('visualizer_previewselector_icon_delete')"
                        />
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<style lang="scss">
// Because the SVG is added afterwards, this must be none-scoped styles
.__visualizer_menu_svg {
    svg {
        height: 100%;
        width: 100%;
    }
}
</style>

<script lang="ts" setup>
import { useProjectStore } from "@webapp/stores/ProjectStore";
import { computed, PropType } from "vue";
import { ref } from 'vue';
import { $t } from "@localisation/Fluent";
import { BuildInPreviews } from "@webapp/stores/SettingsStore";
import PreviewRenderer from "./PreviewRenderer.vue"

type PreviewType = {
    value: string,
    isBuildin: true,
    key: string | number
}

const allPreviews = computed(() => {
    const BuildIn = BuildInPreviews.map(prev => ({ isBuildin: true, value: prev, key: prev }));
    const Custom = store.previews.map((prev, idx) => ({ isBuildin: false, value: prev, key: idx }));

    return (props.buildinOnly ? BuildIn : [
        ...BuildIn,
        ...Custom
    ]) as PreviewType[]
})

const props = defineProps({
    buildinOnly: {
        type: Boolean,
        default: false
    }
})

const store = useProjectStore();

// Defines the model to use
const vModel = defineModel({
    required: true,
    type: [String, Number] as PropType<String | Number>
})

// #region  Events

// Event: When a custom preview file is uploaded
function onFileUpload(evt: any) {

    function onReadFile(evt: any) {
        try {
            // Gets the content
            var cont = (evt as any).target.result;

            // Adds the image
            store.previews.push(cont);
        } catch (exc) {
            console.error("Failed to load SVG-Preview-file_ ", exc)
        }
    }

    // Filters the valid files
    const files = Array.from((evt as any).target.files) as File[];

    // List of files that are invalid
    const errors: string[] = [];

    for (let file of files) {
        if (!file.name.toLowerCase().endsWith(".svg")) {
            errors.push(file.name);
            continue;
        }

        // Loads the files
        var reader = new FileReader();
        reader.onload = onReadFile;
        reader.readAsText(file);
    }

    if (errors.length > 0)
        alert($t('visualizer_previewselector_upload_import_error', { count: errors.length, files: errors.join(", ")}));
}

// Event: The trash icon on a custom preview got clicked
function onTrashClicked(elm: PreviewType) {
    if(!confirm($t('visualizer_previewselector_upload_confirm', { key: elm.key })))
        return;

    // Deletes the preview
    store.previews = store.previews.filter((_, idx) => idx !== elm.key);

    if (vModel.value === elm.key)
        vModel.value = BuildInPreviews[0];
}

// #endregion

</script>