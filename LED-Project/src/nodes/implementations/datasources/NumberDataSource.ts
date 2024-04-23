import { IDataSource } from "@nodes/definitions/DataSource";

export type NumberDataConfig = {
    // Type of number: "int" for integer or "float" for floating-point
    type?: "int" | "float",
    // Minimum value allowed (optional)
    min?: number,
    // Maximum value allowed (optional)
    max?: number,

    info: string | undefined
}

// Default configuration values
const Defaults : Required<NumberDataConfig> = {
    info: undefined,

    max: undefined as any,
    min: undefined as any,

    type: "float"
}

export class NumberDataSource implements IDataSource<string> {

    private readonly config: Required<NumberDataConfig>;
    private readonly name: string;
    private readonly defaultValue: string;

    constructor(name: string, defaultValue: string, config: NumberDataConfig){
        // Merge provided config with defaults
        this.config = {...Defaults, ...config};
        this.name = name;
        this.defaultValue = defaultValue;
    }

    getDefaultValue(): string {
        return this.defaultValue;
    }

    getUniqueSourceName(): string {
        return "number";
    }

    getKey(): string {
        return this.name;
    }

    getInformation(): string | undefined {
        return this.config.info;
    }

    // Check if the number type is float
    private get isFloat() {
        return this.config.type === "float";
    }

    export(value: String): string | number | boolean | object {
        return value;
    }

    import(value: string | number | boolean | object): string {
        return String(value);
    }
}