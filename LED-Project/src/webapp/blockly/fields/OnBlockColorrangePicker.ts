import { VariableColorType } from "@nodes/implementations/datasources/ColorDataSource";
import { AbstractBlockColorPicker } from "./OnBlockColorPicker";
import { CachedRangeColor, ColorRangeType, areColorRangesEqual, isColorRangeColor } from "@nodes/implementations/datasources/ColorRangeDataSource";
import { getBlockCacheOfSource, getBlockDataObject } from "../OnBlockUtils";
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


export class OnBlockRangeColorPicker extends AbstractBlockColorPicker<ColorRangeType> {

    // Static field name
    public static readonly FIELD_NAME = "fld_clrrange_input";

    // Contains all HTML-References to the custom gradiant elements
    private gradiantElement?: GradiantElement;

    protected initView(): void {
        super.initView();

        this.createSVGGradiantElement();

        this.borderRect_!.style.fill = `url(#${this.gradiantElement!.gradiant.id})`;
    }

    protected getPreviewSize(): [number, number] {
        return [40, 15];
    }

    protected showEditor_(_e?: Event | undefined): void {

        // Just sets the background black
        DropDownDiv.setColour("rgb(0,0,0)", "");

        // Gets the cache
        const cache = getBlockCacheOfSource<CachedRangeColor>(this.sourceBlock_!, this.name!);

        const val = getBlockDataObject(this.sourceBlock_!)[this.name!] as ColorRangeType

        // Requests the colorpicker to insert itself
        SignalDispatcher.emit(
            Signals.BLOCKLY_COLOR_FIELD_REQ_ATTACH,
            {
                elm: DropDownDiv.getContentDiv(),
                mainValue: val.first,
                secondValue: val.second,
                cache: cache
            }
        );

        super.showEditor_(_e);
    }

    protected render_(): void {
        if(this.gradiantElement !== undefined){

            const cache = getBlockCacheOfSource<CachedRangeColor>(this.sourceBlock_!, this.name!).value;

            const dpFirst = cache.first.display;
            const dpSecond = cache.second.display;

            this.gradiantElement.stopC11.setAttribute("stop-color", dpFirst);
            this.gradiantElement.stopC12.setAttribute("stop-color", dpFirst);
            this.gradiantElement.stopC21.setAttribute("stop-color", dpSecond);
            this.gradiantElement.stopC22.setAttribute("stop-color", dpSecond);
        }

        super.render_();
    }

    protected doClassValidation_(newValue?: unknown): any {

        // Validates the newly passed value
        if(!isColorRangeColor(newValue) || this.sourceBlock_ === null)
            return this.getValue();

        // Gets the data reference
        const dataRef = getBlockDataObject(this.sourceBlock_);

        // Updates the external value
        dataRef[this.name!] = newValue;

        if (this.getValue() !== null)
            this.render_();
        
        return newValue;    
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