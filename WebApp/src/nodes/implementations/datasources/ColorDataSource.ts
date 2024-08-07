import { solveExpression } from "@mathSolver/index";
import { IDataSource } from "@nodes/definitions/DataSource";
import { clamp } from "@utils/MathUtils";
import { HSV2HEX } from "@webapp/utils/color/ColorConverter";

export type ColorDataConfig = {
    info: string | undefined,
    displayTitle: string
}

/**
 * HSV Color which is stored normalized (0-1) if stored as a number.
 * Also it can be stored as a string to allow for calulations and to use variable which are defined using the variable store
 * 
 * These will then be calculated on-the-fly
 */
export type VariableColorType = [string | number, string | number, string | number];
/**
 * Normalized values for HUE, Saturation and Value to a range between 0 - 1
 */
export type HSVColor = [number, number, number];

/**
 * Normalized values for Hue, Saturation and Value as integer from 0 to 255
 */
export type HSVBinaryColor = [number, number, number];

/**
 * Cache of a color
 */
export type CachedColor = {
    // The HEX-Display string that can be passed to css (Example: #AA00FF)
    display: string,
    // The HSV-Color
    hsv: HSVColor
};

/**
 * Takes in two variable color types and returns if they are equal (Value wise)
 */
export function areVariableColorsEqual(first: VariableColorType, second: VariableColorType): boolean {
    for(let i=0;i<3;i++)
        if(first[i] !== second[i]) return false;
    
    return true;
}

/**
 * Method to take in any value and validate it as a VariableColorType
 * If the value is simelar to a variablecolortype, it will be fixed and returned,
 * 
 * if too much difference is given, a default value will be returned
 * @param value 
 * @returns 
 */
export function validateAndFixColor(value: any) : VariableColorType {
    // Ensures an array
    if(!Array.isArray(value))
        return [1,1,1];

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

        value[i] = parseFloat(value[i]);

        if(isNaN(value[i]))
            value[i] = 0;

        // Normalizes values
        value[i] = clamp(value[i],0,1);
    }

    return value as VariableColorType;
}

/**
 * Validates if the given value is a VariableColorType. Tho it's actual numbers are not validated. So they could be way off
 */
export function isVariableColor(value: any): value is VariableColorType {
    if(!Array.isArray(value)) return false;
    if(value.length != 3) return false;
    
    for(let i=0;i<value.length;i++)
        if(!["string","number"].includes(typeof value[i]))
            return false;

    return true;
}

const Defaults: Required<ColorDataConfig> = {
    info: undefined,
    displayTitle: undefined as any
}

export class ColorDataSource implements IDataSource<VariableColorType, HSVBinaryColor, CachedColor> {

    private readonly config: Required<ColorDataConfig>;
    private readonly name: string;
    private readonly defaultValue: VariableColorType;

    public static SOURCE_NAME: string = "color";

    constructor(name: string, defaultValue: VariableColorType, config: ColorDataConfig){
        // Merge provided config with defaults
        this.config = {...Defaults, ...config};
        this.name = name;
        this.defaultValue = defaultValue;
    }

    getDisplayTitle(): string {
        return this.config.displayTitle;
    }

    calculateCache(vars: { [key: string]: number; }, value: VariableColorType): CachedColor {
        const hsv = this.calculateColor(value, vars);

        const display = HSV2HEX(...hsv);

        return {
            hsv,
            display
        }
    }

    private calculateColor(value: VariableColorType, variables: { [name: string]: number; }){
        return value.map(x=>{
            if(typeof x === "number")
                return clamp(x);
    
            return clamp(solveExpression(x, variables, 1));
        }) as HSVColor;
    }

    resolve(value: VariableColorType, variables: { [name: string]: number; }): HSVBinaryColor {
        return this.calculateColor(value, variables).map(x=>Math.round(255 * x)) as HSVBinaryColor;
    }

    getKey(): string {
        return this.name;
    }

    getInformation(): string | undefined {
        return this.config.info;
    }

    getDefaultValue(): VariableColorType {
        return this.defaultValue.map(x=>x) as VariableColorType;
    }

    export(value: VariableColorType): string | number | boolean | object {
        return value;
    }

    import(value: string | number | boolean | object, _: { [name: string]: number; }): VariableColorType {
        return validateAndFixColor(value);
    }
}