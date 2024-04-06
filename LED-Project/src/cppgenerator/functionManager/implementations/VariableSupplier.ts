import { IVariableSupplier } from "../definitions/CppFnDefinitions";

export default class VariableSupplier implements IVariableSupplier{
    // List with variables that this holder knowns
    private knownVariables: string[] = [];

    /**
     * Adds a variable to the known variables
     * @param name
     * @returns the new variable name after duplication problems have been taken care of
     */
    public register(name: string) : string {
        let newName = name;
        let counter = 0;

        while(this.knownVariables.includes(newName))
            newName = name+"_"+(++counter);
        
        this.knownVariables.push(newName);
        return newName;
    }
}