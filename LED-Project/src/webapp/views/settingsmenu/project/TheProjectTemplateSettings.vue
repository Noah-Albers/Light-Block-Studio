<template>
    <v-textarea auto-grow style="height: 100%;" :rows="20" label="Template" variant="outlined"
        v-model="store.codeTemplate"></v-textarea>
</template>

<script setup
    lang="ts">
    import { useProjectStore } from '@webapp/stores/ProjectStore';
    const store = useProjectStore();
</script>