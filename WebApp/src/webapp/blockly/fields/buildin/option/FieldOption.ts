import { DropDownDiv, FieldDropdown } from "blockly";
import { BlockData, getBlockDataObject, getBlockModel } from "@webapp/blockly/OnBlockUtils";
import { WatchStopHandle, watch } from "vue";
import { OptionDataSource } from "@nodes/implementations/datasources/OptionDataSource";

export class OptionField extends FieldDropdown {

    // Static field name
    public static readonly FIELD_NAME = "fld_option_inp";

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
    }

    constructor(){
        super([["",""]]);
    }

    /**
     * Event: Blockly init's this block
     */
    init(): void {
        // Ensures that the source block exists
        if(this.sourceBlock_ === null) return;

        // Gets the data reference
        const dataRef = getBlockDataObject(this.sourceBlock_);
        const mdl = getBlockModel(this.sourceBlock_)!.getSources().find(x=>x.getKey() === this.name!) as OptionDataSource;

        // Creates a watcher to listen for external value changes
        this.watcher = watch(dataRef, this.onValueChange.bind(this));

        
        this.menuGenerator_ = ()=>{
            const opts = mdl.getOptions();

            return Object.keys(opts).map(k=>[opts[k],k]);
        };
        this.getOptions(false);

        // Copies the default value
        this.setValue(dataRef[this.name!]);

        super.init();
    }

    showEditor(e?: Event): void {
        super.showEditor(e);
        DropDownDiv.setColour("white","black");
    }


    /**
     * Event: Blockly removes the block
     */
    dispose(): void {
        // Removes the watcher
        this.watcher!();
        
        super.dispose();
    }

    // Returns if a given value is valid as the field option
    private isValueValid(value: unknown) {
        const mdl = getBlockModel(this.sourceBlock_!)!.getSources().find(x=>x.getKey() === this.name!) as OptionDataSource;

        return Object.keys(mdl.getOptions()).includes(String(value))
    }

    /**
     * Event: The value get's validated
     * @param newValue the newly set value
     */
    protected doClassValidation_(newValue?: any): string | null {

        // Ensures that the source block exists
        if(this.sourceBlock_ === null)
            return newValue

        if(!this.isValueValid(newValue))
            return this.getValue();

        // Gets the data reference
        const dataRef = getBlockDataObject(this.sourceBlock_);

        // Updates the external value
        dataRef[this.name!] = newValue;

        return newValue;
    }
}
  