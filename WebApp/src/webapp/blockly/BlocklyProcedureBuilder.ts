import { ProcedureWithOptions } from "@procedure/definitions/Procedure";
import { Block } from "blockly";
import { BLOCKLY_SUBBLOCKY_NAME, DATA_OBJECT_NAME, MODEL_OBJECT_NAME } from "./RegisterBlockly";
import { IDataSourceSupplier, INodeModel } from "@nodes/definitions/Node";
import { IDataSource } from "@nodes/definitions/DataSource";
import { BlockData, getBlockDataObject, getBlockModel } from "./OnBlockUtils";
import { useVariableStore } from "@webapp/stores/VariableStore";
import { solveExpression } from "@mathSolver/index";


class DataSourceSupplier implements IDataSourceSupplier {
    
    protected block!: Block;

    protected blockToSearchFor?: Block;
    public foundProcedure?: ProcedureWithOptions<any>;

    constructor(blockToSearchFor?: Block){
        this.blockToSearchFor = blockToSearchFor;
    }
    
    public get dataObj() : BlockData {
        const obj = getBlockDataObject(this.block) as BlockData;

        if(obj === undefined)
            throw new Error("Block "+this.block.id+"has no data-object defined");

        return obj;
    }
    
    public get model() : INodeModel {
        const obj = getBlockModel(this.block) as INodeModel;

        if(obj === undefined)
            throw new Error("Block "+this.block.id+"has no model defined");

        return obj;
    }

    setBlock(block: Block){
        this.block = block;
    }

    buildConfigOfSubnodes(): ProcedureWithOptions<any>[] {
        if(!this.model.hasSubNodes())
            throw new Error("Model has no subnodes but `buildConfigOfSubnodes()` was called.");

        // Gets the first block of the subblocks
        const subBlock = this.block.getInputTargetBlock(BLOCKLY_SUBBLOCKY_NAME);

        const cfg = buildProceduresOfBlock(subBlock, this.blockToSearchFor);

        if(cfg.foundProc !== undefined)
            this.foundProcedure = cfg.foundProc;

        return cfg.all;
    }
    
    // Gets the stored value from a datasource
    get<X>(source: IDataSource<any, X, any>): X {
        return source.resolve(this.dataObj![source.getKey()], useVariableStore().variable2ValueMap);
    }

    // Returns the value of a variable or the defaultValue if the variables doesn't exist
    getVariable(name: string, defaultValue: number = 0): number {
        return useVariableStore().variable2ValueMap[name] || defaultValue;
    }

    /**
     * Takes in a mathmatical expression (With some known variables) and tries to resolve it to a single number
     * @param exp the expression
     * @param defaultValue a default value to return if the expression results in an error
     * @returns 
     */
    solveExpression(exp: string, defaultValue: number = 0){
        return solveExpression(exp, useVariableStore().variable2ValueMap, defaultValue);
    }
}


/**
 * Method that takes in a blockly block and exports the procedure configs from it
 * 
 * If @param searchForSpecificBlock is set to a specific blockly-block the procedure with it's options of that specific block will be returned as
 * 
 * @returns and object with two entrys. First `all` which has the build config of the @param block and all connected blocks.
 * Further if @param searchForSpecificBlock is set to a blockly-block and that block is found, the `foundProc` will contain the procedure and options of that specific block
 */
export function buildProceduresOfBlock(block: Block | null, searchForSpecificBlock: Block | undefined = undefined) : {
    all: ProcedureWithOptions<any>[],
    foundProc: ProcedureWithOptions<any> | undefined
} {

    const supplier = new DataSourceSupplier(searchForSpecificBlock);
    const configs: ProcedureWithOptions<any>[] = [];

    let foundProc: ProcedureWithOptions<any> | undefined;

    while(block !== null){
        // Creates the configs
        supplier.setBlock(block);
        const cfg = supplier.model.createConfigWithProcedure(supplier) as ProcedureWithOptions<any>;
        // Prepares the config
        if(cfg.procedure.prepareConfig !== undefined)
            cfg.procedure.prepareConfig(cfg.options);

        configs.push(cfg);

        if(searchForSpecificBlock === block)
            foundProc = cfg;
        if(supplier.foundProcedure !== undefined)
            foundProc = supplier.foundProcedure;

        // Advances to the next block
        block = block.getNextBlock();
    }

    return {
        all: configs,
        foundProc
    };
}