

export interface IMathExprParser {

    /**
     * Evaluates the given
     * @param expression expression (Math) which can optionally have
     * @param variables defined to use by the expression.
     * 
     * 
     * @throws {Error} if the expression is invalid.
     * @throws {Error} if a variable is used which is not defined.
     * 
     * @return the resolved single number
     */
    evaluate(expression: string, variables: {[name: string]: number}) : number;

}