
/*export type Hint =
    // The data should be displayed on the block
    "on-block" |
    // The data should be displayed off the block
    "off-block";*/

export interface IDataSource<Type> {
    // TODO: Maybe use later
    //private hints: Hint[];

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
    import(value: string | boolean | number | object) : Type;
}