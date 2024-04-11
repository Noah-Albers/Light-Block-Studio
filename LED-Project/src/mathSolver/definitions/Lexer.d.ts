import { Token } from "./Token";

export type LexerSettings = {
    // Seperator for decimals
    decimalSeperator: "." | ",",
}

/**
 * Interface for lexical analysis (tokenization) of raw expressions.
 * The Lexer interprets the raw expression into tokens which can then be used for further parsing.
 */
export interface ILexer {

    /**
     * Tokenizes the raw expression into an array of tokens.
     * @param expression The raw expression to be tokenized.
     * @param variables The varaibles that the lexer has access to. These can then be directly replaced with their actual value instead of remaining as a variable.
     * 
     * @returns An array of tokens generated from the expression.
     */
    makeTokens(expression: string, variables: { [name: string]: number }): Token[];
}