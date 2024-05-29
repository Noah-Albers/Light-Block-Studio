import { ProcedureWithOptions } from "@procedure/definitions/Procedure";
import { Block } from "blockly";
import { BLOCKLY_SUBBLOCKY_NAME, DATA_OBJECT_NAME, MODEL_OBJECT_NAME } from "./RegisterBlockly";
import { IDataSourceSupplier, INodeModel } from "@nodes/definitions/Node";
import { IDataSource } from "@nodes/definitions/DataSource";
import { BlockData } from "./OnBlockUtils";


class DataSourceSupplier implements IDataSourceSupplier {
    
    protected block!: Block;

    protected blockToSearchFor?: Block;
    public foundProcedure?: ProcedureWithOptions<any>;

    constructor(blockToSearchFor?: Block){
        this.blockToSearchFor = blockToSearchFor;
    }
    
    public get dataObj() : BlockData {
        const obj = (this.block as any)[DATA_OBJECT_NAME].value as BlockData;

        if(obj === undefined)
            throw new Error("Block "+this.block.id+"has no data-object defined");

        return obj;
    }
    
    public get model() : INodeModel {
        const obj = (this.block as any)[MODEL_OBJECT_NAME] as INodeModel;

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
    
    get<X>(source: IDataSource<any, X>): X {
        return source.resolve(this.dataObj![source.getKey()]);
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
        const cfg = supplier.model.createConfigWithProcedure(supplier);
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