import { Template } from "@template/definitions/Template";

export const TemplateSwitchableAnimations: Template = {
    name: "Switchable Animations",
    author: "Noah Albers",

    blueprint: `
#include <FastLED.h>
#define LED_PIN $$pin$$
#define LED_AMT $$amt$$
#define BUTTON_PIN $$button_pin$$

// Fast-led api
CRGB leds[LED_AMT];

// Counter to select the animation
static long counter = 0;

$$globals$$

// Checks if the given button is pressed
bool isButtonPressed(){
    static bool btnState = false;
    bool readState = digitalRead(BUTTON_PIN);

    // Logic that checks if the button was pressed and released again
    if(btnState && !readState){
        btnState = false;
        return true;
    }
    
    if(readState)
        btnState = true;

    return false;
}


bool myDelay(long del){
    long end = millis() + del;

    while(millis() < end){
        delay(10);

        if(isButtonPressed()){
            ++counter;
            return true;
        }
    }
    
    return false;
}

void setup(){
    // Setups fastled-library
    FastLED.addLeds<NEOPIXEL, LED_PIN>(leds, LED_AMT);
    
    // Note: You may want to change INPUT_PULLUP to a different value
    // if your button is connected differently
    pinMode(BUTTON_PIN, INPUT_PULLUP);

    // Start of setup-code
    $$setup$$

}

void loop(){
    switch(counter){
        $$loop$$

        default:
            counter = 0;
            break;
    }
}`,

hooks: {
    sleep: `if(myDelay($$time$$)) return;`,
    loop: `case $$count$$:
   $$code$$
    break;`
},

variables: {
    "button_pin": 2
}

}