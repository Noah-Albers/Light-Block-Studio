import { LEDAPIHooks } from "@template/definitions/LEDAPI";

export const LEDAPIAdafruitPreset: LEDAPIHooks = {
    globalCode:
`// Adafruit api
Adafruit_NeoPixel strip(LED_AMT, LED_PIN, NEO_GRB + NEO_KHZ800);

// Function use to convert HSV color's to rgb and then set them on the strip
void setColorHSV(unsigned int idx, uint16_t hue, uint8_t sat, uint8_t val){
    strip.setPixelColor(idx, strip.ColorHSV(hue * 256, sat, val));
}`,
    setupCode: `// Setup's adafruit library\nstrip.begin();`,
    includeCode: `#include <Adafruit_NeoPixel.h>`,
    pushleds: "strip.show();",
    sethsv: "setColorHSV($$idx$$, $$hue$$, $$saturation$$, $$value$$);",
    reservedVariables: "strip,Adafruit_NeoPixel,NEO_GRB,NEO_KHZ800"
}