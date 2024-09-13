import Blockly from "blockly";
import { INodeModel } from "@nodes/definitions/Node";
import { Registry } from "@registry/Registry";
import { BlockData } from "./OnBlockUtils";
import { groupBy, mostFrequent } from "@utils/ArrayUtils";
import { Component, computed, reactive } from "vue";
import { useVariableStore } from "@webapp/stores/VariableStore";
import { ToolboxDefinition, ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { getBlocklyFields2Register } from "./fields/registry/FieldRegistry";
import { IDataSource } from "@nodes/definitions/DataSource";
import { $t } from "@localisation/Fluent";
import { useSettingsStore } from "@webapp/stores/SettingsStore";

// Names of custom element required for the blockly-blocks
export const DATA_OBJECT_NAME = "dataObj";
export const MODEL_OBJECT_NAME = "model";
export const CACHE_OBJECT_NAME = "cache";

// Name used for the element that contains substatements
export const BLOCKLY_SUBBLOCKY_NAME = "subblocks";

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

    const regex = /(%\d+)/g;
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
        const value = parseInt(capturedGroup.substring(1));

        // If a newline is found
        if (value === 0) {
            args.push({ "type": "input_dummy" })
            return `%${args.length}`;
        }

        // Gets the requested on-block-source
        const source = onBlockSources[value - 1];

        // Otherwise adds the required field and continues
        args.push({
            "type": getBlocklyFieldNameFromModel(source),
            "name": source.getKey(),
        });
        return `%${args.length}`;
    });

    // Builds the blockly required json
    return {
        "type": model.getModelName(),
        "message0": newMsg,
        "args0": args,
        "colour": model.getOnBlockSettings().color,

        "previousStatement": null,
        "nextStatement": null,
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
            const dataObj: BlockData = reactive({});

            const store = useVariableStore();

            const cacheObj: any = {};

            const unionOfSources = [...new Set([...model.getSources(), ...model.getOnBlockSources()])];

            // Sets the default values for the on-block sources
            for (let ds of unionOfSources) {
                let key = ds.getKey();

                if (dataObj[key] !== undefined) {
                    console.error(`Model '${model.getModelName()}' has multiple sources with the name '${key}'. Please give each source a unique name.`);
                    return;
                }

                dataObj[key] = ds.getDefaultValue();

                if (ds.calculateCache !== undefined)
                    cacheObj[key] = computed(() => ds.calculateCache!(store.variable2ValueMap, dataObj[key]));
            }

            // Adds the data object onto the block
            // Its made a Ref-Type to ensure that blocks and external components can react to changes
            this[DATA_OBJECT_NAME] = dataObj;
            // Adds the model to the block
            this[MODEL_OBJECT_NAME] = model;
            // Adds the cache object as a vuejs-computed value
            this[CACHE_OBJECT_NAME] = cacheObj;

            // Builds the block
            this.jsonInit(buildJSONObjectFor(model));

            // Ensures no source has the submodle-reserved name
            if(model.getOnBlockSources().some(x=>x.getKey()===BLOCKLY_SUBBLOCKY_NAME))
                throw new Error(`A blockly-datasource used the reserved name ${BLOCKLY_SUBBLOCKY_NAME}.`);

            if (model.hasSubNodes())
                this.appendStatementInput(BLOCKLY_SUBBLOCKY_NAME);

        },


        // Save/Load extra state is used to ensure copy/paste functionality is maintained
        saveExtraState: function() {
            return JSON.parse(JSON.stringify(this[DATA_OBJECT_NAME]));
        },
        loadExtraState:function (res: any){
            if(typeof res !== "object") return;
            if(typeof this[DATA_OBJECT_NAME] !== "object") return;

            for(let k of Object.keys(res))
                this[DATA_OBJECT_NAME][k] = res[k];
        }
    };
}

/**
 * Registers other blockly-blocks which dont fit as node-modules
 */
function registerOtherBlocks() {
    Blockly.Blocks['led_root_setup'] = {
        init: function () {
            this.appendDummyInput()
                .appendField($t('blockly_rootblock_setup'));
            this.setNextStatement(true, null);
            this.setColour(60);
            this.setDeletable(false);
            this.setEditable(false);
        }
    };

    Blockly.Blocks['led_root_loop'] = {
        init: function () {
            this.appendDummyInput()
                .appendField($t('blockly_rootblock_loop'));
            this.setNextStatement(true, null);
            this.setColour(60);
            this.setDeletable(false);
            this.setEditable(false);
        }
    };
}

