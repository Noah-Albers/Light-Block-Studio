
/**
 * Registry for the following things:
 * 
 * NodeModels (Blockly block models)
 * Procedures
 */

import { registerNodeModels } from "./registers/RegisterNodeModels";
import { registerProcedures } from "./registers/RegisterProcedures";

export const Registry = {
    procedures: registerProcedures(),
    nodeModels: registerNodeModels()
}
