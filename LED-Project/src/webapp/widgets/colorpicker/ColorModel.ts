import { CachedColor, VariableColorType } from '@nodes/implementations/datasources/ColorDataSource';
import { clamp, round3Digits } from '@utils/MathUtils';
import { HEX2HSV } from '@webapp/utils/color/ColorConverter';
import { useMouse } from '@webapp/utils/vue/VueMousemoveListener';
import { ModelRef, Ref, computed } from 'vue'

export type ColorModel = ReturnType<typeof useColorModel>;


// Logic of a color model (Cursor, locks, barriers and a lot of event listeners and such)
export function useColorModel(model: ModelRef<VariableColorType>, refSatValSlider: Ref<HTMLDivElement>, refHueSlider: Ref<HTMLDivElement>, cached: Ref<CachedColor>) {
    const isHueMouseDown = useMouse(onHueSliderMove);
    const isSatValMouseDown = useMouse(onSatValSliderMove);

    // Sets the full model value
    function setFullModelValue(value: VariableColorType){

        const updated = model.value;
        for(let idx=0;idx<3;idx++)
            updated[idx] = typeof value[idx] === "string" ? value[idx] : clamp(round3Digits(value[idx] as number));

        model.value = updated

    }

    // Sets the model value of one of hue / saturation / value by index
    function setModelValue(idx: number, value: number | string) {

        const updated = model.value;
        updated[idx] = typeof value === "string" ? value : clamp(round3Digits(value));

        model.value = updated
    }


    //#region Computed Properties


    // Computed a style for the text-display
    const hexDisplayTextStyle = computed(() => {
        if (cached.value.hsv[2] >= 1 / 2)
            return "color: black; text-shadow: 1px 1px #aaa;";

        return "color: white; text-shadow: 1px 1px #444;";
    })

    // Computed: Which of the items (HSV) have been locked to be string expressions
    // and which can therefor not be altered by the color picker interface
    const locks = computed(() => model.value.map(x => typeof x === "string"));

    // Computed: Css-Style for the hue cursor position
    const cursorHuePosition = computed(() => {
        return (1-cached.value.hsv[0]) * 100;
    });

    // Computed: Css-Style for the saturation / value cursor position
    const cursorSVPosition = computed(() => {
        const top = (1 - cached.value.hsv[2]) * 100;
        const left = (cached.value.hsv[1]) * 100;

        return {
            top,
            left
        }
    })

    //#endregion


    //#region Events

    // Event: When the user clicks the saturation / value curser
    function onSatValMouseDown(evt: any) {
        isSatValMouseDown.value = true;
        onSatValSliderMove(evt);
    }

    // Event: When the user clicks the hue curser
    function onHueMouseDown(evt: any) {
        isHueMouseDown.value = true;
        onHueSliderMove(evt);
    }

    // Event: When the user inputs a custom hex number
    function onInputHexNumber(evt: any) {
        const clr = HEX2HSV(evt.target.value);

        // Validates the result
        if (clr === false) return;

        setFullModelValue([
            clr.h, clr.s, clr.v
        ])
    }


    // Event: When one of the textboxes is used to input a number for one of the components
    function onTextInput(evt: any, idx: number) {
        const elm = evt.target;

        if (locks.value[idx]) {
            setModelValue(idx, elm.value);
            return;
        }

        const v = parseFloat(elm.value);
        if (isNaN(v)) {
            if (elm.value.trim().length === 0)
                return;
            setTimeout(() => {
                elm.value = model.value[idx];
            }, 1)
            return;
        }

        setModelValue(idx, v);
    }

    // Event: When the padlock is clicked to lock or unlock a component
    function onLockClicked(idx: number) {

        const isString = typeof model.value[idx] === "string";

        setModelValue(idx, isString ? cached.value.hsv[idx] : model.value[idx].toString());
    }

    // Event: When the user moves the hue curser
    function onHueSliderMove(evt: any) {
        if (locks.value[0]) return;

        const src = refHueSlider.value as any as HTMLElement;

        const bcr = src.getBoundingClientRect();

        const clickY = (evt.clientY - bcr.top) / bcr.height;
        setModelValue(0, 1-clickY);
    }

    // Event: When the user moves the saturation / value curser
    function onSatValSliderMove(evt: any) {
        const src = refSatValSlider.value as any as HTMLElement;

        const bcr = src.getBoundingClientRect();

        const updated = model.value;
        let changeFlag = false;

        if (!locks.value[1]) {
            const clickX = (evt.clientX - bcr.left) / bcr.width;
            updated[1] = clamp(round3Digits(clickX));
            changeFlag = true;
        }

        if (!locks.value[2]) {
            const clickY = (evt.clientY - bcr.top) / bcr.height;
            updated[2] = clamp(round3Digits(1 - clickY));
            changeFlag = true;
        }

        if (changeFlag)
            model.value = updated;
    }

    // #endregion



    return {
        // Color properties
        locks, cursorHuePosition, cursorSVPosition,
        hexDisplayTextStyle,
        
        // Mouse properties
        isHueMouseDown,
        isSatValMouseDown,

        // Events
        onHueMouseDown,
        onHueSliderMove,
        onInputHexNumber,
        onLockClicked,
        onSatValMouseDown,
        onTextInput,

        // Change model
        setFullModelValue,
        setModelValue
    }
}