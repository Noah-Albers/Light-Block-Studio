import { Hooks } from '@template/definitions/Template';
import { ExportedSettingsType } from '@webapp/storage/project/ProjectSchema'
import { defineStore } from 'pinia'
import { computed, Ref, ref } from 'vue';
import { useSettingsStore } from './SettingsStore';


// List of keywords that are used and/or reserved by the arduino ide / programming language
// Note: This does not list all keywords but only the most common ones
const arduinoReservedKeywords = [
    "digitalRead", "digitalWrite", "pinMode", "analogRead", "analogReadResolution", "analogReference",
    "analogWrite", "analogWriteResolution", "noTone", "pulseIn", "pulseInLong", "shiftIn", "shiftOut",
    "tone", "delay", "delayMicroseconds", "micros", "millis", "abs", "constrain", "map", "max", "min",
    "pow", "sq", "sqrt", "cos", "sin", "tan", "isAlpha", "isAlphaNumeric", "isAscii", "isControl",
    "isDigit", "isGraph", "isHexadecimalDigit", "isLowerCase", "isPrintable", "isPunct", "isSpace",
    "isUpperCase", "isWhitespace", "random", "randomSeed", "bit", "bitClear", "bitRead", "bitSet",
    "bitWrite", "highByte", "lowByte", "attachInterrupt", "detachInterrupt", "digitalPinToInterrupt",
    "interrupts", "noInterrupts", "Serial",
    "HIGH", "LOW", "INPUT", "INPUT_PULLUP", "OUTPUT", "INPUT_PULLDOWN",
    "LED_BUILDIN", "true", "false", "int", "unsigned", "signed", "long", "byte", "char", "float", "bool",
    "boolean", "double", "char", "short", "size_t", "string", "String", "void", "const", "scope", "static",
    "volatile", "PROGMEM", "sizeof", "setup", "loop", "break", "continue", "do", "while", "else", "for",
    "goto", "if", "return", "switch", "case", "while"
];

// Holds most default values
export const Defaults = {
    codeBlueprint: `#include <FastLED.h>
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
    } as Hooks,

    selectedPreview: ()=>useSettingsStore().defaultPreview,

    loopPushLeds: true,
    trimEmptyLines: true
}

export const useProjectStore = defineStore('project', () => {
    // Prevents duplicated default assignments when the restoreDefaults function is called anyway every time the store is initialized
    const __set = <T>() => ref(undefined as T);
    // This is the one used for the hooks
    const __hook = () => undefined as any as string

    //#region Settings

    // Name of the project (Is/Will be the filename)
    const projectName = __set<string>();

    //#region Quicksettings
    // Quick settings accessible from the quick access menu

    // Blueprint to insert the generated code into
    const codeBlueprint = __set<string>();

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
    const hooks: Ref<Hooks> = ref({
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

    // TODO: Add interface to edit / modify reserved keywords

    // Keywords that are reserved and shall not be used by any code
    const customReservedKeywords = __set<string[]>();
    const useArduinoReservedKeywords = __set<boolean>();

    //#endregion

    // List of previews stored inside the projects (SVG-Files)
    const previews = __set<string[]>();

    // Which preview is selected (String if it's a build-in one, number if it's the index of one of the custom loaded ones)
    const selectedPreview = __set<number | string>();

    //#endregion

    //#region Computed getters

    const usedReservedKeywords = computed(()=>[
        ...(useArduinoReservedKeywords.value ? arduinoReservedKeywords : []),
        ...customReservedKeywords.value
    ]);

    //#endregion

    //#region Utilities
    // Resets the preview to it's default
    function resetPreview() {
        selectedPreview.value = Defaults.selectedPreview();
    }

    // Restores the default values
    function restoreDefaults() {
        projectName.value = "Untitled led Project";

        codeBlueprint.value = Defaults.codeBlueprint;
        pin.value = 3;
        amount.value = 32;
        loopPushLeds.value = Defaults.loopPushLeds;
        trimEmptyLines.value = Defaults.trimEmptyLines;
        previews.value = [];
        selectedPreview.value = Defaults.selectedPreview();
        customReservedKeywords.value = [];
        useArduinoReservedKeywords.value = true;

        for (let rawKey in Defaults.hooks) {
            let key = rawKey as keyof typeof Defaults.hooks;
            hooks.value[key] = Defaults.hooks[key];
        }
    }

    //#endregion
    //#region Import/Export

    // Takes in an already validated exported type to re-import the store
    function importData(name: string, data: ExportedSettingsType) {
        projectName.value = name;

        // The code blueprint and hooks may not be set in every settings export to prevent
        // a lot of duplicated data if only the default values have been used
        if (data.codeBlueprint) codeBlueprint.value = data.codeBlueprint;

        for (let rawKey in data.hooks) {
            let key = rawKey as keyof typeof data.hooks;
            let value = data.hooks[key];
            if (value === undefined) continue;
            hooks.value[key] = value;
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
            codeBlueprint: _(Defaults.codeBlueprint, codeBlueprint.value),
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
            customReservedKeywords: customReservedKeywords.value,
            useArduinoReservedKeywords: useArduinoReservedKeywords.value,
        };
    }

    //#endregion

    // Ensures the default values are set, ah, well by default
    restoreDefaults();

    return {
        codeBlueprint, pin, amount, loopPushLeds, trimEmptyLines, hooks, previews, selectedPreview, projectName,
        customReservedKeywords, useArduinoReservedKeywords, usedReservedKeywords,

        importData, exportData, resetPreview, restoreDefaults
    };
});
