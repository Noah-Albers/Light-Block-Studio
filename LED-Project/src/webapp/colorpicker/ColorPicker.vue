<template>
<br>
    <div class="outer">

        <div class="display" :style="`background: ${rgbColor}`">
            <input type="text" :value="rgbColor" :style="textStyle" @change="onInputHexNumber">
        </div>
        
        <div class="split">
            <div class="panel"
                ref="refSatureationValueCanvas"
                @mousedown.left="onSVMouseDown"
                :style="`background: hsla(${360 * coloredColorType[0]},100%, 50%,1)`">
                <div class="white-panel"></div>
                <div class="black-panel"></div>

                <div class="locked locked-x"
                    :style="cursorSVPosition.top"
                    v-if="locks[2]"></div>
                <div class="locked locked-y"
                    :style="cursorSVPosition.left"
                    v-if="locks[1]"></div>
                <div class="cursor inner-cursor"
                    :style="cursorSVPosition.left + cursorSVPosition.top"></div>
            </div>

            <div class="hue-selector"
                ref="refHueSlider"
                @mousedown.left="onHueMouseDown"
                :style="`background: linear-gradient(0deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red)`">
                <div :class="`cursor hue-cursor ${locks[0] ? 'cursor-disabled' : ''}`"
                    :style="cursorHuePosition"></div>

            </div>
        </div>


        <div class="controlls">

            <div class="line" v-for="_, idx of model">
                <span>{{ propertyNames[idx] }}</span>

                <v-icon @click="triggerSwitch(idx)" :icon="locks[idx] ? 'mdi-lock-outline' : 'mdi-lock-open-outline'"/>

                <input @input="input($event, idx)"
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

$splitwidth: 40rem;
$splitheight: 20rem;

$border-radius: 3px;
$spacing: .7rem;

$text-size: 1.5rem;

.controlls {
    font-size: $text-size;

    .line {
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

            &[type="number"]{
                color: #9CDCFE;
                font-weight: normal;
            }
        }
    }

}

.display {
    border-radius: $border-radius;

    &,input {   
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

.split {
    display: inline-flex;
    align-items: stretch;
    justify-content: center;
    margin-top: $spacing;
    
    width: $splitwidth;
    height: $splitheight;
}

.outer {
    color: rgb(232, 232, 232);
    display: inline-flex;
    flex-direction: column;
    background: #1F1F1F;
    padding: $spacing;
}

.panel {
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
}

.black-panel {
    background: linear-gradient(0deg, #000, transparent);
}

.white-panel {
    background: linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0))
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

    const refSatureationValueCanvas = ref(null);
    const refHueSlider = ref(null);
    const isHueMouseDown = useMouse(onHueSliderMove);
    const isSatValMouseDown = useMouse(onSatValueSliderMove);

    const propertyNames = ["Hue", "Saturation", "Value"];

    const textStyle = computed(()=>{
        if(coloredColorType.value[2] >= 1/2)
            return "color: black; text-shadow: 1px 1px #aaa;";
        
        return "color: white; text-shadow: 1px 1px #444;";
    })

    const model = defineModel({
        required: true,
        type: Object as PropType<VariableColorType>
    })

    const varStore = useVariableStore();

    const locks = computed(() => model.value.map(x => typeof x === "string"));

    function onSVMouseDown(evt: any){
        isSatValMouseDown.value = true;
        onSatValueSliderMove(evt);
    }
    
    function onHueMouseDown(evt: any){
        isHueMouseDown.value = true;
        onHueSliderMove(evt);
    }

    function onInputHexNumber(evt: any){
        const clr = HEX2HSV(evt.target.value);

        if(clr === false) return;

        model.value = [clr.h, clr.s, clr.v];
    }

    function updateValue(idx: number, value: number | string) {

        const updated = model.value;
        updated[idx] = typeof value === "string" ? value : roundNum(value);

        model.value = updated
    }

    function input(evt: any, idx: number) {
        const elm = evt.target;

        if (locks.value[idx]) {
            updateValue(idx, elm.value);
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

        updateValue(idx, v);
    }

    function triggerSwitch(idx: number) {

        const isString = typeof model.value[idx] === "string";

        updateValue(idx, isString ? coloredColorType.value[idx] : model.value[idx].toString());
    }

    const clamp = (x: number)=>Math.min(Math.max(x,0),1);

    function roundNum(value: number) {
        return Math.round(clamp(value) * 1000) / 1000;
    }

    function onHueSliderMove(evt: any) {
        if (locks.value[0]) return;

        const src = refHueSlider.value as any as HTMLElement;

        const bcr = src.getBoundingClientRect();

        const clickY = (evt.clientY - bcr.top) / bcr.height;
        updateValue(0, clickY);
    }

    function onSatValueSliderMove(evt: any) {
        const src = refSatureationValueCanvas.value as any as HTMLElement;

        const bcr = src.getBoundingClientRect();

        const updated = model.value;
        let changeFlag = false;

        if (!locks.value[1]) {
            const clickX = (evt.clientX - bcr.left) / bcr.width;
            updated[1] = roundNum(clickX);
            changeFlag = true;
        }

        if (!locks.value[2]) {
            const clickY = (evt.clientY - bcr.top) / bcr.height;
            updated[2] = roundNum(1 - clickY);
            changeFlag = true;
        }

        if (changeFlag)
            model.value = updated;
    }

    const cursorHuePosition = computed(() => {
        return `top: ${clamp(coloredColorType.value[0]) * 100}%;`;
    });

    const cursorSVPosition = computed(() => {
        const top = (clamp(1 - coloredColorType.value[2])) * 100;
        const left = (clamp(coloredColorType.value[1])) * 100;

        return {
            top: `top: ${top}%;`,
            left: `left: ${left}%;`
        }
    })

    const coloredColorType = computed(() => {

        // Maps each value to their calculated value
        return model.value.map(itm => {
            if (typeof itm === "number") return itm;

            return solveExpression(itm, varStore.variable2ValueMap, 1);
        })
    })

    const rgbColor = computed(() => {
        const asString = HSV2HEX(
            coloredColorType.value[0] as number,
            coloredColorType.value[1] as number,
            coloredColorType.value[2] as number
            , false);

        emit("preview", asString);

        return asString;
    });



</script>