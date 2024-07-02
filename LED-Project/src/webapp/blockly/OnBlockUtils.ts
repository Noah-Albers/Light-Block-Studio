import { INodeModel } from "@nodes/definitions/Node";
import { Block } from "blockly";
import { ComputedRef, Ref, ref } from "vue";
import { CACHE_OBJECT_NAME, DATA_OBJECT_NAME, MODEL_OBJECT_NAME } from "./RegisterBlockly";

export type BlockData = {[key: string]: any};
export type Cache = {[key: string]: any}

export function getBlockCacheOfSource<T>(block: Block, name: string) : ComputedRef<T> {
    return getBlockCache(block)[name];
}

// TODO: Comment
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