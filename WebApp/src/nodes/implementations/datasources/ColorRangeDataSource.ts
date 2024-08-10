import { CachedColor, HSVBinaryColor, HSVColor, VariableColorType, areVariableColorsEqual, isVariableColor, validateAndFixColor } from "./ColorDataSource";
import { clamp } from "@utils/MathUtils";
import { solveExpression } from "@mathSolver/index";
import { IDataSource } from "@nodes/definitions/DataSource";
import { HSV2HEX } from "@webapp/utils/color/ColorConverter";

/**
 * Checks if a given value is of the type for a color-range
 */
export function isColorRangeColor(value: any) : value is ColorRangeType {
    if(typeof value !== "object" || Array.isArray(value) || value === null)
        return false;

    return isVariableColor(value.first) && isVariableColor(value.second);
} 

// Returns if the two given color ranges are equal (Value wise)
export function areColorRangesEqual(first: ColorRangeType, second: ColorRangeType) : boolean {
    return areVariableColorsEqual(first.first, second.first) && areVariableColorsEqual(first.second, second.second);
}

export type ColorDataConfig = {
    info: string | undefined,
    displayTitle: string
}

export type ColorRangeType = {
    first: VariableColorType,
    second: VariableColorType
};
export type HSVColorRange = {
    first: HSVColor,
    second: HSVColor
}
export type HSVBinaryColorRange = {
    first: HSVBinaryColor,
    second: HSVBinaryColor,
}

const Defaults: Required<ColorDataConfig> = {
    info: undefined,
    displayTitle: undefined as any
}


/**
 * Cache-Type which holds the cached data of a range color source
 * 
 * Meaning it holds the HSV-number values and the to string converted HEX-Value
 */
export type CachedRangeColor = {
    first: CachedColor,
    second: CachedColor
};

export class ColorRangeDataSource implements IDataSource<ColorRangeType, HSVBinaryColorRange, CachedRangeColor> {

    private readonly config: Required<ColorDataConfig>;
    private readonly name: string;
    private readonly defaultValue: ColorRangeType;

    public static SOURCE_NAME: string = "colorrange";

    constructor(name: string, defaultFirstValue: VariableColorType, defaultSecondValue: VariableColorType, config: ColorDataConfig){
        // Merge provided config with defaults
        this.config = {...Defaults, ...config};
        this.name = name;
        this.defaultValue = {
            first: defaultFirstValue,
            second: defaultSecondValue
        };
    }

    getDisplayTitle(): string {
        return this.config.displayTitle;
    }

    calculateCache(vars: { [key: string]: number; }, value: ColorRangeType): CachedRangeColor {

        const first = this.calculateColor(value.first, vars);
        const second = this.calculateColor(value.second, vars);

        const dpFirst = HSV2HEX(...first);
        const dpSecond = HSV2HEX(...second);

        return {
            first: {
                display: dpFirst,
                hsv: first
            },
            second: {
                display: dpSecond,
                hsv: second
            }
        }
    }


    private calculateColor(value: VariableColorType, variables: { [name: string]: number; }){
        return value.map(x=>{
            if(typeof x === "number")
                return clamp(x);
    
            return clamp(solveExpression(x, variables, 1));
        }) as HSVColor;
    }


    resolve(value: ColorRangeType, variables: { [name: string]: number; }): HSVColorRange {
        return {
            first: this.calculateColor(value.first, variables).map(x=>Math.round(255 * x)),
            second: this.calculateColor(value.second, variables).map(x=>Math.round(255 * x)),
        } as HSVBinaryColorRange
    }
    
    getKey(): string {
        return this.name;
    }

    getInformation(): string | undefined {
        return this.config.info;
    }

    getDefaultValue(): ColorRangeType {
        return {
            first: this.defaultValue.first.map(x=>x) as VariableColorType,
            second: this.defaultValue.second.map(x=>x) as VariableColorType,
        }
    }

    export(value: ColorRangeType): string | number | boolean | object {
        return value;
    }

    import(value: string | number | boolean | object, _: { [name: string]: number; }): ColorRangeType {
        if(typeof value !== "object" || Array.isArray(value))
            return this.getDefaultValue();

        return {
            first: validateAndFixColor((value as any).first),
            second: validateAndFixColor((value as any).second),
        }
    }
}