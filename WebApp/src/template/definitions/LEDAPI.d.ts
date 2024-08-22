export type LEDAPIHooks = {
    
    /**
     * Is used to send the internally set led array out to the hardware (LED-Stripe)
     */
    pushleds: string,

    /**
     * Used to set the led at a given index to a specific HSV (Hue Saturation Value) color
     * The h,s,v values are integers between 0 and 255 (Inclusive)
     * 
     * Available variables:
     *  - $$idx$$ (Index of the led, starting from 0 for the first)
     *  - $$hue$$, $$saturation$$, $$value$$
     */
    sethsv: string,

    // Static code to add to the final output
    includeCode: string, // Used to include header files
    globalCode: string, // Used to add global functions
    setupCode: string, // Used to add setup code for the led api

    // Variable names that shall be reserved to be used by the led system
    // Seperated by "," (Comma)
    reservedVariables: string
    
}