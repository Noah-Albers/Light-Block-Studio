import { Field, DropDownDiv } from "blockly";
import { BlockData, getBlockDataObject } from "../OnBlockUtils";
import { WatchStopHandle, watch, watchEffect } from "vue";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import { VariableColorType, isVariableColor } from "@nodes/implementations/datasources/ColorDataSource";
import { clamp } from "@utils/MathUtils";
import { solveExpression } from "@mathSolver/index";
import { useVariableStore } from "@webapp/stores/VariableStore";
import { HSV2HEX } from "@webapp/utils/color/ColorConverter";
import { calculatePreview } from "@webapp/utils/color/VariableColorConverter";


export abstract class AbstractBlockColorPicker<CacheType extends (string|undefined)|[string|undefined,string|undefined], ValueType> extends Field {

    // Reference to the watcher that watches this fields propery
    private watcher?: WatchStopHandle;

    protected displayCache: CacheType = undefined!;

    // Defines the size of the preview element
    protected abstract getPreviewSize() : [number, number];

    //#region Setup

    constructor(){
        super(undefined);
        this.SERIALIZABLE = true
    }

    // Event: The view is initialized
    protected initView(): void {
        this.createBorderRect_();
        this.borderRect_!.style.fillOpacity = "1";
    }

    // Event: Blockly init's this block
    init(): void {
        super.init();

        // Ensures that the source block exists
        if (this.sourceBlock_ === null) return;

        // Gets the data reference
        const dataRef = getBlockDataObject(this.sourceBlock_);

        // Sets the value
        this.setValue(this.createUnbiasedValue(getBlockDataObject(this.sourceBlock_!).value[this.name!]));

        // Creates a watcher to listen for external value changes
        this.watcher = watchEffect(()=>this.onValueChange(dataRef.value[this.name!]));

        // Listens for variable changes
        SignalDispatcher.on(Signals.VAR_CHANGE, this.onVariableChange.bind(this));
    }

    // Creates the value but without any reference to the original object
    protected abstract createUnbiasedValue(value: ValueType) : ValueType;

    //#endregion

    //#region Cache

    // Marks the cache string to be old and that the cache shall be recalculated
    protected abstract markCacheAsOld() : void;
    protected abstract getCachedValue() : Required<CacheType>;

    // Helper function to calculate the hex-string (Cache)
    protected calculateColorOf(getDataObj: (data: BlockData)=>VariableColorType, getCache: (cache: CacheType)=>string|undefined) : string {
        const previousCache = getCache(this.displayCache);

        if(previousCache !== undefined)
            return previousCache;

        let value = getDataObj(getBlockDataObject(this.sourceBlock_!).value[this.name!]);

        return calculatePreview(value);
    }

    //#endregion

    //#region Cleanup

    // Event: Blockly removes the block
    dispose(): void {
        super.dispose();
        // Removes the listener
        SignalDispatcher.off(Signals.VAR_CHANGE, this.onVariableChange.bind(this));

        // Removes the watcher
        if (this.watcher)
            this.watcher();
    }
    //#endregion

    //#region Custom Events

    // Event: When the editor is closed
    protected onDisposeEditor() {
        SignalDispatcher.emit(Signals.BLOCKLY_COLOR_FIELD_REQ_DETACH);
    }

    // Event: A variable changed, therefor the colors must be recalculated
    protected onVariableChange() {
        this.markCacheAsOld();
        this.render_();
    };

    /**
     * Event: When the value changes externally
     */
    protected onValueChange(newValue: BlockData) {
        this.setValue(newValue);
    }
    

    //#endregion

    //#region Overwritten Blockly Events

    protected updateSize_(margin?: number | undefined): void {
        const size = this.getPreviewSize();

        if(this.borderRect_ === null)
            return;

        // Updates width and height
        this.borderRect_.setAttribute(
            "width",
            (this.size_.width = size[0]).toString()
        );

        this.borderRect_.setAttribute(
            "height",
            (this.size_.height = size[1]).toString()
        );
    }

    // Event: When the editor is opened
    protected showEditor_(_e?: Event | undefined): void {
        // Ensures the max-height is removed
        DropDownDiv.getContentDiv().setAttribute("style", "max-height: unset");

        // Waits a short time to ensure that the above event fired correctly
        setTimeout(() => {
            // Opens the dropdown and registers the close-handler
            DropDownDiv.showPositionedByField(this, this.onDisposeEditor.bind(this));
        });
    }

    //#endregion

}

export class OnBlockColorPicker extends AbstractBlockColorPicker<string|undefined, VariableColorType> {

    // Static field name
    public static readonly FIELD_NAME = "fld_clr_input";

    constructor(){
        super();
    }

    protected createUnbiasedValue(value: VariableColorType): VariableColorType {
        return [...value];
    }

    protected markCacheAsOld(): void {
        this.displayCache = undefined;
    }

    protected getCachedValue(): string {

        return this.displayCache = this.calculateColorOf(d=>d as VariableColorType,d=>d);
    }

    protected getPreviewSize(): [number, number] {
        return [25, 15];
    }

    protected onEditorChangeValue(value: VariableColorType, colorCache: string) {
        // Updates the external value and stores the cache
        this.displayCache = colorCache;
        // Sets the value of the block
        this.setValue(value);

        // Updates the color of the dropdown
        DropDownDiv.setColour(this.getCachedValue(), "");
    }

    protected showEditor_(_e?: Event | undefined): void {

        // Sets the block-background color as the dropdown background-color
        DropDownDiv.setColour(this.getCachedValue(), "");

        // Requests the colorpicker to insert itself
        SignalDispatcher.emit(
            Signals.BLOCKLY_COLOR_FIELD_REQ_ATTACH,
            {
                elm: DropDownDiv.getContentDiv(),
                mainValue: getBlockDataObject(this.sourceBlock_!).value[this.name!] as VariableColorType,
                onChange: this.onEditorChangeValue.bind(this)
            }
        );

        super.showEditor_(_e);
    }

    protected render_(): void {
        // Updates the color
        if(this.borderRect_ !== null)
            this.borderRect_.style.fill = this.getCachedValue();

        super.render_();
    }

    protected doClassValidation_(newValue?: unknown): any {

        // Validates the newly passed value
        if(!isVariableColor(newValue) || this.sourceBlock_ === null)
            return this.getValue();

        // Gets the data reference
        const dataRef = getBlockDataObject(this.sourceBlock_);

        // Updates the external value
        dataRef.value[this.name!] = newValue;

        if(this.getValue() !== null){
            this.markCacheAsOld();
            this.render_();
        }
        return newValue;        
    }
}


