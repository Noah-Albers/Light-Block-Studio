import { ExportedSettingsType } from '@webapp/storage/project/ProjectSchema'
import { defineStore } from 'pinia'
import { ref } from 'vue';

// List of all buildin previews (Filenames)
export const BuildInPreviews = ["Goggles.svg", "Ring-16px.svg"]

// Holds most default values
export const Defaults = {
    codeTemplate: `#include <FastLED.h>
#define LED_PIN $$pin$$
#define LED_AMT $$amt$$

// Fast-led api
CRGB leds[LED_AMT];

$$globals$$

void setup(){
    // Setups fastled-library
    FastLED.addLeds<NEOPIXEL, LED_PIN>(leds, LED_AMT);
    
    // Start of setup-code
    $$setup$$

}

void loop(){
    $$loop$$
}`,

    hooks: {
        pushleds: "FastLED.show();",
        sleep: "delay($$time$$);",
        sethsv: "leds[$$idx$$] = CHSV($$hue$$,$$saturation$$,$$value$$);",
        millis: "millis()",

        setup: "$$code$$",
        loop: "$$code$$"
    },

    selectedPreview: BuildInPreviews[0],

    loopPushLeds: true,
    trimEmptyLines: true
}

export const useProjectStore = defineStore('project', () => {
    // Prevents duplicated default assignments when the restoreDefaults function is called anyway every time the store is initialized
    const __set = <T>() => ref(undefined as T);
    // This is the one used for the hooks
    const __hook = () => undefined as any as string

    //#region Settings

    //#region Quicksettings
    // Quick settings accessible from the quick access menu

    // Template to insert the generated code into
    const codeTemplate = __set<string>();

    // Pin where the neopixel led stripe is connected to
    const pin = __set<number | undefined>();

    // Amount of Pixel connected to the stripe
    const amount = __set<number | undefined>();

    // If a final led push shall be done at the end of the loop code.
    // Usually an unimportant setting but it may become important
    const loopPushLeds = __set<boolean>();

    // If set, multiple empty lines will be trimmed down to a single one, improving code readability
    const trimEmptyLines = __set<boolean>();

    // Strings which are used when generating code as placeholders
    const hooks = ref({
        // When the internal led stripe is pushed to the hardware
        pushleds: __hook(),
        // When the microcontroller is supposed to sleep
        sleep: __hook(),
        // Sets a given led using Hue, Saturation, Value with 0-255 values
        sethsv: __hook(),
        // Returns how many milliseconds the microcontroller has been running
        millis: __hook(),
        // Wrapper for setup and loop blocks
        setup: __hook(),
        loop: __hook(),
    });
    //#endregion

    // List of previews stored inside the projects (SVG-Files)
    const previews = __set<string[]>();

    // Which preview is selected (String if it's a build-in one, number if it's the index of one of the custom loaded ones)
    const selectedPreview = __set<number | string>();

    //#endregion

    //#region Utilities
    // Resets the preview to it's default
    function resetPreview() {
        selectedPreview.value = BuildInPreviews[0];
    }

    // Restores the default values
    function restoreDefaults() {
        codeTemplate.value = Defaults.codeTemplate;
        pin.value = 0;
        amount.value = 1;
        loopPushLeds.value = Defaults.loopPushLeds;
        trimEmptyLines.value = Defaults.trimEmptyLines;
        previews.value = [];
        selectedPreview.value = Defaults.selectedPreview;

        for (let rawKey in Defaults.hooks) {
            let key = rawKey as keyof typeof Defaults.hooks;
            hooks.value[key] = Defaults.hooks[key];
        }
    }

    //#endregion
    //#region Import/Export

    // Takes in an already validated exported type to re-import the store
    function importData(data: ExportedSettingsType) {
        // The code template and hooks may not be set in every settings export to prevent
        // a lot of duplicated data if only the default values have been used
        if (data.codeTemplate) codeTemplate.value = data.codeTemplate;

        for (let rawKey in data.hooks) {
            let key = rawKey as keyof typeof data.hooks;
            if (data.hooks[key] === undefined) continue;
            hooks.value[key] = data.hooks[key];
        }

        amount.value = data.amount;
        loopPushLeds.value = data.loopPushLeds;
        pin.value = data.pin;
        previews.value = data.previews;
        selectedPreview.value = data.selectedPreview;
        trimEmptyLines.value = data.trimEmptyLines;
    }

    // Serializes and exports the store
    function exportData(): ExportedSettingsType {
        // Compares two values and returns undefined if they are equal to prevent cluttering default values
        const _ = <T>(defaultValue: T, actualValue: T) => {
            return defaultValue === actualValue ? undefined : actualValue;
        };

        return {
            codeTemplate: _(Defaults.codeTemplate, codeTemplate.value),
            hooks: {
                pushleds: _(Defaults.hooks.pushleds, hooks.value.pushleds),
                sleep: _(Defaults.hooks.sleep, hooks.value.sleep),
                sethsv: _(Defaults.hooks.sethsv, hooks.value.sethsv),
                millis: _(Defaults.hooks.millis, hooks.value.millis),
                setup: _(Defaults.hooks.setup, hooks.value.setup),
                loop: _(Defaults.hooks.loop, hooks.value.loop),
            },
            previews: previews.value,
            selectedPreview: selectedPreview.value,
            pin: pin.value || 0,
            amount: amount.value || 0,
            loopPushLeds: loopPushLeds.value,
            trimEmptyLines: trimEmptyLines.value,
        };
    }

    //#endregion

    // Ensures the default values are set, ah, well by default
    restoreDefaults();

    return {
        codeTemplate, pin, amount, loopPushLeds, trimEmptyLines, hooks, previews, selectedPreview,

        importData, exportData, resetPreview, restoreDefaults
    };
});
