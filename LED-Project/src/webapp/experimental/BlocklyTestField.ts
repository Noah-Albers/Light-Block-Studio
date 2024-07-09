import { getBlockCacheOfSource, getBlockDataObject, getBlockModel } from "@webapp/blockly/OnBlockUtils";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import { Field } from "blockly";
import VueRenderModelTest from "@webapp/experimental/VueRenderModelTest.vue"; 
import { Component } from "vue";

export class BlockVueAdapterField extends Field {

    // Static field name
    public static readonly FIELD_NAME = "TODO_BLOCKLY_STUFF";
    SERIALIZABLE = true;

    private __ankor: Element|undefined;

    // Gets the renderer for the vue elements
    getVueRenderer() : Component {
        return VueRenderModelTest;
    }

    getPreviewSize(){
        return [40, 20]
    }

    initVueViewAndGetAnkor() : Element {
        // this.createBorderRect_();
        // this.borderRect_!.style.fillOpacity = "1";
        const size = this.getPreviewSize();

        this.size_.width = size[0];
        this.size_.height = size[1];

        return this.fieldGroup_!;
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
        // Gets the block stuff
        const dataRef = getBlockDataObject(this.sourceBlock_!)!;
        const model = getBlockModel(this.sourceBlock_!)!;
        const cache = getBlockCacheOfSource(this.sourceBlock_!, this.name!)!;

        SignalDispatcher.emit(Signals.REQUEST_VUE_HTML_INJECT, {
            base: this.__ankor = this.initVueViewAndGetAnkor(),
            cache: cache,
            dataObj: dataRef,
            model: model,
            renderer: this.getVueRenderer(),
            stageUndo: this.setValue.bind(this)
        })
    }

    // Blockly-Event: Block is removed
    dispose(): void {
        SignalDispatcher.emit(Signals.REQUEST_VUE_HTML_DETACH, this.__ankor!);

        super.dispose();
    }
}
  