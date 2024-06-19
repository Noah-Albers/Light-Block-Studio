import { HSVColor, VariableColorType, areVariableColorsEqual, isVariableColor, validateAndFixColor } from "./ColorDataSource";
import { clamp } from "@utils/MathUtils";
import { solveExpression } from "@mathSolver/index";
import { IDataSource } from "@nodes/definitions/DataSource";

/**
 * Checks if a given value is of the type for a color-range
 */
export function isColorRangeColor(value: any) : value is ColorRangeType {
    if(typeof value !== "object" || Array.isArray(value))
        return false;

    return isVariableColor(value.first) && isVariableColor(value.second);
} 

// Returns if the two given color ranges are equal (Value wise)
export function areColorRangesEqual(first: ColorRangeType, second: ColorRangeType) : boolean {
    return areVariableColorsEqual(first.first, second.first) && areVariableColorsEqual(first.second, second.second);
}

export type ColorDataConfig = {
    info: string | undefined
}

export type ColorRangeType = {
    first: VariableColorType,
    second: VariableColorType
};
export type HSVColorRange = {
    first: HSVColor,
    second: HSVColor
}

const Defaults: Required<ColorDataConfig> = {
    info: undefined
}

export class ColorRangeDataSource implements IDataSource<ColorRangeType, HSVColorRange> {

    private readonly config: Required<ColorDataConfig>;
    private readonly name: string;
    private readonly defaultValue: ColorRangeType;

    constructor(name: string, defaultFirstValue: VariableColorType, defaultSecondValue: VariableColorType, config: ColorDataConfig){
        // Merge provided config with defaults
        this.config = {...Defaults, ...config};
        this.name = name;
        this.defaultValue = {
            first: defaultFirstValue,
            second: defaultSecondValue
        };
    }

    resolve(value: ColorRangeType, variables: { [name: string]: number; }): HSVColorRange {
        const mapper = (val: VariableColorType)=>val.map(x=>{
            if(typeof x === "number")
                return clamp(x);

            return clamp(solveExpression(x, variables, 1));
        }) as HSVColor;

        return {
            first: mapper(value.first),
            second: mapper(value.second),
        } as HSVColorRange
    }

    getUniqueSourceName(): string {
        return "colorrange"
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