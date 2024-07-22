
/**
 * Registry for the following things:
 * 
 * NodeModels (Blockly block models)
 * Procedures
 */

import { registerNodeModels } from "./registers/RegisterNodeModels";
import { registerProcedures } from "./registers/RegisterProcedures";
import { registerTemplates } from "./registers/RegisterTemplates";

export const Registry = {
    // All procedures which
    procedures: registerProcedures(),

    // All node models
    nodeModels: registerNodeModels(),

    // All registered templates
    tempaltes: registerTemplates()
}
