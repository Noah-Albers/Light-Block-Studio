import { Lexer } from "./implementations/Lexer";
import { Parser } from "./implementations/Parser";
import { Solver } from "./implementations/Solver";
import { isValidVariableChar, isValidVariableFirstChar } from "./utils/Utils";

/**
 * Note: This is a self-contained modular system.
 * 
 * Meaning:
 * - It uses no file outside of "./"
 * - It exposes all things you will typically need through this index.ts file
 */


const solver = new Solver();
const parser = new Parser();
const lexer = new Lexer({
    decimalSeperator: "."
});

/**
 * Parses a mathematical expression and evaluates it using provided variables.
 * @param expr A string representing a mathematical expression.
 * @param variables An object containing variables as keys and their numeric values as values.
 * @param defaultOnError if this value is given and an error is thrown, this value is returned. Otherwise the error will be forwarded and also thrown
 * @returns The result of evaluating the expression as a single number.
 * 
 * @throws {Error} if there are issues with the expression or variables.
 */
export function solveExpression(expr: string, variables: { [name: string]: number }, defaultOnError: number | undefined = undefined): number {

    try {
        // Lexes the text into tokens
        const tokens = lexer.makeTokens(expr, variables);
    
        // Parses the tokens into an abstract syntax tree 
        const ast = parser.parse(tokens);
    
        // Uses the solver to evaluate the expression
        return solver.solve(ast);
    }catch(err){
        if(defaultOnError !== undefined) return defaultOnError;
        throw err;
    }
}

export function isValidVariableName(name: string): "firstChar" | "invalid" | true {

    if (name.length <= 0)
        return "invalid";

    if (!isValidVariableFirstChar(name[0]))
        return "firstChar";

    for (let i = 1; i < name.length; i++)
        if(!isValidVariableChar(name[i]))
            return "invalid";

    return true;
}