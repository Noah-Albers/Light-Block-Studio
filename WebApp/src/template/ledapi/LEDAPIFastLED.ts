import { LEDAPIHooks } from "@template/definitions/LEDAPI";

export const LEDAPIFastLedPreset: LEDAPIHooks = {
    globalCode: `// Fast-led api\nCRGB leds[LED_AMT];`,
    setupCode: `// Setups fastled-library\nFastLED.addLeds<NEOPIXEL, LED_PIN>(leds, LED_AMT);`,
    includeCode: `#include <FastLED.h>`,
    pushleds: "FastLED.show();",
    sethsv: "leds[$$idx$$] = CHSV($$hue$$,$$saturation$$,$$value$$);",
    reservedVariables: "leds,FastLED"
}