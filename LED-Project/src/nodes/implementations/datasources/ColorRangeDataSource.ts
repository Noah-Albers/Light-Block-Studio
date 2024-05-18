import { IDataSource } from "src/nodes/definitions/DataSource";
import { VariableColorType, validateAndFixColor } from "./ColorDataSource";

export type ColorDataConfig = {
    info: string | undefined
}

export type ColorRangeType = {
    first: VariableColorType,
    second: VariableColorType
};

const Defaults: Required<ColorDataConfig> = {
    info: undefined
}

export class ColorRangeDataSource implements IDataSource<ColorRangeType> {

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

    import(value: string | number | boolean | object): ColorRangeType {
        
        if(typeof value !== "object" || Array.isArray(value))
            return this.getDefaultValue();

        return {
            first: validateAndFixColor((value as any).first),
            second: validateAndFixColor((value as any).second),
        }
    }
}