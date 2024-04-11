import { Lexer } from "./implementations/Lexer";
import { Parser } from "./implementations/Parser";
import { Solver } from "./implementations/Solver";

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
 * @returns The result of evaluating the expression as a single number.
 * @throws {Error} if there are issues with the expression or variables.
 */
export function solveExpression(expr: string, variables: {[name: string]: number}): number {

    // Lexes the text into tokens
    const tokens = lexer.makeTokens(expr, variables);

    // Parses the tokens into an abstract syntax tree 
    const ast = parser.parse(tokens);

    // Uses the solver to evaluate the expression
    return solver.solve(ast);
}