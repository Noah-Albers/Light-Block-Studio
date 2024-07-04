
export const Signals = Object.freeze({
    /**
     * When a variable is added/removed or changed by the user
     */
    VAR_CHANGE: 1,

    /**
     * Requests the blockly workspace to build the config and then emit the normal events for that
     */
    REQUEST_CONFIG_BUILD: 6,

    /**
     * Requests the application to show a snackbar with the given information
     * @argument {EventArgsPopup} the data to display inside the snackbar
     */
    DISPLAY_POPUP: 7,

    //#region Blockly-Events

    /**
     * When a blockly block is selected or unselected.
     * @argument {Block | null} the block that got selected, or null
     */
    BLOCKLY_BLOCK_SELECTION_CHANGE: 0,

    /**
     * When a blockly color field is opened, an attach request is send to let vuejs also access the editor
     * @argument {Object} the configuration object. For more information, look at @link SignalArgumentTypes.d.ts
     */
    BLOCKLY_COLOR_FIELD_REQ_ATTACH: 2,

    /**
     * When a blockly color field is closed, an detach request is send to let vuejs also access the editor
     */
    BLOCKLY_COLOR_FIELD_REQ_DETACH: 3,

    /**
     * When the blockly workspaces (re)creates the config and sends it.
     * Preview is a config based on what the user has selected and all is the full config which includes the setup and loop blocks
     */
    BLOCKLY_PREVIEW_CREATE_CONFIG: 4,
    BLOCKLY_ALL_CREATE_CONFIG: 5,

    /**
     * Requests blockly to send the current workspace instance
     */
    BLOCKLY_REQUEST_WORKSPACE: 8,

    //#endregion
})