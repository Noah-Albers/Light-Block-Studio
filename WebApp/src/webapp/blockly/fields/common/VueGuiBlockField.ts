import { Field, DropDownDiv } from "blockly";
import { Component } from "vue";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import { getBlockCacheOfSource, getBlockDataObject, getBlockModel } from "@webapp/blockly/OnBlockUtils";

export abstract class VueGuiBlockField<ExtraInfo = undefined> extends Field {

    // Defines the size of the preview element
    protected abstract getPreviewSize(): [number, number];

    protected abstract getVueRenderer() : Component;

    protected abstract getExtraInfo(): ExtraInfo;

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

    //#endregion

    //#region Custom Events

    // Event: When the editor is closed
    protected onDisposeEditor() {
        SignalDispatcher.emit(Signals.BLOCKLY_REQUEST_VUE_HTML_DETACH, DropDownDiv.getContentDiv());
    }

    //#endregion

    //#region Overwritten Blockly Events

    protected showEditor_(_e?: Event | undefined): void {

        // Gets the block data
        const dataObj = getBlockDataObject(this.sourceBlock_!)!;
        const model = getBlockModel(this.sourceBlock_!)!
        const cache = getBlockCacheOfSource(this.sourceBlock_!, this.name!)!;

        // Gets the correct source
        const source = model.getSources().find(src=>src.getKey() === this.name!)!;

        // Requests the colorpicker to insert itself
        SignalDispatcher.emit(
            Signals.BLOCKLY_REQUEST_VUE_HTML_INJECT,
            {
                base: DropDownDiv.getContentDiv(),
                dataObj: dataObj,
                source: source,
                cache: cache,
                renderer: this.getVueRenderer(),
                extraInfo: this.getExtraInfo()
            }
        );

        // Ensures the max-height is removed
        DropDownDiv.getContentDiv().setAttribute("style", "max-height: unset");

        // Waits a short time to ensure that the above event fired correctly
        setTimeout(() => {
            // Opens the dropdown and registers the close-handler
            DropDownDiv.showPositionedByField(this, this.onDisposeEditor.bind(this));
        });

        super.showEditor_(_e);
    }

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

    //#endregion

}