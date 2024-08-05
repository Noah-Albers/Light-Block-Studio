import { Node } from "../definitions/Node";
import { ISolver } from "../definitions/Solver";
import { BaseToken } from "../definitions/Token";

export class Solver implements ISolver {

     public solve(node: Node) : number {
        switch(node.type){
            case "BINOP":
                 // Resolved the left and right first
                var left = this.solve(node.leftNode);
                var right = this.solve(node.rightNode);

                return this.performOperation(left, node.opToken, right);
            case "UNARY":
                return this.solve(node.node) * (node.isNegative ? -1 : 1);
            case "NUMBER":
                return node.value; 
        }
    }

    /**
     * Takes in a left number, a token (Operations) and a right number.
     * @returns then returns the result of the operations as a number
     */
    private performOperation(left: number, token: BaseToken, right: number) : number{
        switch(token.type){
            case "PLUS": default:
                return left + right;
            case "MINUS":
                return left - right;
            case "MUL":
                return left * right;
            case "DIV":
                return left / right;
        }
    }
}