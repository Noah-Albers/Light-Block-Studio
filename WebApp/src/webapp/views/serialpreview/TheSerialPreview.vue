<template>
    <div class="d-flex position-relative justify-center align-center h-100 px-10">

        <!-- Tutorial show button -->
        <!--TODO: Lang-->
        <v-btn v-tooltip="'Tutorial'" style="position: absolute; top: 1rem; right: 1rem" icon="mdi-help"
            @click="console.log('TODO Provide a link for a tutorial on the serial preview.')" />

        <!-- Serial not supported -->
        <v-card v-if="serial === false" v-bind="$ta('serial_not_supported')">
            <template v-slot:text>
                <span v-html="$t('serial_not_supported_text')"></span>
            </template>
        </v-card>

        <!-- Serial is supported -->
        <v-card v-else v-bind="$ta('serial_supported')">
            <template v-slot:text>

                <!-- Connected section -->
                <template v-if="serial.status.value === ConnectionType.CONNECTED">
                    <div class="d-flex flex-column justify-center">
                        <p class="text-center text-h4 mb-3 text-green-lighten-1">{{ $t('serial_status_connected') }}</p>

                        <v-btn class="mx-auto" color="red" @click="serial.stopSerial">{{ $t('serial_status_closed')
                        }}</v-btn>
                    </div>
                </template>

                <!-- Disconnected section -->
                <template v-else-if="serial.status.value === ConnectionType.DISCONNECTED">
                    <!-- Pick (Led pin) -->
                    <v-text-field :label="$t('serial_settings_ledpin')" prepend-inner-icon="mdi-led-on"
                        v-model.number="settings.serialPreview.pin" />
                    <!-- Pick LED Amount -->
                    <v-text-field :label="$t('serial_settings_ledamount')"
                        prepend-inner-icon="mdi-arrow-top-left-bottom-right" v-model.number="settings.serialPreview.ledAmount" />


                    <div class="d-flex justify-center align-center flex-column">
                        <!-- Copy script -->
                        <v-btn prepend-icon="mdi-content-copy" @click="onCopyScriptClicked" color="primary">
                            {{ $t('serial_copyscript') }}
                        </v-btn>
                        <br />

                        <!-- Starts the connection -->
                        <v-btn prepend-icon="mdi-connection" @click="serial.startSerial" color="primary">{{ $t('serial_action_connect') }}</v-btn>
                    </div>
                </template>

                <!-- Loading section -->
                <template v-else>
                    <p class="mb-10">{{ $t('serial_status_connecting') }}</p>
                    <v-progress-circular class="w-100" color="primary" indeterminate :size="66"
                        :width="5"></v-progress-circular>
                </template>

            </template>
        </v-card>
    </div>
</template>

<script setup
    lang="ts">
    import { useSettingsStore } from "@webapp/stores/SettingsStore";
    import { useSerialHandler, ConnectionType } from "./SerialHandler";
    import { $t } from "@localisation/Fluent";
    import { createSerialPreviewCode } from "./SerialPreviewCode";

    const settings = useSettingsStore();
    const serial = useSerialHandler();

    // Event: When the user clicks to copy the script
    async function onCopyScriptClicked() {
        const script = createSerialPreviewCode();

        try {
            await navigator.clipboard.writeText(script);
        } catch (err) {
            console.error("Failed to copy script code ", err);

            alert("Failed to copy the script code, please copy it manually:\n\n" + script);
            alert($t('serial_codecopyerror', { script }));
        }
    }

</script>