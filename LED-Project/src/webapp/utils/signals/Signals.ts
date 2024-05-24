
export const Signals = Object.freeze({
    /**
     * When a variable is added/removed or changed by the user
     */
    VAR_CHANGE: 1,

    //#region Blockly-Events

    /**
     * When a blockly block is selected or unselected.
     * @argument {Block | null} the block that got selected, or null
     */
    BLOCKLY_BLOCK_SELECTION_CHANGE: 0,

    /**
     * TODO: Update arguments
     * When a blockly color field is opened, an attach request is send to let vuejs also access the editor
     * @argument {Object} the configuration object. For more information, look at @link SignalArgumentTypes.d.ts
     */
    BLOCKLY_COLOR_FIELD_REQ_ATTACH: 2,

    /**
     * When a blockly color field is closed, an detach request is send to let vuejs also access the editor
     */
    BLOCKLY_COLOR_FIELD_REQ_DETACH: 3,

    //#endregion
})