
/*export type Hint =
    // The data should be displayed on the block
    "on-block" |
    // The data should be displayed off the block
    "off-block";*/

export interface IDataSource<Type, ResolvedType, Cache = any> {
    // TODO: Maybe use later
    //private hints: Hint[];

    // TODO: Required
    // public static readonly SOURCE_NAME: string;

    /**
     * Finalizes the value and calculates it. For example string formulars will be calculates with variables and such
     * @param value 
     */
    resolve(value: Type, variables: {[name: string]: number}): ResolvedType;

    /**
     * @returns a string which will be used as a key to store values later on.
     * Meaning that this is not a key/name for the whole class but for a single instance.
     */
    getKey() : string;

    /**
     * @returns the default value of the field
     */
    getDefaultValue() : Type;

    /**
     * @returns a string that explaines the information about this data source.
     * Note that it should be user (developer) supplied and unique
     */
    getInformation() : string | undefined;

    /**
     * Takes in the value to serialize (Export)
     * @returns the serialized value as a json printable
     */
    export(value: Type) : string | boolean | number | object;
    /**
     * Takes in a json printable and returns the deserialized (imported) value
     */
    import(value: string | boolean | number | object, variables: {[name: string]: number}) : Type;

    // TODO: Comment
    calculateCache?(vars: {[key: string]: number}, value: Type): Cache; 
}