<template>
    <!-- Navigation bar -->
    <v-navigation-drawer width="60" permanent location="right">

        <!-- Upper list -->
        <v-list lines="one" density="default">
            <v-list-item v-tooltip:left="item.name()" v-for="(item, key) in MainViews" @click="store.mainView = key" :key="key"
                :active="store.mainView === item.name()" :prepend-icon="item.icon">
            </v-list-item>
        </v-list>

        <!-- Lower list -->
        <template v-slot:append>
            <v-list lines="one" density="comfortable">

                <v-list-item rounded="xl" v-for="(item, idx) in bottomItems" @click="item.action" :key="idx"
                    :prepend-icon="item.icon" v-tooltip:left="item.title">
                </v-list-item>
            </v-list>
        </template>

    </v-navigation-drawer>
</template>

<script setup
    lang="ts">

    import { MainViews, useSettingsStore } from "@webapp/stores/SettingsStore";
    import { Signals } from '@webapp/utils/signals/Signals';
    import { sendSignalAwaitResponse } from "@webapp/utils/signals/SignalAwaiter";
    import { generateCode } from "@webapp/views/codeview/CodeGenerator"
    import { ProcedureWithOptions } from '@procedure/definitions/Procedure';
    import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
    import { $t } from "@localisation/Fluent";
import UiActions from "@webapp/globalactions/UiActions";

    const store = useSettingsStore();

    // Menu items on the bottom
    const bottomItems = [
        {
            title: $t('navbar_settings'),
            icon: "mdi-cog",
            action: () => SignalDispatcher.emit(Signals.OPEN_SETTINGS)
        },
        {
            title: $t('navbar_copycode'),
            icon: "mdi-code-tags",
            action: UiActions.copyCode
        }
    ]


    </script>

<style lang="scss"></style>