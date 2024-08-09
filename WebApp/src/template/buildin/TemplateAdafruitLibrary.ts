import { Template } from "@template/definitions/Template";

export const TemplateAdafruitLibrary: Template = {
    name: "Adafruit Library",
    author: "Noah Albers",

    blueprint: `#include <Adafruit_NeoPixel.h>
#define LED_PIN $$pin$$
#define LED_AMT $$amt$$

// Adafruit api
Adafruit_NeoPixel strip(LED_AMT, LED_PIN, NEO_GRB + NEO_KHZ800);

$$globals$$

// Function use to convert HSV color's to rgb and then set them on the strip
void setColorHSV(unsigned int idx, uint16_t hue, uint8_t sat, uint8_t val){
    strip.setPixelColor(idx, strip.ColorHSV(hue * 256, sat, val));
}

void setup(){
    // Setup's adafruit library
    strip.begin();

    // Start of setup-code
    $$setup$$
}

void loop(){
    $$loop$$
}`,

    hooks: {
        sethsv: `setColorHSV($$idx$$, $$hue$$, $$saturation$$, $$value$$);`,
        pushleds: "strip.show();"
    }

}