import { solveExpression } from "@mathSolver/index";
import { VariableColorType } from "@nodes/implementations/datasources/ColorDataSource";
import { clamp } from "@utils/MathUtils";
import { useVariableStore } from "@webapp/stores/VariableStore";
import { HSV2HEX } from "./ColorConverter";

/**
 * Takes in a value and validates their preview string (Used to display the HSV color in #ABC (Hex) mode)
 * 
 * @param value the raw hsv value
 * @returns the hex color with a sharp before (Eg. #ff00ff)
 */
export function calculatePreview(value: VariableColorType) {

    const store = useVariableStore();

    const resolvedValue = value.map((itm: number | string) => {
        if (typeof itm === "number") return clamp(itm);

        return clamp(solveExpression(itm, store.variable2ValueMap, 1));
    }) as [number, number, number];

    // Calculates the hex string
    return HSV2HEX(...resolvedValue);
}