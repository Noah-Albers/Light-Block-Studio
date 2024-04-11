import { ProcedureWithOptions } from "@procedure/definitions/Procedure";
import { IDataSource } from "./DataSource";

// TODO: Add support for custom blockly mutators later on

/**
 * The elements which are used to define how the node shall be displayed.
 * 
 * Useable are simple strings which are displayed,
 * a newline to signal a
 */
export type Brick = string | "\n" | IDataSource; 

export interface IDataSourceSupplier {

    /**
     * Usesed to get data of a data source
     * @param source 
     */
    get<X>(source: IDataSource) : X;
}

/**
 * Defines some settings for the blockly block which are used during construction
 */
export type OnBlockSettings = {
    /**
     * Which category the block should be sorted to inside the toolbox
     */
    category: string,
    /**
     * The color HUE which will be the primary color of the block.
     * Values between 0-360
     */
    color: number
}

export interface INodeModel {
    /**
     * @returns settings that are used to configure the block
     */
    getOnBlockSettings() : OnBlockSettings;

    /**
     * @returns a list of all Bricks which shall be used to construct the blockly block. 
     */
    getOnBlockConstruction() : Brick[];

    /**
     * @returns all datasources which the node shall use
     */
    getSources() : IDataSource;

    /**
     * This is called once the node shall be evaluated
     * 
     * @param supplier the object to access to get data from the ui
     * @returns a procedure with options to call that procedure.
     */
    createConfigWithProcedure(supplier: IDataSourceSupplier) : ProcedureWithOptions
}