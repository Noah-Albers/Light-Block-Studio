import { Component, watchEffect, WatchStopHandle } from "vue";
import { VueGuiBlockField } from "@webapp/blockly/fields/common/VueGuiBlockField";
import OnBlockColorPicker from "./OnBlockColorPicker.vue";
import { getBlockCacheOfSource, getBlockDataObject } from "@webapp/blockly/OnBlockUtils";
import { watch } from "vue";
import { DropDownDiv } from "blockly";
import { CachedColor, isVariableColor, VariableColorType } from "@nodes/implementations/datasources/ColorDataSource";
import { CachedRangeColor, ColorRangeType, isColorRangeColor } from "@nodes/implementations/datasources/ColorRangeDataSource";
import OnBlockRangeColorPicker from "./OnBlockRangeColorPicker.vue"


type GradiantElement = {
    // Contains all stop element of the gradiant and the gradiant itself
    stopC11: SVGStopElement,
    stopC12: SVGStopElement,
    stopC21: SVGStopElement,
    stopC22: SVGStopElement,

    // The raw gradiant element
    gradiant: SVGGradientElement
}

export class ColorRangePickerField extends VueGuiBlockField {

    public static readonly FIELD_NAME = "colorrange"

    // Contains all HTML-References to the custom gradiant elements
    private gradiantElement?: GradiantElement;

    // Watches for "external" changes
    private valueWatcher: WatchStopHandle|undefined;
    // Watches for cache changes
    private cacheWatcher: WatchStopHandle|undefined;

    protected getExtraInfo(): undefined { return undefined; }

    protected getPreviewSize(): [number, number] {
        return [50,20]
    }
    
    protected getVueRenderer(): Component {
        return OnBlockRangeColorPicker;
    }

    // Clones the value
    protected cloneValue(value: ColorRangeType) : ColorRangeType{
        return {
            first: [...value.first],
            second: [...value.second]
        };
    }

    protected initView(): void {
        super.initView();

        this.createSVGGradiantElement();

        this.borderRect_!.style.fill = `url(#${this.gradiantElement!.gradiant.id})`;
    }

    /**
     * Creates the SVG-Gradiant element and attaches it to the field
     */
    private createSVGGradiantElement() {
        const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient")
        const attr = grad.setAttribute.bind(grad);

        attr("x1", "0%");
        attr("y1", "60%");

        attr("x2", "100%");
        attr("y2", "40%");

        const cStop = (offset: string) => {
            const s = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            s.setAttribute("offset", offset);
            grad.appendChild(s);
            return s;
        }

        // Creates the Gradiant-SVG
        this.gradiantElement = {
            stopC11: cStop("0%"),
            stopC12: cStop("40%"),
            stopC21: cStop("60%"),
            stopC22: cStop("100%"),
            gradiant: grad
        }

        // Inserts the relevant information
        this.gradiantElement.gradiant.setAttribute("id", "grd_" + Date.now());

        // Appends the gradiant element
        this.getSvgRoot()!.appendChild(this.gradiantElement.gradiant);
    }

    init(): void {
        super.init();

        // Listen on "cache" changes
        const cache =  getBlockCacheOfSource(this.sourceBlock_!, this.name!);
        const dataObj = getBlockDataObject(this.sourceBlock_!);

        this.cacheWatcher = watch(cache, this.onCacheChange.bind(this));
        this.valueWatcher = watch(dataObj, this.onVueValueUpdate.bind(this))

        // Runs the "init" event
        this.onCacheChange();
        this.value_ = this.cloneValue(dataObj[this.name!]);
    }
    
    // Blockly-Event: Disposes the block
    dispose(): void {
        // Removes the vue listeners
        this.cacheWatcher!();
        this.valueWatcher!();
    }

    // Blockly-Event: the setValue function is called and uses this to validate the value
    protected doClassValidation_(newValue?: unknown): any {
        if(newValue === undefined || newValue === null)
            return this.getValue();

        if(!isColorRangeColor(newValue))
            return this.getValue();

        const isVueValue = (newValue as any).__vue === true;

        // Removes the flag
        if(isVueValue){
            delete (newValue as any).__vue;
            return newValue;
        }


        // Creates two clone values here to prevent any pass by reference problems
        getBlockDataObject(this.sourceBlock_!)[this.name!] = this.cloneValue(newValue);

        return this.cloneValue(newValue);
    }
    

    // Event: The cache changes (Therefor the color display changes)
    protected onCacheChange(){
        if(this.borderRect_ === null || this.gradiantElement === undefined) return;

        const cache = getBlockCacheOfSource<CachedRangeColor>(this.sourceBlock_!, this.name!).value;

        const dpFirst = cache.first.display;
        const dpSecond = cache.second.display;

        this.gradiantElement.stopC11.setAttribute("stop-color", dpFirst);
        this.gradiantElement.stopC12.setAttribute("stop-color", dpFirst);
        this.gradiantElement.stopC21.setAttribute("stop-color", dpSecond);
        this.gradiantElement.stopC22.setAttribute("stop-color", dpSecond);
    }

    // Handler to debounce the vue value change event function
    private timehandler: NodeJS.Timeout|undefined;

    // Event: When the vue update value event timer is completed
    protected onTimerHit(){
        // Ensures to reset the timer
        this.timehandler = undefined;

        const vueValue = getBlockDataObject(this.sourceBlock_!)[this.name!];
        const blockValue = this.getValue();
        
        const areDifferent = [0,1,2].some(x=>vueValue.first[x] !== blockValue.first[x]) || [0,1,2].some(x=>vueValue.second[x] !== blockValue.second[x])

        // Checks if the value is not equal
        if(blockValue === null || areDifferent) {
            // Sets a cloned value
            const clone = this.cloneValue(vueValue);
            (clone as any).__vue = true;
            this.setValue(clone);
        }
    }

    // Event: The vue value is updated
    protected onVueValueUpdate(){
        
        // Debounces the actual function
        if(this.timehandler !== undefined){
            clearTimeout(this.timehandler);
            this.timehandler = undefined;
        }

        // (Re)starts the timer to the set value
        this.timehandler = setTimeout(this.onTimerHit.bind(this), 500);
    }
}