// Registers the language to use for blockly
async function registerBlocklyLanguage(){

    switch(useSettingsStore().language){
        // English is default, therefor nothing is required
        case "en": default: return;
        case "de":
            const locale = (await import("blockly/msg/de")).default;
            Blockly.setLocale(locale);
            break;
    }

}

// Registers the theme used by the blockly workspace
function registerTheme() {
    Blockly.Theme.defineTheme('project_blockly_theme', {
        name: "project_blockly_theme",
        base: Blockly.Themes.Classic,
        componentStyles: {
            workspaceBackgroundColour: '#1e1e1e',
            toolboxBackgroundColour: 'rgb(51, 51, 51)',
            toolboxForegroundColour: '#fff',
            flyoutBackgroundColour: '#252526',
            flyoutForegroundColour: '#ccc',
            flyoutOpacity: 1,
            scrollbarColour: '#797979',
            insertionMarkerColour: '#fff',
            insertionMarkerOpacity: 0.3,
            scrollbarOpacity: 0.4,
            cursorColour: '#d0d0d0',
        }
    });
}

// Stores a list of loopup elements to use for the off-block data presentation
let offblockElements: { [key: string]: Component };
let datasource2fieldMapping: { dsClass: any, name: string }[]


/**
 * Registers custom fields to blockly that are used
 */
function registerBlocklyFields() {
    // List of all fields
    const list = getBlocklyFields2Register();

    // Creates a lookup object for off-block objects
    offblockElements = {};
    datasource2fieldMapping = [];

    // Iterates over all fields
    for (const fld of list) {
        /**
         * Supplies a simple fromJson function that does nothing but create a new field of the required type.
         * This is done because the export/import will happen without the blocks only on the models / datasources
         */
        (fld.BlocklyField as any).fromJson = () => new (fld.BlocklyField as any)();

        // Registers the blockly-field
        Blockly.fieldRegistry.register(fld.BlocklyField.FIELD_NAME, fld.BlocklyField as any);

        if (fld.DataSource.SOURCE_NAME === undefined)
            throw new Error(`Datasource '${fld.DataSource.constructor.name}' doesn't have a SOURCE_NAME defined. Please fix it by adding static SOURCE_NAME = '<Somename>';`);

        // Adds the loopUp element
        offblockElements[fld.DataSource.SOURCE_NAME] = fld.OffBlockView;

        // Adds the data source mapping
        datasource2fieldMapping.push({ dsClass: fld.DataSource, name: fld.BlocklyField.FIELD_NAME })
    }

}

/**
 * Creates the toolbox that is used for blockly
 * @returns the object which is used to define the blockly toolbox
 */
export function createToolbox(): ToolboxDefinition {

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
            "name": $t(`blockly_category_${category}`),
            "colour": color,
            "contents": modelsAsJson
        }
    }

    // Groups the models by their category's
    const groupedModels = groupBy(Registry.nodeModels, mdl => mdl.getOnBlockSettings().category);

    // Maps the categorys to json content (Representation for the toolbox)
    const categorysAsJson = Object.keys(groupedModels).map(name => groupedItemsToCategory(name, groupedModels[name]));

    return {
        "kind": "categoryToolbox",
        "contents": categorysAsJson as ToolboxItemInfo[]
    }
}

/**
 * Only call this once at the application start.
 * This registers all node-models to blockly as blockly blocks
 */
export function registerBlockly() {
    registerTheme();

    registerBlocklyLanguage();

    registerOtherBlocks();

    // Iterates over all models and registers them
    Registry.nodeModels.forEach(registerNodeModel);

    registerBlocklyFields();
}


/**
 * Takes in a
 * @param datasource 
 * @returns the corresponding name of the blockly-field which shall be used for that data source
 */
function getBlocklyFieldNameFromModel(ds: IDataSource<any, any, any>): string {

    // Finds the correct one
    for (const itm of datasource2fieldMapping) {
        if (ds instanceof itm.dsClass)
            return itm.name
    }

    throw new Error(`No blockly on-block field found for model ${ds.constructor.name}`);
}

/**
 * Using the datasource as input it returns the vue-component that shall be rendered for it off ite block
 * @param ds the datasource
 */
export function getOffBlockView(ds: IDataSource<any, any, any>): Component {
    return offblockElements[(ds as any).constructor.SOURCE_NAME];
}