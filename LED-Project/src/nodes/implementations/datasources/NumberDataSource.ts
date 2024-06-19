import { solveExpression } from "@mathSolver/index";
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

export class NumberDataSource implements IDataSource<string, number> {

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

    resolve(value: string, variables: { [name: string]: number; }): number {
        let res = solveExpression(value, variables, 1);

        // Ensures an int if required
        if(!this.isFloat && !Number.isInteger(res))
            res = Math.round(res);

        // Clamps the value
        if(this.config.min !== undefined && res < this.config.min)
            res = this.config.min;

        if(this.config.max !== undefined && res > this.config.max)
            res = this.config.max;
        
        return res;
    }

    export(value: string): string | number | boolean | object {
        return value;
    }

    import(value: string | number | boolean | object, variables: { [name: string]: number; }): string {
        return String(value);
    }
}