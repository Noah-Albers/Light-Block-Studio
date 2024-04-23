import { IDataSource } from "src/nodes/definitions/DataSource";

/**
 * TODO: Work in progress
 * 
 * This class is work in progress and should not be used for testing
 */

export type ColorDataConfig = {
    mode?: "rgb" | "hsv",

    info: string | undefined
}

/**
 * Color type
 * 
 * When in mode HSV:
 *  [Hue, Saturation, Vue] as normalized values of 0.00 to 1.00 (Precision, altho suggested, is not specified)
 * 
 * 
 * When in mode RGB:
 *  [Red, Green, Blue] as One-Byte values (0-255) (Integers)
 * 
 * Also the values can be strings to allowe for variables to be inserted. These will be dynamically resolved when requesting the data from the source
 */
export type VariableColorType = [String | number, String | number, String | number];

const Defaults: Required<ColorDataConfig> = {
    mode: "rgb",
    info: undefined
}

export class ColorDataSource implements IDataSource<VariableColorType> {

    private readonly config: Required<ColorDataConfig>;
    private readonly name: string;

    constructor(name: string, config: ColorDataConfig){
        // Merge provided config with defaults
        this.config = {...Defaults, ...config};
        this.name = name;
    }
    getUniqueSourceName(): string {
        return "color"
    }
    
    getKey(): string {
        return this.name;
    }

    getInformation(): string | undefined {
        return this.config.info;
    }

    export(value: VariableColorType): string | number | boolean | object {
        return value;
    }

    // If the current mode is RGB (True) or HSV (False)
    private get isRGB(){
        return this.config.mode === "rgb";
    }

    // Maximum value for color components
    private get maxColorValue(){
        return this.isRGB ? 255 : 1;
    }

    // Minimum value for color components
    private get minColorValue(){
        return 0;
    }

    import(value: string | number | boolean | object): VariableColorType {
        
        // Ensures an array
        if(!Array.isArray(value))
            return [255,0,0];

        // Ensures at least three elements
        while(value.length < 3)
            value.push(0);

        // Ensures at most three elements
        while(value.length > 3)
            value.pop();

        // Ensures numbers
        // Iterate over array elements
        for (let i = 0; i < value.length; i++) {
            if(typeof value[i] === "string")
                continue;

            value[i] = this.isRGB ? parseInt(value[i]) : parseFloat(value[i]);

            if(isNaN(value[i]))
                value[i] = 0;

            // Check if element is within range
            if(value[i] < this.minColorValue)
                value[i] = this.minColorValue;

            if(value[i] > this.maxColorValue)
                value[i] = this.maxColorValue;
        }

        return value as VariableColorType;
    }
}