import { getBlockCacheOfSource, getBlockDataObject, getBlockModel } from "@webapp/blockly/OnBlockUtils";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import { Field } from "blockly";
import { Component } from "vue";

// This is the field to inherit if a blockly-block shall render some vuejs componenets

export abstract class BlockVueAdapterField extends Field {

    // Static field name
    public static readonly FIELD_NAME = "TODO_BLOCKLY_STUFF";
    SERIALIZABLE = true;

    // Gets the renderer for the vue elements
    protected abstract getVueRenderer() : Component;

    // Blockly-Event: The block is initialized
    init(): void {
        super.init();

        // Ensures that the source block exists
        if(this.sourceBlock_ === null) return;

        // Gets the data reference
        const dataRef = getBlockDataObject(this.sourceBlock_);

        // Copies the default value
        this.setValue(dataRef[this.name!]);
    }

    // Blockly-Event: The view is initialized
    protected initView(): void {
        this.createBorderRect_();
        this.borderRect_!.style.fillOpacity = "1";

        // Gets the block stuff
        const dataRef = getBlockDataObject(this.sourceBlock_!)!;
        const model = getBlockModel(this.sourceBlock_!)!;
        const cache = getBlockCacheOfSource(this.sourceBlock_!, this.name!)!;

        // Gets the correct source
        const source = model.getSources().find(src=>src.getKey() === this.name!)!;

        SignalDispatcher.emit(Signals.REQUEST_VUE_HTML_INJECT, {
            base: this.borderRect_!,
            cache: cache,
            dataObj: dataRef,
            source: source,
            renderer: this.getVueRenderer(),
            stageUndo: this.setValue.bind(this)
        })
    }

    // Blockly-Event: Block is removed
    dispose(): void {
        SignalDispatcher.emit(Signals.REQUEST_VUE_HTML_DETACH, this.borderRect_!);

        super.dispose();
    }
}
  