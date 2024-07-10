import { INodeModel } from "@nodes/definitions/Node";
import { Block } from "blockly";
import { ComputedRef, Ref, ref } from "vue";
import { CACHE_OBJECT_NAME, DATA_OBJECT_NAME, MODEL_OBJECT_NAME } from "./RegisterBlockly";

// Type that indicates that this is vue-js reactive data that is stored on the block
export type BlockData = {[key: string]: any};
// Type that indicates that this is vue-js computed data that is stored on the block.
// IT IS READ-ONLY
export type Cache = {[key: string]: any}

// Gets the cache of a specific source of a block
export function getBlockCacheOfSource<T>(block: Block, name: string) : ComputedRef<T> {
    return getBlockCache(block)[name];
}

// Gets the cache of a specific block
export function getBlockCache(block: Block) : Cache {
    return (block as any)[CACHE_OBJECT_NAME];
}

/**
 * Takes in a
 * @param block blockly block
 * @returns the custom led project data object of the block
 */
export function getBlockDataObject(block: Block): BlockData {
    return (block as any)[DATA_OBJECT_NAME];
}

/**
 * Takes in a
 * @param block blockly block 
 * @returns the NodeModel which was used to build the block or undefined if no model could be found
 */
export function getBlockModel(block: Block) : INodeModel | undefined {
    return (block as any)[MODEL_OBJECT_NAME];
}