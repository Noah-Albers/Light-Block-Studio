import { Template } from "@template/definitions/Template";

export const TemplateSwitchableAnimations: Template = {
    name: "Switchable Animations",
    author: "Noah Albers",

    blueprint: `
$$ledInclude$$
#define LED_PIN $$pin$$
#define LED_AMT $$amt$$
#define BUTTON_PIN $$button_pin$$

$$ledGlobal$$

// Counter to select the animation
static long counter = 0;
// To signal that one animation shall stop
static bool fullBreak = false;

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
    if(fullBreak)
      return true;
    long end = millis() + del;

    while(millis() < end){
        delay(10);

        if(isButtonPressed()){
            fullBreak = true;
            return true;
        }
    }
    
    return false;
}

void setup(){
    
    $$ledSetup$$
    
    // Note: You may want to change INPUT_PULLUP to a different value
    // if your button is connected differently
    pinMode(BUTTON_PIN, INPUT_PULLUP);

    // Start of setup-code
    $$setup$$

}

void loop(){
    if(fullBreak){
      ++counter;
      fullBreak = false;
    }
      
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