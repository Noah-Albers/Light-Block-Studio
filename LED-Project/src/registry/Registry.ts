
/**
 * Registry for the following things:
 * 
 * NodeModels (Blockly block models)
 * Procedures
 */

import { registerNodeModels } from "./registers/RegisterNodeModels";
import { registerProcedures } from "./registers/RegisterProcedures";

export const Registry = {
    // All procedures which
    procedures: registerProcedures(),

    // All node models
    nodeModels: registerNodeModels()
}
