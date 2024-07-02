<template>
    <div class="d-flex position-relative justify-center align-center h-100 px-10">

        <!-- Tutorial show button -->
        <v-btn v-tooltip="'Tutorial'" style="position: absolute; top: 1rem; right: 1rem" icon="mdi-help"
            @click="console.log('TODO Provide a link for a tutorial on the serial preview.')" />

        <!-- Serial not supported -->
        <v-card v-if="serial === false" subtitle="Serial API is not supported in your browser" title="Serial API Problem">
            <template v-slot:text>
                We are sorry but your browser doesn't support or allow the <a target="_blank"
                    href="https://developer.mozilla.org/en-US/docs/Web/API/Serial">Serial Web API</a>,
                which we use to communicate with the external hardware.
                <br />
                If you still want to view your animations on real hardware, please use a <a target="_blank"
                    href="https://caniuse.com/web-serial">browser</a> that supports the serial api
                or use the <a href="TODO" target="_blank">electron version</a> of this application.
            </template>
        </v-card>

        <!-- Serial is supported -->
        <v-card v-else subtitle="View your animation on real hardware" title="Serial Preview">
            <template v-slot:text>

                <!-- Connected section -->
                <template v-if="serial.status.value === ConnectionType.CONNECTED">

                    connected


                    <v-btn @click="serial.stopSerial">Close</v-btn>
                </template>

                <!-- Disconnected section -->
                <template v-else-if="serial.status.value === ConnectionType.DISCONNECTED">
                    <!-- Pick (Led pin) -->
                    <v-text-field label="LED-Data Pin" prepend-inner-icon="mdi-led-on"
                        v-model="settings.serialPreview.pin" />
                    <!-- Pick LED Amount -->
                    <v-text-field label="LED-Amount" prepend-inner-icon="mdi-arrow-top-left-bottom-right"
                        v-model="settings.serialPreview.ledAmount" />


                    <div class="d-flex justify-center align-center flex-column">
                        <!-- Copy script -->
                        <v-btn prepend-icon="mdi-content-copy" @click="onCopyScriptClicked" color="primary">Copy
                            Script</v-btn> <br />

                        <!-- Starts the connection -->
                        <v-btn prepend-icon="mdi-connection" @click="serial.startSerial" color="primary">Connect!</v-btn>
                    </div>
                </template>

                <!-- Loading section -->
                <template v-else>
                    <p class="mb-10">Opening port</p>
                    <v-progress-circular color="primary" indeterminate :size="66" :width="5"></v-progress-circular>
                </template>

            </template>
        </v-card>
    </div>
</template>

<script setup
    lang="ts">
    import { useSettingsStore } from "@webapp/stores/SettingsStore";
    import { useSerialHandler, ConnectionType } from "./SerialHandler";
    import { ref } from "vue";

    const settings = useSettingsStore();
    const serial = useSerialHandler();

    // Event: When the user clicks to copy the script
    async function onCopyScriptClicked() {
        const script = serialScript();

        try {
            await navigator.clipboard.writeText(script);
        } catch (err) {
            console.error("Failed to copy script code ", err);

            alert("Failed to copy the script code, please copy it manually:\n\n" + script);
        }
    }

    // Creates the serial script to copy
    const serialScript = () => (`
#include <FastLED.h>
#define LED_PIN $$pin$$
#define LED_AMT $$amt$$

// Fast-led api
CRGB leds[LED_AMT];

void setup(){
    // Setups fastled-library
    FastLED.addLeds<NEOPIXEL, LED_PIN>(leds, LED_AMT);

    // Starts serial communication
    Serial.begin(9600);
}

void loop(){
  // Interprets the command as the index to set the color at
  
  // Waits for the color
  long start = millis();
  while(Serial.available() < 4) {
      if(millis() - start > 1000)
        while(Serial.available())Serial.read();
      return;
  };

  // Reads in the index to set
  byte idx = Serial.read();

  // If the index is 255, it is regarded as a push command
  if(idx == 255){
    FastLED.show();
    return;
  }

  // Ensures index is within range
  if(idx >= LED_AMT) return;

  // Reads in the data
  byte r = Serial.read();
  byte g = Serial.read();
  byte b = Serial.read();

  // Sets the color
  leds[idx] = CRGB(r,g,b);
}`
        .replaceAll("$$pin$$", settings.serialPreview.pin.toString())
        .replaceAll("$$amt$$", settings.serialPreview.ledAmount.toString())
    );

    </script>