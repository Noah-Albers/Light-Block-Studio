<template>
    <br>
    <div class="frame">

        <!-- HEX-Display (Shows the current color in hex and lets the user edit it)  -->
        <div class="hex-display"
            :style="`background: ${hexColor}`">
            <input type="text"
                :value="hexColor"
                :style="hexDisplayTextStyle"
                @change="onInputHexNumber">
        </div>

        <!-- Color picker -->
        <div class="color-picker">

            <!-- Saturation / Value slider-->
            <div class="sat-val-slider"
                ref="refSatValSlider"
                @mousedown.left="onSatValMouseDown"
                :style="`background: hsla(${360 * coloredColorType[0]},100%, 50%,1)`">

                <!-- Overlays for saturation and value -->
                <div class="saturation-panel"></div>
                <div class="value-panel"></div>

                <!-- Lock bars -->
                <div class="locked locked-x"
                    :style="cursorSVPosition.top"
                    v-if="locks[2]"></div>
                <div class="locked locked-y"
                    :style="cursorSVPosition.left"
                    v-if="locks[1]"></div>

                <!-- Cursor-->
                <div class="cursor inner-cursor"
                    :style="cursorSVPosition.left + cursorSVPosition.top"></div>
            </div>

            <!-- Hue selector -->
            <div class="hue-selector"
                ref="refHueSlider"
                @mousedown.left="onHueMouseDown"
                :style="`background: linear-gradient(0deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red)`">

                <!-- Cursor -->
                <div :class="`cursor hue-cursor ${locks[0] ? 'cursor-disabled' : ''}`"
                    :style="cursorHuePosition"></div>

            </div>
        </div>

        <!-- Text-controlls -->
        <div class="controlls">

            <div class="controller-line"
                v-for="_, idx of model">
                <span>{{ propertyNames[idx] }}</span>

                <v-icon @click="onLockClicked(idx)"
                    :icon="locks[idx] ? 'mdi-lock-outline' : 'mdi-lock-open-outline'" />

                <input @input="onTextInput($event, idx)"
                    :type="locks[idx] ? 'text' : 'number'"
                    min="0"
                    max="1"
                    step="0.01"
                    :value="model[idx]" />

            </div>

        </div>
    </div>


</template>


<style lang="scss">
$huewidth: 2rem;

$color-picker-width: 40rem;
$color-picker-height: 20rem;

$border-radius: 3px;
$spacing: .7rem;

$text-size: 1.5rem;

.controlls {
    font-size: $text-size;

    .controller-line {
        display: flex;
        margin-top: $spacing;

        span {
            width: 12rem;
        }

        input {
            width: 100%;
            padding: 1px 5px;
            margin-left: .2rem;
            color: #CE9178;
            font-weight: bold;
            border-radius: $border-radius;

            &[type="number"] {
                color: #9CDCFE;
                font-weight: normal;
            }
        }
    }

}

.hex-display {
    border-radius: $border-radius;

    &,
    input {
        width: 100%;
        font-size: $text-size;
    }

    input {
        outline: none;
        text-align: center;
    }
}

.hue-selector {
    width: $huewidth;
    position: relative;
    border-radius: $border-radius;

    .hue-cursor {
        left: 50%;

        &.cursor-disabled {
            left: 0;
            right: 0;
            border-radius: 0;
            height: 5px;
            width: 100%;
            transform: translateY(-50%);
        }
    }
}

.color-picker {
    display: inline-flex;
    align-items: stretch;
    justify-content: center;
    margin-top: $spacing;

    width: $color-picker-width;
    height: $color-picker-height;
}

.frame {
    color: rgb(232, 232, 232);
    display: inline-flex;
    flex-direction: column;
    background: #1F1F1F;
    padding: $spacing;
}

.sat-val-slider {
    border-radius: $border-radius;
    overflow: hidden;
    flex-grow: 1;
    position: relative;
    margin-right: $spacing;

    div {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }


    .locked {
        border: 1px solid black;
        position: absolute;

        &.locked-x {
            border-right: none;
            border-left: none;
            height: 5px;
            left: 0;
            right: 0;
            transform: translateY(-50%);
        }

        &.locked-y {
            border-top: none;
            border-bottom: none;
            width: 5px;
            top: 0;
            bottom: 0;
            transform: translateX(-50%);
        }
    }


    .value-panel {
        background: linear-gradient(0deg, #000, transparent);
    }

    .saturation-panel {
        background: linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0))
    }
}

