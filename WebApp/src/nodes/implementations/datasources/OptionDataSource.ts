import { IDataSource } from "@nodes/definitions/DataSource";

export type OptionType<Values extends string> = {[key in Values]: string}

export type OptionDataConfig<Values extends string> = {
    // Key: Language String (Name)
    values: OptionType<Values>,

    info: string | undefined,

    displayTitle: string
}

// Default configuration values
const Defaults : Required<OptionDataConfig<any>> = {
    info: undefined,

    values: undefined as any,

    displayTitle: undefined as any
}

export class OptionDataSource<Values extends string> implements IDataSource<string, Values, undefined> {

    private readonly config: Required<OptionDataConfig<Values>>;
    private readonly name: string;
    private readonly defaultValue: string;

    public static SOURCE_NAME: string = "options";

    constructor(name: string, defaultValue: string, config: OptionDataConfig<Values>){
        // Merge provided config with defaults
        this.config = {...Defaults, ...config};
        this.name = name;
        this.defaultValue = defaultValue;
    }

    getDisplayTitle(): string {
        return this.config.displayTitle;
    }

    getDefaultValue(): string {
        return this.defaultValue;
    }

    getKey(): string {
        return this.name;
    }

    getOptions(){
        return this.config.values;
    }

    getInformation(): string | undefined {
        return this.config.info;
    }

    private validateValue(value: string): string{
        if((this.config.values as any)[value] === undefined)
            return Object.keys(this.config.values)[0];
        return value;
    }

    resolve(value: string, variables: { [name: string]: number; }): Values {
        return this.validateValue(value) as Values;
    }

    export(value: string): string | number | boolean | object {
        return this.validateValue(value);
    }

    import(value: string | number | boolean | object, variables: { [name: string]: number; }): string {
        return this.validateValue(String(value));
    }
}