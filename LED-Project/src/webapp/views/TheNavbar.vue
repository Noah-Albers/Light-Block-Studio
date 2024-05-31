<template>

    <!-- Navigation bar -->
    <v-navigation-drawer width="60"
        permanent
        location="right">

        <!-- Upper list -->
        <v-list lines="one"
            density="default">
            <v-list-item v-for="(item, name) in MainViews"
                @click="store.mainView = name"
                :key="name"
                :active="store.mainView === name"
                :prepend-icon="item.icon">
                <v-tooltip activator="parent"
                    location="left">
                    {{ name }}
                </v-tooltip>
            </v-list-item>
        </v-list>

        <!-- Lower list -->
        <template v-slot:append>
            <v-list lines="one"
                density="comfortable">
                <v-list-item rounded="xl"
                    v-for="(item, idx) in bottomItems"
                    @click="item.action"
                    :key="idx"
                    :prepend-icon="item.icon">
                    <v-tooltip activator="parent"
                        location="left">
                        {{ item.title }}
                    </v-tooltip>
                </v-list-item>
            </v-list>
        </template>

    </v-navigation-drawer>
</template>

<script setup
    lang="ts">

    import { MainViews, useSettingsStore } from "../stores/SettingsStore";
    import { Signals } from '../utils/signals/Signals';
    import { sendSignalAwaitResponse } from "../utils/signals/SignalAwaiter";
    import { generateCode } from "../views/codeview/CodeGenerator"
    import { ProcedureWithOptions } from '@procedure/definitions/Procedure';
import { emitKeypressEvents } from "readline";

    const store = useSettingsStore();

    const emit = defineEmits<{
        (e: "settingsIconClicked"): void
    }>();

    /**
     * When the copy-code button is clicked
     */
    async function onCopyCodeClicked() {

        try {
            // Gets the config
            const { setup, loop } = await sendSignalAwaitResponse(Signals.REQUEST_CONFIG_BUILD, undefined, Signals.BLOCKLY_ALL_CREATE_CONFIG) as { setup: ProcedureWithOptions<any>[], loop: ProcedureWithOptions<any>[] };

            // Build the code
            const code = generateCode(setup, loop);

            await navigator.clipboard.writeText(code);
        } catch (err) {
            console.error("Failed to copy / create code", err);
        }
    }

    // Menu items on the bottom
    const bottomItems = [
        {
            title: "Settings",
            icon: "mdi-cog",
            action: () => emit("settingsIconClicked")
        },
        {
            title: "Copy Code",
            icon: "mdi-code-tags",
            action: onCopyCodeClicked
        }
    ]


</script>

<style lang="scss"></style>