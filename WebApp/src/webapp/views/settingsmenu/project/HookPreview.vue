<template>
    <v-card class="mx-auto mb-5"
        style="margin-right: 4rem;"
        hover>
        <v-card-item>
            <v-card-title>
                <p class="d-flex space-between">
                    {{ $t('hooks_title', {hook: $props.name}) }}
                    
                    <v-menu :close-delay="0" open-on-hover :open-delay="0" transition="none">
                        
                        <template v-slot:activator="{ props: p }">
                            <v-icon size=small class="mt-1 ml-2" icon="mdi-information-outline" v-bind="p"/>
                        </template>
                        
                        <v-sheet class="pa-4">
                            <p>{{ $t('hooks_info_always') }}</p>
                           
                            <template v-if="Object.keys($props.previewOptions ?? {}).length > 0">
                                <div v-html="$t('hooks_info_restricted')" />

                                <ul class="ml-10">
                                    <li v-for="val,name in $props.previewOptions">
                                        {{ $t('hooks_info_variable', {name, val:val.toString()}) }}
                                    </li>
                                </ul>
                            </template>
                        </v-sheet>
                    </v-menu>

                </p>
            </v-card-title>
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
    import { replaceVariables } from "@utils/StringUtils";

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
        // Highlights the code
        return hljs.highlight(
            replaceVariables(model.value, props.previewOptions),
            { language: 'arduino' }
        ).value
    })

</script>