import { Hooks, Template } from '@template/definitions/Template';
import { ExportedSettingsType } from '@webapp/storage/project/ProjectSchema'
import { defineStore } from 'pinia'
import { computed, Ref, ref } from 'vue';
import { useSettingsStore } from './SettingsStore';
import { LEDAPIHooks } from '@template/definitions/LEDAPI';
import { LEDAPIFastLedPreset } from '@template/ledapi/LEDAPIFastLED';
import { TemplateDefault } from '@template/buildin/TemplateDefault';
import { GridSettings } from '@webapp/utils/PreviewGridSVGGenerator';
import { ExportedPreviewSchemaType } from '@webapp/storage/project/previews/PreviewSchema';


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
    selectedPreview: () => useSettingsStore().defaultPreview,

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
    // Filepath (If saved on desktop) used to store the project at
    const filePath = __set<string|undefined>();
    // File-handler to use (If opened using file-save api)
    const filePointer = __set<FileSystemFileHandle|undefined>();

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


    // System to use for adressing the leds
    const ledApiHooks: Ref<LEDAPIHooks> = ref({
        globalCode: __hook(),
        includeCode: __hook(),
        pushleds: __hook(),
        sethsv: __hook(),
        reservedVariables: __hook(),
        setupCode: __hook(),
    });

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
    // Either SVG-Files (String) or
    // settings to generate a given svg file
    const previews = __set<(string | ExportedPreviewSchemaType)[]>();

    // Which preview is selected (String if it's a build-in one, number if it's the index of one of the custom loaded ones)
    const selectedPreview = __set<number | string>();

    //#endregion

    //#region Computed getters

    const usedReservedKeywords = computed(() => [
        ...(useArduinoReservedKeywords.value ? arduinoReservedKeywords : []),
        ...customReservedKeywords.value,
        ...(ledApiHooks.value.reservedVariables.split(",").map(x => x.trim())).filter(x => x.length > 0)
    ]);

    //#endregion

    //#region Utilities
    // Resets the preview to it's default
    function resetPreview() {
        selectedPreview.value = Defaults.selectedPreview();
    }

    // Used to change the preset led system
    function applyLEDAPIPreset(preset: LEDAPIHooks) {
        for (let rawKey in preset) {
            let key = rawKey as keyof typeof preset;
            ledApiHooks.value[key] = preset[key]!;
        }
    }

    // Applys everything except the variables from the template because those are a different store
    function applyTemplate(temp: Template) {

        codeBlueprint.value = temp.blueprint || "";

        // Loads the hooks
        if (temp.hooks !== undefined)
            for (let name in temp.hooks)
                hooks.value[name as keyof Hooks] = (temp.hooks as any)[name as keyof Hooks]!;

    }

    // Restores the default values
    function restoreDefaults() {
        projectName.value = "Untitled led Project";
        filePath.value = undefined;

        pin.value = 3;
        amount.value = 32;
        loopPushLeds.value = Defaults.loopPushLeds;
        trimEmptyLines.value = Defaults.trimEmptyLines;
        previews.value = [];
        selectedPreview.value = Defaults.selectedPreview();
        customReservedKeywords.value = [];
        useArduinoReservedKeywords.value = true;

        applyLEDAPIPreset(LEDAPIFastLedPreset);
        applyTemplate(TemplateDefault);

    }

    //#endregion
    //#region Import/Export

    // Takes in an already validated exported type to re-import the store
    function importData(name: string, data: ExportedSettingsType, path: string|undefined) {
        projectName.value = name;
        filePath.value = path;

        // The code blueprint and hooks may not be set in every settings export to prevent
        // a lot of duplicated data if only the default values have been used
        if (data.codeBlueprint) codeBlueprint.value = data.codeBlueprint;

        applyTemplate({
            ...TemplateDefault,
            ...data,
            blueprint: data.codeBlueprint || TemplateDefault.blueprint,
            hooks: {
                ...TemplateDefault.hooks,
                ...data.hooks
            }
        });

        applyLEDAPIPreset({
            ...LEDAPIFastLedPreset,
            ...data.ledApiHooks
        });

        // Updates the settings

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
            codeBlueprint: _(TemplateDefault.blueprint, codeBlueprint.value),
            hooks: {
                pushleds: _(TemplateDefault.hooks!.pushleds, hooks.value.pushleds),
                sleep: _(TemplateDefault.hooks!.sleep, hooks.value.sleep),
                sethsv: _(TemplateDefault.hooks!.sethsv, hooks.value.sethsv),
                millis: _(TemplateDefault.hooks!.millis, hooks.value.millis),
                setup: _(TemplateDefault.hooks!.setup, hooks.value.setup),
                loop: _(TemplateDefault.hooks!.loop, hooks.value.loop),
            },
            ledApiHooks: {
                globalCode: _(LEDAPIFastLedPreset.globalCode, ledApiHooks.value.globalCode),
                includeCode: _(LEDAPIFastLedPreset.includeCode, ledApiHooks.value.includeCode),
                reservedVariables: _(LEDAPIFastLedPreset.reservedVariables, ledApiHooks.value.reservedVariables),
                pushleds: _(LEDAPIFastLedPreset.pushleds, ledApiHooks.value.pushleds),
                setupCode: _(LEDAPIFastLedPreset.setupCode, ledApiHooks.value.setupCode),
                sethsv: _(LEDAPIFastLedPreset.sethsv, ledApiHooks.value.sethsv),
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
        codeBlueprint, pin, amount, loopPushLeds, trimEmptyLines, ledSystemHooks: ledApiHooks, hooks, previews, selectedPreview, projectName,
        customReservedKeywords, useArduinoReservedKeywords, usedReservedKeywords, filePath, filePointer,
        applyLEDSystemPreset: applyLEDAPIPreset, applyTemplate,
        importData, exportData, resetPreview, restoreDefaults
    };
});
