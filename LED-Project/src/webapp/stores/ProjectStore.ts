import { SettingsExport } from '@webapp/importexport/SaveStateType'
import { defineStore } from 'pinia'

export const BuildInPreviews = ["Goggles.svg", "Ring-16px.svg"]

const Defaults = {
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
}

export const useProjectStore = defineStore('project', {
    state: () => ({
        // TODO: Comment this stuff

        // Quick settings accessible from the quick access menu
        codeTemplate: Defaults.codeTemplate,
        pin: 0,

        loopPushLeds: true as boolean,

        // If set, multiple empty lines will be trimmed down to a single one, improving code readability
        trimEmptyLines: true as boolean,

        hooks: {
            pushleds: Defaults.hooks.pushleds,
            sleep: Defaults.hooks.sleep,
            sethsv: Defaults.hooks.sethsv,
            millis: Defaults.hooks.millis,

            setup: Defaults.hooks.setup,
            loop: Defaults.hooks.loop
        },

        // List of previews stored inside the projects (SVG-Files)
        previews: [] as string[],
        // Which preview is selected (String if it's a build-in one, number if it's the index of one of the custom loaded ones)
        selectedPreview: Defaults.selectedPreview as number | string
    }),

    getters: {
        export(): SettingsExport {

            const _ = (defaultValue: any, actualValue: any)=>{
                if(defaultValue === actualValue) return undefined;
                return actualValue;
            }

            return {
                codeTemplate: _(Defaults.codeTemplate, this.codeTemplate),
                hooks: {
                    pushleds: _(Defaults.hooks.pushleds, this.hooks.pushleds),
                    sleep: _(Defaults.hooks.sleep, this.hooks.sleep),
                    sethsv: _(Defaults.hooks.sethsv, this.hooks.sethsv),
                    millis: _(Defaults.hooks.millis, this.hooks.millis),
                    setup: _(Defaults.hooks.setup, this.hooks.setup),
                    loop: _(Defaults.hooks.loop, this.hooks.loop),
                },
                previews: this.previews,
                selectedPreview: this.selectedPreview,

                pin: this.pin,
                loopPushLeds: this.loopPushLeds,
                trimEmptyLines: this.trimEmptyLines,
            }
        }
    },

    actions: {
        resetPreview(){
            this.selectedPreview = BuildInPreviews[0]
        }
    },
})