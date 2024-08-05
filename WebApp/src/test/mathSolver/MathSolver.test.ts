import { solveExpression } from "@mathSolver/index";
import { assertException, assertNumbersEqual } from "@test/TestUtils";

export function runTest_mathSolver() {
    // Test cases for error handling
    assertException("Error: Variable 'x' couldn't be found", () => solveExpression("x", {}));
    assertException("Error: Variables can't start with numbers.", () => solveExpression("2a + b", { a: 2, b: 3 }));

    // Test cases for basic arithmetic operations
    assertNumbersEqual(5, solveExpression("a + b", { a: 3, b: 2 }));
    assertNumbersEqual(21, solveExpression("a + b * 5", { a: 1, b: 4 }));

    // Test cases for precedence and parentheses
    assertNumbersEqual(14, solveExpression("2 + 3 * 4", {}));
    assertNumbersEqual(20, solveExpression("(2 + 3) * 4", {}));

    // Test cases for negative numbers
    assertNumbersEqual(-1, solveExpression("x - 3", { x: 2 }));
    assertNumbersEqual(0, solveExpression("x - x", { x: 0 }));

    // Test cases for decimal numbers
    assertNumbersEqual(3, solveExpression("x / 2", { x: 6 }));
    assertNumbersEqual(0.5, solveExpression("x / 2", { x: 1 }));

    // Test cases for invalid expressions
    assertException("Error: Expected number couldn't be found", () => solveExpression("2 + * 3", {}));
    assertException("Error: Expected number couldn't be found", () => solveExpression("a + ", { a: 2 }));
}