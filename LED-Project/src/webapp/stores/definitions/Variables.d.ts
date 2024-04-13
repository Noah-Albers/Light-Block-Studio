export type Variable = {
    name: string,

    /**
     * If the name is somehow invalid
     * 
     * "invalid" - the name contains illigal symboles
     * "firstChar" - the starting character of the variable is invalid. (Might be a number)
     * "reserved" - the name is reserved by system internal components
     * "duplicated" - multiple variables have the same name
     *  undefined - no error, everything is fine
     */
    nameProblem: undefined | VariableNameProblem,
    // The empty "" means that a none-number value has been given
    value: number | String,
}

export type VariableNameProblem = "invalid" | "firstChar" | "reserved" | "duplicated";

export type SystemVariable = {
    name: string,
    value: number,

    // A string that explaines the variable
    info: string
}