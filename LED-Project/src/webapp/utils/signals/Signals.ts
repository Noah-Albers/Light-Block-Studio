import { Block } from "blockly";

export const Signals = Object.freeze({
    /**
     * When a variable is added/removed or changed by the user
     * @argument {String} name the variabl name which is changed
     */
    VAR_CHANGE: 1,


    //#region Blockly-Events

    /**
     * When a blockly block is selected or unselected.
     * @argument {Block | null} the block that got selected, or null
     */
    BLOCKLY_BLOCK_SELECTION_CHANGE: 0

    //#endregion
})