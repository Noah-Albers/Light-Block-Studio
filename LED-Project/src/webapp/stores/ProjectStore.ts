import { defineStore } from 'pinia'

const CodeTemplate = `#include <FastLED.h>
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
}`;

export const useProjectStore = defineStore('project', {
    state: () => ({
        // TODO: Comment this stuff
        preview: "@Goggles.svg" as string,
        codeTemplate: CodeTemplate,
        pin: 0,
        loopPushLeds: true as boolean,

        hooks: {
            pushleds: "FastLED.push();",
            sleep: "delay($$time$$);",
            sethsv: "leds[$$idx$$] = CHSV($$hue$$,$$saturation$$,$$value$$);",
            millis: "millis()",

            setup: "$$code$$",
            loop: "$$code$$"
        }
    }),

    getters: {
    },
    
    actions: {
    },
})