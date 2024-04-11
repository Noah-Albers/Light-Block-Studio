import { BaseToken } from "./Token";

// Define string literal union types for node types
type NodeTypes = 'NUMBER' | 'BINOP' | 'UNARY';

// Define the union type for nodes in the abstract syntax tree (AST)
export type Node = NumberNode | UnaryOpNode | BinOpNode;

// Node representing a numeric value
export interface NumberNode {
    value: number;           // The numerical value of the node
    type: 'NUMBER';          // Type of node, indicating it's a number node
}

// Node representing a unary operation
export interface UnaryOpNode {
    isNegative: boolean;     // Indicates if the unary operation is negation
    node: Node;              // The node on which the unary operation is applied
    type: 'UNARY';           // Type of node, indicating it's a unary operation node
}

// Node representing a binary operation
export interface BinOpNode {
    leftNode: Node;          // The left operand of the binary operation
    opToken: BaseToken;      // Token representing the operator of the binary operation
    rightNode: Node;         // The right operand of the binary operation
    type: 'BINOP';           // Type of node, indicating it's a binary operation node
}