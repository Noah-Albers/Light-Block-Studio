<template>
    <v-card class="ma-10" style="height: 80vh; min-width: 80vw; overflow: auto">
        <v-toolbar :elevation="4" :title="$t('visualizer_previewselector_open')" color="primary">
            <v-btn @click="$el.querySelector('.custom_upload_file').click()"
                v-tooltip="$t('visualizer_previewselector_upload-tooltip')" prepend-icon="mdi-upload"
                :text="$t('visualizer_previewselector_upload')" elevation="3" class="mr-2" />
            <v-btn @click="onSaveClicked" v-tooltip="$t('visualizer_previewselector_save-tooltip')"
                :disabled="selected === store.selectedPreview" :text="$t('visualizer_previewselector_save')"
                prepend-icon="mdi-content-save-outline" class="mr-5" elevation="3" />

            <!--Hidden file input-->
            <input accept="svg" multiple class="custom_upload_file" type="file" @change="onFileUpload" hidden>
        </v-toolbar>
        <v-container>
            <v-row>
                <v-col v-for="preview in allPreviews" :key="preview.value" cols="12" md="4">
                    <v-card class="preview-card" height="300" @click="selected = preview.key">
                        <v-toolbar density="compact" :color="selected === preview.key ? 'warning' : 'primary'">
                            <template v-slot:title v-if="preview.isBuildin">
                                {{ preview.key }}
                            </template>
                            <template v-slot:title v-else>
                                {{ $t('visualizer_previewselector_customPreview', { index: preview.key + 1 }) }}
                            </template>
                            <template v-if="preview.isBuildin">
                                <v-icon class="mr-4" v-tooltip="$t('visualizer_previewselector_icon_buildin')" color="#ddd" icon="mdi-wrench" />
                            </template>
                            <template v-else>
                                <v-icon class="mr-4" v-tooltip="$t('visualizer_previewselector_icon_delete')" color="#ddd" icon="mdi-delete"
                                    @click="onTrashClicked(preview)" />
                            </template>
                        </v-toolbar>
                        <img v-if="preview.isBuildin" :src="`previews/${preview.value}`" />
                        <div class="__visualizer_menu_svg" v-else v-html="preview.value"></div>
                    </v-card>
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
import { useProjectStore, BuildInPreviews } from "@webapp/stores/ProjectStore";
import { computed } from "vue";
import { ref } from 'vue';
import { $t } from "@localisation/Fluent";

type PreviewType = {
    value: string,
    isBuildin: true,
    key: string | number
}

const allPreviews = computed(() => {
    return [...BuildInPreviews.map(prev => ({ isBuildin: true, value: prev, key: prev })), ...store.previews.map((prev, idx) => ({ isBuildin: false, value: prev, key: idx }))] as PreviewType[];
})

const store = useProjectStore();

// Which of the previews is selected (undefined if the custom one is selected)
const selected = ref(store.selectedPreview);

// #region  Events

// Event: When the save button is clicked
function onSaveClicked() {
    store.selectedPreview = selected.value;
}

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

    if (selected.value === elm.key)
        selected.value = BuildInPreviews[0];
}

// #endregion

</script>