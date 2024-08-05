<template>
    <v-textarea auto-grow style="height: 100%;" :rows="20"
        variant="outlined"
        v-bind="$ta('projectsettings_blueprint')"
        v-model="store.codeBlueprint"></v-textarea>
</template>

<script setup
    lang="ts">
    import { useProjectStore } from '@webapp/stores/ProjectStore';
    const store = useProjectStore();
    </script>