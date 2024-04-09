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

export interface INodeModel {

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