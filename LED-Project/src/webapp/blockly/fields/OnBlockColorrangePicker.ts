import { VariableColorType } from "@nodes/implementations/datasources/ColorDataSource";
import { AbstractBlockColorPicker } from "./OnBlockColorPicker";
import { ColorRangeType } from "@nodes/implementations/datasources/ColorRangeDataSource";
import { getBlockDataObject } from "../OnBlockUtils";
import { DropDownDiv } from "blockly";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";

type GradiantElement = {
    // Contains all stop element of the gradiant and the gradiant itself
    stopC11: SVGStopElement,
    stopC12: SVGStopElement,
    stopC21: SVGStopElement,
    stopC22: SVGStopElement,

    // The raw gradiant element
    gradiant: SVGGradientElement
}


export class OnBlockRangeColorPicker extends AbstractBlockColorPicker<[string|undefined, string|undefined]> {

    // Static field name
    public static readonly FIELD_NAME = "fld_clrrange_input";

    // Contains all HTML-References to the custom gradiant elements
    private gradiantElement?: GradiantElement;

    constructor(){
        super(undefined);

        // Ensures the cache is valid
        this.displayCache = [undefined, undefined];
    }

    protected initView(): void {
        super.initView();

        this.createSVGGradiantElement();

        this.borderRect_!.style.fill = `url(#${this.gradiantElement!.gradiant.id})`;
    }

    protected markCacheAsOld(): void {
        this.displayCache[0] = this.displayCache[1] = undefined;
    }

    protected getCachedValue(): [string, string] {
        
        this.displayCache[0] = this.calculateColorOf(data=>data.first as VariableColorType, cache=>cache[0]);
        this.displayCache[1] = this.calculateColorOf(data=>data.second as VariableColorType, cache=>cache[1]);

        return this.displayCache as [string,string];
    }

    protected getPreviewSize(): [number, number] {
        return [40, 15];
    }

    // Event: When the editor changes the secondary value
    protected onEditorChangeMainValue(value: VariableColorType, colorCache: string) {
        // Updates the external value and stores the cache
        this.displayCache[0] = colorCache;

        // Changes the value, triggerin the onValueChange method
        getBlockDataObject(this.sourceBlock_!).value[this.name!].first = value;
    }

    // Event: When the editor changes the main value
    protected onEditorChangeSecondaryValue(value: VariableColorType, colorCache: string) {
        // Updates the external value and stores the cache
        this.displayCache[1] = colorCache;

        // Changes the value, triggerin the onValueChange method
        getBlockDataObject(this.sourceBlock_!).value[this.name!].second = value;
    }

    protected showEditor_(_e?: Event | undefined): void {

        // Just sets the background black
        DropDownDiv.setColour("rgb(0,0,0)", "");

        const val = getBlockDataObject(this.sourceBlock_!).value[this.name!] as ColorRangeType

        // Requests the colorpicker to insert itself
        SignalDispatcher.emit(
            Signals.BLOCKLY_COLOR_FIELD_REQ_ATTACH,
            {
                elm: DropDownDiv.getContentDiv(),
                mainValue: val.first,
                secondValue: val.second,
                onSeconardyChange: this.onEditorChangeSecondaryValue.bind(this),
                onMainChange: this.onEditorChangeMainValue.bind(this)
            }
        );

        super.showEditor_(_e);
    }

    protected render_(): void {

        // Renders the gradiant
        const clr = this.getCachedValue();

        this.gradiantElement!.stopC11.setAttribute("stop-color", clr[0]);
        this.gradiantElement!.stopC12.setAttribute("stop-color", clr[0]);
        this.gradiantElement!.stopC21.setAttribute("stop-color", clr[1]);
        this.gradiantElement!.stopC22.setAttribute("stop-color", clr[1]);

        super.render_();
    }

    /**
     * Creates the SVG-Gradiant element and attaches it to the field
     */
    private createSVGGradiantElement(){
        const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient")
        const attr = grad.setAttribute.bind(grad);

        attr("x1","0%");
        attr("y1","60%");

        attr("x2","100%");
        attr("y2","40%");

        const cStop = (offset: string)=>{
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
        this.gradiantElement.gradiant.setAttribute("id", "grd_"+Date.now());

        // Appends the gradiant element
        this.getSvgRoot()!.appendChild(this.gradiantElement.gradiant);
    }
}