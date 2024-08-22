import { Template } from "@template/definitions/Template";

export const TemplateDefault: Template = {
    name: "Default Template",
    author: "Noah Albers",

    blueprint: `$$ledInclude$$
#define LED_PIN $$pin$$
#define LED_AMT $$amt$$

$$ledGlobal$$

$$globals$$

void setup(){
    $$ledSetup$$
    
    // Start of setup-code
    $$setup$$

}

void loop(){
    $$loop$$
}`,

    hooks: {
        pushleds: "$$code$$",
        sleep: "delay($$time$$);",
        sethsv: "$$code$$",
        millis: "millis()",

        setup: "$$code$$",
        loop: "$$code$$"
    }

}