.cursor {
    position: absolute;
    border-radius: 50%;
    border: 2px solid black;
    width: 10px;
    height: 10px;
    transform: translateX(-50%) translateY(-50%);
    box-shadow: 0px 0px 0px 1px black;
    border: 1px solid white;
    border-radius: 50%;
    width: 8px;
    height: 8px;
}
</style>

<script setup
    lang="ts">
    import { computed, ref } from 'vue';
    import { PropType } from 'vue';
    import { HSV2HEX, HEX2HSV } from "../utils/color/ColorConverter";
    import { useVariableStore } from "../stores/VariableStore";
    import { solveExpression } from "@mathSolver/index";
    import { useMouse } from "../utils/vue/VueMousemoveListener";

    export type VariableColorType = [string | number, string | number, string | number];

    const emit = defineEmits<{
        (e: "preview", hex: string): void
    }>();

    const refSatValSlider = ref(null);
    const refHueSlider = ref(null);

    const isHueMouseDown = useMouse(onHueSliderMove);
    const isSatValMouseDown = useMouse(onSatValSliderMove);

    const propertyNames = ["Hue", "Saturation", "Value"];

    // Computed a style for the text-display
    const hexDisplayTextStyle = computed(() => {
        if (coloredColorType.value[2] >= 1 / 2)
            return "color: black; text-shadow: 1px 1px #aaa;";

        return "color: white; text-shadow: 1px 1px #444;";
    })

    // V-Model of this component
    const model = defineModel({
        required: true,
        type: Object as PropType<VariableColorType>
    })

    // Store for variables
    const varStore = useVariableStore();

    //#region Computed

    // Computed: Which of the items (HSV) have been locked to be string expressions
    // and which can therefor not be altered by the color picker interface
    const locks = computed(() => model.value.map(x => typeof x === "string"));


    // Computed: Css-Style for the hue cursor position
    const cursorHuePosition = computed(() => {
        return `top: ${coloredColorType.value[0] * 100}%;`;
    });

    // Computed: Css-Style for the saturation / value cursor position
    const cursorSVPosition = computed(() => {
        const top = (1 - coloredColorType.value[2]) * 100;
        const left = (coloredColorType.value[1]) * 100;

        return {
            top: `top: ${top}%;`,
            left: `left: ${left}%;`
        }
    })

    // Computed: The HSV component's all as numbers (Expressions have been calculated)
    const coloredColorType = computed(() => {

        // Maps each value to their calculated value
        return model.value.map(itm => {
            if (typeof itm === "number") return itm;

            return clamp(solveExpression(itm, varStore.variable2ValueMap, 1));
        })
    })

    // Computed: The HSV componenets as a HEX-Css color #FFFFFF for example
    const hexColor = computed(() => {
        const asString = HSV2HEX(
            coloredColorType.value[0] as number,
            coloredColorType.value[1] as number,
            coloredColorType.value[2] as number
            , false);

        emit("preview", asString);

        return asString;
    });

    //#endregion

    // Simple clamp method
    const clamp = (x: number) => Math.min(Math.max(x, 0), 1);
    // Simple round method
    const roundNumber = (value: number) => Math.round(clamp(value) * 1000) / 1000;

    // Sets the model value of one of hue / saturation / value by index
    function setModelValue(idx: number, value: number | string) {

        const updated = model.value;
        updated[idx] = typeof value === "string" ? value : roundNumber(value);

        model.value = updated
    }

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

        model.value = [clr.h, clr.s, clr.v];
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

        setModelValue(idx, isString ? coloredColorType.value[idx] : model.value[idx].toString());
    }

    // Event: When the user moves the hue curser
    function onHueSliderMove(evt: any) {
        if (locks.value[0]) return;

        const src = refHueSlider.value as any as HTMLElement;

        const bcr = src.getBoundingClientRect();

        const clickY = (evt.clientY - bcr.top) / bcr.height;
        setModelValue(0, clickY);
    }

    // Event: When the user moves the saturation / value curser
    function onSatValSliderMove(evt: any) {
        const src = refSatValSlider.value as any as HTMLElement;

        const bcr = src.getBoundingClientRect();

        const updated = model.value;
        let changeFlag = false;

        if (!locks.value[1]) {
            const clickX = (evt.clientX - bcr.left) / bcr.width;
            updated[1] = roundNumber(clickX);
            changeFlag = true;
        }

        if (!locks.value[2]) {
            const clickY = (evt.clientY - bcr.top) / bcr.height;
            updated[2] = roundNumber(1 - clickY);
            changeFlag = true;
        }

        if (changeFlag)
            model.value = updated;
    }



</script>