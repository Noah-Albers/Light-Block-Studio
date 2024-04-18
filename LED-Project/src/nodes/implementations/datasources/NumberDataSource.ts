import { IDataSource } from "src/nodes/definitions/DataSource";

export type NumberDataConfig = {
    // Type of number: "int" for integer or "float" for floating-point
    type?: "int" | "float",
    // Minimum value allowed (optional)
    min: number | undefined,
    // Maximum value allowed (optional)
    max: number | undefined,

    info: string | undefined
}

// Default configuration values
const Defaults : Required<NumberDataConfig> = {
    info: undefined,

    max: undefined,
    min: undefined,

    type: "float"
}

export class NumberDataSource implements IDataSource<String> {

    private readonly config: Required<NumberDataConfig>;
    private readonly name: string;

    constructor(name: string, config: NumberDataConfig){
        // Merge provided config with defaults
        this.config = {...Defaults, ...config};
        this.name = name;
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

    import(value: string | number | boolean | object): String {
        return String(value);
    }
}