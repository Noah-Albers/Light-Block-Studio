import { solveExpression } from "@mathSolver/index";
import { IDataSource } from "@nodes/definitions/DataSource";

export type ExperimentalConfig = {
    info: string | undefined
}

// Default configuration values
const Defaults : Required<ExperimentalConfig> = {
    info: undefined
}

export class ExperimentalDataSource implements IDataSource<string, number> {

    private readonly config: Required<ExperimentalConfig>;
    private readonly name: string;
    private readonly defaultValue: string;

    public static readonly SOURCE_NAME = "TODO";

    constructor(name: string, defaultValue: string, config: ExperimentalConfig){
        // Merge provided config with defaults
        this.config = {...Defaults, ...config};
        this.name = name;
        this.defaultValue = defaultValue;
    }

    getDefaultValue(): string {
        return this.defaultValue;
    }

    getKey(): string {
        return this.name;
    }

    getInformation(): string | undefined {
        return this.config.info;
    }

    resolve(value: string, variables: { [name: string]: number; }): number {
        let res = solveExpression(value, variables, 1);

        return res;
    }

    export(value: string): string | number | boolean | object {
        return value;
    }

    import(value: string | number | boolean | object, variables: { [name: string]: number; }): string {
        return String(value);
    }
}