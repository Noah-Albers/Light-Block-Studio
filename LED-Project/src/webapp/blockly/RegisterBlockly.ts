import Blockly from "blockly";
import { INodeModel } from "@nodes/definitions/Node";
import { Registry } from "@registry/Registry";
import { OnBlockTextInput } from "./fields/OnBlockTextfield";
import { getBlocklyFieldNameFromModel } from "./DataSource2BlocklyField";
import { BlockData } from "./OnBlockUtils";
import { groupBy, mostFrequent } from "@utils/ArrayUtils";
import { ref } from "vue";

// Names of custom element required for the blockly-blocks
export const DATA_OBJECT_NAME = "dataObj";
export const MODEL_OBJECT_NAME = "model";


// TODO: test this function

/**
 * Builds the config for blockly's jsonInit method
 * @param name 
 * @param model 
 * @returns 
 */
function buildJSONObjectFor(model: INodeModel) {

    const msg = model.getBlockMessage();
    const onBlockSources = model.getOnBlockSources();

    const regex = /(\d+)/g;
    /**
     * JSON-Objects which represent the arguments for the blockly-message
     * @example Element
     * {
     *    "type": "field_input",
     *    "name": "SomeName",
     *    "text": "Iam the text of the element"
     * }
     */
    const args: {}[] = [];

    // Creates the new blockly-message and also adds the fields / arguments into an array
    let newMsg = msg.replace("\n", "%0").replace(regex, (_, capturedGroup: string) => {
        const value = parseInt(capturedGroup);

        // If a newline is found
        if (value === 0) {
            args.push({ "type": "input_dummy" })
            return `${args.length}`;
        }

        // Gets the requested on-block-source
        const source = onBlockSources[value - 1];

        // Otherwise adds the required field and continues
        args.push({
            "type": getBlocklyFieldNameFromModel(source),
            "name": source.getUniqueSourceName(),
        });
        return `${args.length}`;
    });

    // Builds the blockly required json
    return {
        "type": model.getModelName(),
        "message0": newMsg,
        "args0": args,
        "colour": model.getOnBlockSettings().color,
    }
}

/**
 * Registers a node-model to blockly as a blockly-block
 * @param model the model to register
 */
function registerNodeModel(model: INodeModel) {
    // Creates the blockly block
    Blockly.Blocks[model.getModelName()] = {
        init: function () {
            // Creates the data object
            const dataObj: BlockData = {};
            
            // Sets the default values for the on-block sources
            for (let ds of model.getOnBlockSources())
                dataObj[ds.getUniqueSourceName()] = ds.getDefaultValue();

            // Adds the data object onto the block
            // Its made a Ref-Type to ensure that blocks and external components can react to changes
            this[DATA_OBJECT_NAME] = ref(dataObj);
            // Adds the model to the block
            this[MODEL_OBJECT_NAME] = model;
        
            // Builds the block
            this.jsonInit(buildJSONObjectFor(model));
        }
    };
}


/**
 * Registers custom fields to blockly that are used
 */
function registerBlocklyFields() {
    // List of all fields
    const LIST = [OnBlockTextInput]


    // Iterates over all fields
    for (const fld of LIST) {
        /**
         * Supplies a simple fromJson function that does nothing but create a new field of the required type.
         * This is done because the export/import will happen without the blocks only on the models / datasources
         */
        fld.fromJson = () => new fld();

        Blockly.fieldRegistry.register(fld.FIELD_NAME, fld);
    }
}

/**
 * Creates the toolbox that is used for blockly
 * @returns the object which is used to define the blockly toolbox
 */
export function createToolbox(): object {

    // TODO: Figure out a way to name categorys properly

    /**
     * Uses the grouped items and maps them into a category-object for the toolbox.
     * @param category The name of the category.
     * @param models The grouped models
     * @returns An object representing the toolbox category.
     */
    function groupedItemsToCategory(category: string, models: INodeModel[]): object {

        // Gets the most used color as the category color
        const color = mostFrequent(models, mdl => mdl.getOnBlockSettings().color);

        // Maps the models to their block representation in the toolbox
        const modelsAsJson = models.map(mod => ({
            "kind": "block",
            "type": mod.getModelName()
        }))

        // Builds the toolbox category
        return {
            "kind": "category",
            "name": category,
            "colour": color,
            "contents": modelsAsJson
        }
    }

    // Groups the models by their category's
    const groupedModels = groupBy(Registry.nodeModels, mdl => mdl.getOnBlockSettings().category);

    // Maps the categorys to json content (Representation for the toolbox)
    const categorysAsJson = Object.keys(groupedModels).map(name=>groupedItemsToCategory(name, groupedModels[name]));

    return {
        "kind": "categoryToolbox",
        "contents": categorysAsJson
    }
}

/**
 * Only call this once at the application start.
 * This registers all node-models to blockly as blockly blocks
 */
export function registerBlockly() {
    // Iterates over all models and registers them
    Registry.nodeModels.forEach(registerNodeModel);

    registerBlocklyFields();
}