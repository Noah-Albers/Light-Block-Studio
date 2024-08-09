
/**
 * Registry for the following things:
 * 
 * NodeModels (Blockly block models)
 * Procedures
 */

import { registerNodeModels } from "./registers/RegisterNodeModels";
import { registerProcedures } from "./registers/RegisterProcedures";
import { registerTemplates } from "./registers/RegisterTemplates";

type RegisteryType = {
    procedures: ReturnType<typeof registerProcedures>,
    nodeModels: ReturnType<typeof registerNodeModels>,
    templates: ReturnType<typeof registerTemplates>
}

// Called on the initial setup to initialize most stuff
export function setupRegistery(isDeveloper: boolean){

    Registry = {
        // All procedures which
        procedures: registerProcedures(),
    
        // All node models
        nodeModels: registerNodeModels(isDeveloper),
    
        // All registered templates
        templates: registerTemplates()
    } as const
}

/**
 * Note: Only available after the initial setup has been run. Dont try to use it before.
 * Tho almost all code will run after that. So you probably dont need to worry about that.
 */
export let Registry: RegisteryType = undefined as any;

