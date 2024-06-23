import { FieldTextInput } from "blockly";
import { BlockData, getBlockDataObject } from "../OnBlockUtils";
import { WatchStopHandle, watch } from "vue";

export class OnBlockTextInput extends FieldTextInput {

    // Static field name
    public static readonly FIELD_NAME = "fld_number_inp";

    // Reference to the watcher that watches this fields propery
    private watcher?: WatchStopHandle;

    /**
     * Event: When the value changes externally
     * @param newValue 
     */
    protected onValueChange(newValue: BlockData) {
        const value = newValue[this.name!];

        // Checks if the values are already equal
        if(value === this.getValue()) return;

        // Updates the value
        this.setValue(value);
        // Updates the editor
        this.setEditorValue_(value);
    }

    /**
     * Event: Blockly init's this block
     */
    init(): void {
        super.init();

        // Ensures that the source block exists
        if(this.sourceBlock_ === null) return;

        // Gets the data reference
        const dataRef = getBlockDataObject(this.sourceBlock_);

        // Copies the default value
        this.setValue(dataRef[this.name!]);

        // Creates a watcher to listen for external value changes
        this.watcher = watch(dataRef, this.onValueChange.bind(this));
    }


    /**
     * Event: Blockly removes the block
     */
    dispose(): void {
        super.dispose();

        // Removes the watcher
        if(this.watcher)
            this.watcher();
    }

    /**
     * Event: The value get's validated
     * @param newValue the newly set value
     */
    protected doClassValidation_(newValue?: any): string | null {
        newValue = super.doClassValidation_(newValue);
        
        // Ensures that the source block exists
        if(this.sourceBlock_ === null) return newValue;

        // Gets the data reference
        const dataRef = getBlockDataObject(this.sourceBlock_);

        // Updates the external value
        dataRef[this.name!] = newValue;

        return newValue;
    }
}
  