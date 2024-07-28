<template>
    <v-card class="mx-auto mb-5"
        style="margin-right: 4rem;"
        hover>
        <v-card-item>
            <v-card-title> {{ $t('hooks_title', {hook: $props.name}) }}</v-card-title>
        </v-card-item>

        <v-card-text>
            <Splitpanes class="splitpanes-dark-theme"
                style="min-width: 40rem;"
                :push-other-panes="false">
                <Pane>
                    <v-textarea hide-details
                        :rows="1"
                        v-bind="$ta('hooks_edit_field', { hook: $props.name })"
                        variant="solo"
                        auto-grow
                        v-model="model">

                    </v-textarea>
                </Pane>
                <Pane>
                    <v-card>
                        <v-card-title style="color: gray; font-size: 0.85rem; padding: 0; padding-left: .5rem;">
                            {{ $t('hooks_preview', { hook: $props.name }) }}
                        </v-card-title>
                        <v-card-text style="padding: 0; padding-left: .5rem;">
                            <pre><code v-html="formatted"></code></pre>
                        </v-card-text>
                    </v-card>
                </Pane>
            </Splitpanes>
        </v-card-text>
    </v-card>
</template>

<script setup
    lang="ts">
    import { PropType, computed } from 'vue';
    import hljs from 'highlight.js';
    import { Splitpanes, Pane } from 'splitpanes'

    const model = defineModel("modelValue", {
        required: true,
        type: String
    })
    const props = defineProps({
        name: { type: String, required: true },
        previewOptions: {
            type: Object as PropType<{ [key: string]: string | number }>,
            default: {}
        }
    })

    const formatted = computed(() => {
        // Raw code
        let code = model.value;

        // Inserts preview data
        for (let opt in props.previewOptions)
            code = (code as any).replaceAll(`$$${opt}$$`, props.previewOptions[opt].toString());

        // Highlights the code
        return hljs.highlight(
            code,
            { language: 'arduino' }
        ).value
    })

</script>