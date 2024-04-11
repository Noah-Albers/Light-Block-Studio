import { handleProgrammingError } from "../../errorSystem/ProgrammingErrorSystem";
import { Node, NodeTypes } from "../Nodes";
import { BaseToken, TokenTypes } from "../Token";

/**
 * Interface for a solver that processes an abstract syntax tree (AST) starting from a given node and computes a single numeric result.
 */
export interface ISolver {

    /**
     * Solves the abstract syntax tree starting from the specified node and computes a single numeric result.
     * @param node The root node of the abstract syntax tree to be solved.
     * @returns The computed numeric result.
     */
    solve(node: Node): number;
}
