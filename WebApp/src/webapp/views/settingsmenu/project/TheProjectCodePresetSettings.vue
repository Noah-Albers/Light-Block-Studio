<template>
    <v-textarea auto-grow :rows="20"
        variant="outlined"
        v-bind="$ta('projectsettings_blueprint')"
        hide-details
        v-model="store.codeBlueprint"></v-textarea>

    <v-expansion-panels
        hide-actions
        tile
        class="pb-10 pt-10"
    >
        <v-expansion-panel :title="$t('projectsettings_qa_what-is-blueprint-title')">
            <v-expansion-panel-text v-html="$t('projectsettings_qa_what-is-blueprint-html')" class="text-h5"/>
        </v-expansion-panel>
        <v-expansion-panel :title="$t('projectsettings_qa_what-are-variables-title')">
            <v-expansion-panel-text class="text-h5" v-html="$t('projectsettings_qa_what-are-variables-html')"/>
        </v-expansion-panel>
        <v-expansion-panel :title="$t('projectsettings_qa_reserved-variables-title')">
            <v-expansion-panel-text class="text-h5" v-html="$t('projectsettings_qa_reserved-variables-html')"/>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script setup
    lang="ts">
    import { useProjectStore } from '@webapp/stores/ProjectStore';
    const store = useProjectStore();
</script>

<style scoped lang="scss">
    span {
        background: rgb(62, 62, 62);
        padding: 2px 5px;
        border: 1px solid rgb(42, 42, 42);
        border-radius: 10px;
    }
</style>