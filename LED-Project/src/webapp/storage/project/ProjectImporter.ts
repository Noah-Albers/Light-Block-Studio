import { Block, BlockSvg, utils as BlocklyUtils } from "blockly";
import { ExportedNodeStackType, ExportedNodeType, ExportedProjectType, ExportedSettingsType, ExportedVariablesType, ExportedWorkspaceType, ProjectSchema } from "./ProjectSchema";
import { Registry } from "@registry/Registry";
import { getRootBlocks } from "@webapp/utils/blockly/BlockUtils";
import { getBlockDataObject, getBlockModel } from "@webapp/blockly/OnBlockUtils";
import { useVariableStore } from "@webapp/stores/VariableStore";
import { useProjectStore } from "@webapp/stores/ProjectStore";
import { Coordinate } from "blockly/core/utils/coordinate";

// Imports the project settings
function importProjectSettings(filename: string, data: ExportedSettingsType){
    useProjectStore().importData(filename, data);
}

// Imports the variables and returns the new map which can be used to import the nodes
function importVariables(data: ExportedVariablesType){

    const store = useVariableStore();

    // Removes old variables
    store.clearAllVariables();

    // Adds the new variables
    for(let nVar of data)
        store.addNewVariable(nVar.name, nVar.value);
    
    return store.variable2ValueMap;
}

// Takes in exported workspace data and the already importet variables and  then loads the workspace from them
async function importWorkspace(data: ExportedWorkspaceType, variables: {[name: string]: number}){

    const { loop, other, setup, workspace: ws } = await getRootBlocks();

    // Takes in a single node and retreives the blockly-object from it
    function parseNode(node: ExportedNodeType, appendTo?: BlockSvg){
        // Ignores unregistered nodes
        if(Registry.nodeModels.find(nd=>nd.getModelName() === node.type) === undefined)
            return;

        // Creates a new block
        const block = ws.newBlock(node.type);
        block.initSvg();
        block.render();	

        // Tries to load the data
        const mdl = getBlockModel(block)!;
        const dataObj = getBlockDataObject(block)!;

        // Gets all sources
        const sources = [...new Set([...mdl.getSources(), ...mdl.getOnBlockSources()])];

        for(let src of sources){
            try {
                dataObj[src.getKey()] = src.import(node.data[src.getKey()], variables);
            }catch(err){
                console.warn("Error importing datasource, falling back on default",err);
            }
        }

        if(appendTo !== undefined)
            appendTo.nextConnection.connect(block.previousConnection);

        return block;
    }

    // Takes in a stack of top blocks, loads them and then adds them to the workspace
    function importTopBlock(main: ExportedNodeStackType, attachTo?: BlockSvg){

        // Parses all blocks
        let head = attachTo;
        let previous = attachTo;

        for(let nd of main.nodes){
            let res = parseNode(nd, previous);

            if(head === undefined)
                head = res;

            if(res !== undefined)
                previous = res;
        }

        if(head === undefined)
            return;

        // Moves the head into position
        head.moveTo(new BlocklyUtils.Coordinate(main.x, main.y));
    }

    // Clears the workspace

    // Deletes all blocks that are not the setup and root
    for(let blg of other)
        blg.dispose();

    // Deletes the blocks connected to setup
    const afterSetup = setup.getNextBlock();
    if(afterSetup !== null)
        afterSetup.dispose();

    // Deletes the blocks connected to loop
    const afterLoop = setup.getNextBlock();
    if(afterLoop !== null)
        afterLoop.dispose();

    // Imports setup, loop and any other top blocks
    importTopBlock(data.setup, setup);
    importTopBlock(data.loop, loop);
    data.other.forEach(blg=>importTopBlock(blg));
}

// Function to check if any nodes of the given workspace are not found
function checkUnrecognizedNodes(schema: ExportedWorkspaceType){
    // Find exported nodes which use a node that doesn't exist
    function findNonExistentOfNodeStack(nodeStack: ExportedNodeType[]){
        return (
            nodeStack.filter(itm=>Registry.nodeModels.find(reg=>reg.getModelName() === itm.type) === undefined)
            .map(node=>node.type)
        );
    }

    // Gets a list of all node types which dont exist but are required to fully load t he config
    const noneExistentNodes = [
        schema.loop.nodes,
        schema.setup.nodes,
        ...schema.other.map(x=>x.nodes)
    ].map(findNonExistentOfNodeStack).flatMap(x=>x);

    // Gets the amount of nodes
    const len = noneExistentNodes.length;

    return {
        amount: len,
        names: [...new Set(noneExistentNodes)]
    }
}

type ImportResult = {
    success: boolean,
    message?: string
}

export async function importProject(filename: string, raw: unknown, doAskUser: (msg: string, btnTrue: string, btnFalse: string)=>Promise<boolean>) : Promise<ImportResult>{

    if(typeof raw === "string"){
        // Tries to parse
        try {
            raw = JSON.parse(raw);
        }catch(err){
            return {
                success: false,
                message: `${err}`
            }
        }
    }

    // Tries to import the project
    var res = ProjectSchema.safeParse(raw);
    if(!res.success)
        return {
            message: res.error.message,
            success: false
        };

    // Checks if there are any unrecognized nodes
    const noneExistentNodes = checkUnrecognizedNodes(res.data.workspace);
    if(noneExistentNodes.amount > 0){
        // Askes the user if he wants to abort importing the project or if he wants to continue
        const msg = `Warning: There are ${noneExistentNodes.amount} Nodes which have a type that we don't recognize. These are: '${noneExistentNodes.names.join("', '")}'. Maybe there are Plugins you still need to enable? Do you still want to load the Project? The unrecognized nodes will be removed.`;

        const askRes = await doAskUser(msg, "Continue at my own risk", "Abort");

        if(askRes !== true)
            return {
                success: false,
                message: undefined   
            }
    }
    
    // 1. Import variables
    const vars = importVariables(res.data.variables);
    
    // 2. Import project settings
    importProjectSettings(filename,res.data.settings);
    
    // 3. Import blocks
    importWorkspace(res.data.workspace, vars);

    return {
        success: true
    }
}
