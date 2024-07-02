import { Field, DropDownDiv } from "blockly";
import { BlockData, getBlockCacheOfSource, getBlockDataObject } from "../OnBlockUtils";
import { WatchStopHandle, watchEffect } from "vue";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import { CachedColor, VariableColorType, isVariableColor } from "@nodes/implementations/datasources/ColorDataSource";

export abstract class AbstractBlockColorPicker<ValueType> extends Field {

    // Reference to the watcher that watches this fields propery
    private watcher?: WatchStopHandle;

    // Defines the size of the preview element
    protected abstract getPreviewSize(): [number, number];

    //#region Setup

    constructor() {
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
        this.onValueChange(dataRef[this.name!]);

        // Creates a watcher to listen for external value changes
        this.watcher = watchEffect(() => this.onValueChange(dataRef[this.name!]));

        // Listens for variable changes
        SignalDispatcher.on(Signals.VAR_CHANGE, this.onVariableChange.bind(this));
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
        this.render_();
    };


    protected valueSetDelay: NodeJS.Timeout | undefined;

    /**
     * Event: When the value changes externally
     */
    protected onValueChange(newValue: BlockData) {
        this.render_();
        this.setValue({ value: newValue });
    }


    //#endregion

    //#region Overwritten Blockly Events

    protected updateSize_(margin?: number | undefined): void {
        const size = this.getPreviewSize();

        if (this.borderRect_ === null)
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

export class OnBlockColorPicker extends AbstractBlockColorPicker<VariableColorType> {

    // Static field name
    public static readonly FIELD_NAME = "fld_clr_input";

    constructor() {
        super();
    }

    protected getPreviewSize(): [number, number] {
        return [25, 15];
    }

    // Event: When the preview shall be updated with the new cache
    protected onUpdatePreview() {
        const cache = getBlockCacheOfSource<CachedColor>(this.sourceBlock_!, this.name!).value.display;

        if (this.borderRect_ !== null)
            this.borderRect_!.style.fill = cache;
        DropDownDiv.setColour(cache, "");
    }

    protected showEditor_(_e?: Event | undefined): void {

        // Gets the cache
        const cache = getBlockCacheOfSource<CachedColor>(this.sourceBlock_!, this.name!);

        // Sets the block-background color as the dropdown background-color
        this.onUpdatePreview();

        // Requests the colorpicker to insert itself
        SignalDispatcher.emit(
            Signals.BLOCKLY_COLOR_FIELD_REQ_ATTACH,
            {
                elm: DropDownDiv.getContentDiv(),
                mainValue: getBlockDataObject(this.sourceBlock_!)[this.name!] as VariableColorType,
                cache: cache
            }
        );

        super.showEditor_(_e);
    }

    protected render_(): void {
        this.onUpdatePreview();

        super.render_();
    }

    // Event: When a new external value is loaded
    protected doClassValidation_(newValue?: unknown): any {

        // Validates the newly passed value
        if (!isVariableColor(newValue) || this.sourceBlock_ === null)
            return this.getValue();

        // Gets the data reference
        const dataRef = getBlockDataObject(this.sourceBlock_);

        // Updates the external value
        dataRef[this.name!] = newValue;

        if (this.getValue() !== null)
            this.render_();
        return newValue;
    }
}


