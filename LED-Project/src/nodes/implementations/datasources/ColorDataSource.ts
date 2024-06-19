import { solveExpression } from "@mathSolver/index";
import { IDataSource } from "@nodes/definitions/DataSource";
import { clamp } from "@utils/MathUtils";

export type ColorDataConfig = {
    info: string | undefined
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
    info: undefined
}

export class ColorDataSource implements IDataSource<VariableColorType, HSVColor> {

    private readonly config: Required<ColorDataConfig>;
    private readonly name: string;
    private readonly defaultValue: VariableColorType;

    constructor(name: string, defaultValue: VariableColorType, config: ColorDataConfig){
        // Merge provided config with defaults
        this.config = {...Defaults, ...config};
        this.name = name;
        this.defaultValue = defaultValue;
    }

    resolve(value: VariableColorType, variables: { [name: string]: number; }): HSVColor {
        return value.map(x=>{
            if(typeof x === "number")
                return clamp(x);

            return clamp(solveExpression(x, variables, 1));
        }) as HSVColor;
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