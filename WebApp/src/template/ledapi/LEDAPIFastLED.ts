import { LEDAPIHooks } from "@template/definitions/LEDAPI";

export const LEDAPIFastLedPreset: LEDAPIHooks = {
    globalCode: `// Fast-led api\nCRGB leds[LED_AMT];\n
// Function use to convert HSV color's to rgb and then set them on the strip
void setColorHSV(unsigned int idx, uint16_t hue, uint8_t sat, uint8_t val){
    if(idx < 0 || idx > LED_AMT) return;
    leds[idx] = CHSV(hue, sat, val);
}
`,
    setupCode: `// Setups fastled-library\nFastLED.addLeds<NEOPIXEL, LED_PIN>(leds, LED_AMT);`,
    includeCode: `#include <FastLED.h>`,
    pushleds: "FastLED.show();",
    sethsv: "setColorHSV($$idx$$,$$hue$$,$$saturation$$,$$value$$);",
    reservedVariables: "leds,FastLED"
}