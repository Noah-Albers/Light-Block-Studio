<template>
    <div :class="`frame ${isDualModel ? 'dualMode' : ''}`">
        <!-- HEX-Display (Shows the current color in hex and lets the user edit it)  -->
        <div class="hex-display">
            <div :style="`background: ${cachedColors.first.display}`">
                <span>Spacer</span>
                <input type="text"
                    :value="cachedColors.first.display"
                    :style="mainModel.hexDisplayTextStyle.value"
                    @change="mainModel.onInputHexNumber">
            </div>

            <div v-if="isDualModel"
                :style="`background: ${cachedColors.second!.display}`">
                <input type="text"
                    :value="cachedColors.second!.display"
                    :style="secondModel!.hexDisplayTextStyle.value"
                    @change="secondModel!.onInputHexNumber">
            </div>

            <!-- Menu with some options -->
            <v-menu theme="dark"
                transition="scale-transition">
                <template v-slot:activator="{ props }">
                    <v-btn color="#333"
                        v-bind="props"
                        icon="mdi-dots-vertical">
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-if="isDualModel"
                        @click="actionSwapColors([true, true, true])"
                        prepend-icon="mdi-swap-horizontal">
                        <v-list-item-title>{{ $t('colorpicker_actions_swapColors') }}</v-list-item-title>
                    </v-list-item>

                    <v-list-item v-if="isDualModel"
                        @click="actionSwapColors([true, false, false])"
                        prepend-icon="mdi-swap-horizontal">
                        <v-list-item-title>{{ $t('colorpicker_actions_swapHue') }}</v-list-item-title>
                    </v-list-item>

                    <v-list-item v-if="isDualModel"
                        @click="actionSwapColors([false, true, false])"
                        prepend-icon="mdi-swap-horizontal">
                        <v-list-item-title>{{ $t('colorpicker_actions_swapSaturation') }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="isDualModel"
                        @click="actionSwapColors([false, false, true])"
                        prepend-icon="mdi-swap-horizontal">
                        <v-list-item-title>{{ $t('colorpicker_actions_swapValue') }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                        @click="actionRandomizeColors()"
                        prepend-icon="mdi-dice-2">
                        <v-list-item-title>{{ $t('colorpicker_actions_randomize') }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>

        <!-- Color picker -->
        <div class="color-picker">

            <!-- Saturation / Value slider-->
            <svg width="100%"
                height="100%"
                class="sat-val-slider"
                ref="refSatValSlider"
                @contextmenu.prevent
                @mousedown.left="mainModel.onSatValMouseDown"
                @mousedown.right="secondModel?.onSatValMouseDown"
                @mousedown.middle="startMover"
                :style="backgroundStyle">

                <defs>
                    <linearGradient id="SaturationGradiant"
                        x1="0%"
                        x2="100%"
                        y1="0%"
                        y2="0%">
                        <stop offset="0%"
                            stop-color="#fff" />
                        <stop offset="100%"
                            stop-color="transparent" />
                    </linearGradient>
                    <linearGradient id="ValueGradiant"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%">
                        <stop offset="0%"
                            stop-color="transparent" />
                        <stop offset="100%"
                            stop-color="#000" />
                    </linearGradient>

                    <marker v-if="isDualModel && !props.disableArrows"
                        id="MarkerArrowFirst"
                        markerWidth="14"
                        markerHeight="14"
                        refX="-8"
                        refY="7"
                        orient="auto">
                        <path d="M 2 2 L 12 7 L 2 12 z"
                            stroke="#000"
                            stroke-width="2px"
                            fill="#fff" />
                    </marker>

                    <marker v-if="isDualModel && !props.disableArrows"
                        id="MarkerArrowSecond"
                        markerWidth="14"
                        markerHeight="14"
                        refX="25"
                        refY="7"
                        orient="auto">
                        <path d="M 2 2 L 12 7 L 2 12 z"
                            stroke="#000"
                            stroke-width="2px"
                            fill="#fff" />
                    </marker>

                    <filter id="mainShadowFilter"
                        v-if="isDualModel && !props.disableShadows">
                        <feDropShadow dx="0"
                            dy="0"
                            :flood-color="mainShadow"
                            stdDeviation="5"
                            flood-opacity=".3" />
                    </filter>

                    <filter id="secondaryShadowFilter"
                        v-if="isDualModel && !props.disableShadows">
                        <feDropShadow dx="0"
                            dy="0"
                            :flood-color="secondShadow"
                            stdDeviation="5"
                            flood-opacity=".3" />
                    </filter>
                </defs>



                <circle v-if="isDualModel && !props.disableShadows"
                    :cx="`${secondModel!.cursorSVPosition.value.left}%`"
                    :cy="`${secondModel!.cursorSVPosition.value.top}%`"
                    r="40"
                    filter="url(#secondaryShadowFilter)"
                    :fill="secondShadow" />

                <circle v-if="isDualModel && !props.disableShadows"
                    :cx="`${mainModel.cursorSVPosition.value.left}%`"
                    :cy="`${mainModel.cursorSVPosition.value.top}%`"
                    r="20"
                    filter="url(#mainShadowFilter)"
                    :fill="mainShadow" />
                <!-- Overlays for saturation and value -->
                <rect width="100%"
                    height="100%"
                    x="0"
                    y="0"
                    fill="url(#SaturationGradiant)" />
                <rect width="100%"
                    height="100%"
                    x="0"
                    y="0"
                    fill="url(#ValueGradiant)" />

                <!-- #region Lock bars -->

                <!-- Lock bars (Main) -->
                <Bar v-if="mainModel.locks.value[2]"
                    :is-vertical="false"
                    :pos="mainModel.cursorSVPosition.value.top" />
                <Bar v-if="mainModel.locks.value[1]"
                    :is-vertical="true"
                    :pos="mainModel.cursorSVPosition.value.left" />

                <!-- Lock bars (Secondary) -->
                <Bar v-if="isDualModel && secondModel!.locks.value[2]"
                    :is-vertical="false"
                    :pos="secondModel!.cursorSVPosition.value.top" />
                <Bar v-if="isDualModel && secondModel!.locks.value[1]"
                    :is-vertical="true"
                    :pos="secondModel!.cursorSVPosition.value.left" />

                <!-- #endregion -->

                <!-- Direction Arrows -->
                <line v-if="arrowPositionsSatVal !== undefined"
                    :x1="arrowPositionsSatVal!.x1"
                    :x2="arrowPositionsSatVal!.x2"
                    :y1="arrowPositionsSatVal!.y1"
                    :y2="arrowPositionsSatVal!.y2"
                    marker-start="url(#MarkerArrowFirst)"
                    marker-end="url(#MarkerArrowSecond)" />


                <!-- #region Cursor -->
                <!-- Main cursor -->
                <Cursor :pos-x="mainModel.cursorSVPosition.value.left"
                    :pos-y="mainModel.cursorSVPosition.value.top" />

                <!-- Secondary cursor-->
                <Cursor v-if="isDualModel"
                    :pos-x="secondModel!.cursorSVPosition.value.left"
                    :pos-y="secondModel!.cursorSVPosition.value.top"
                    :is-circle="false" />
                <!-- #endregion -->

            </svg>

            <!-- Hue selector -->
            <svg class="hue-selector"
                ref="refHueSlider"
                @mousedown.left="mainModel.onHueMouseDown"
                @mousedown.right="secondModel?.onHueMouseDown"
                @contextmenu.prevent
                :style="`background: linear-gradient(0deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red)`">

                <!-- Arrows for the cursors-->
                <line v-if="arrowPositionsHue !== undefined"
                    x1="50%"
                    x2="50%"
                    :y1="arrowPositionsHue!.first"
                    :y2="arrowPositionsHue!.second"
                    marker-start="url(#MarkerArrowFirst)" />

                <!-- Main cursor -->
                <Cursor :pos-x="50"
                    :pos-y="mainModel.cursorHuePosition.value"
                    :is-locked="mainModel.locks.value[0]" />

                <!-- Secondary cursor-->
                <Cursor v-if="isDualModel"
                    :pos-x="50"
                    :pos-y="secondModel!.cursorHuePosition.value"
                    :is-locked="secondModel!.locks.value[0]"
                    :is-circle="false" />
            </svg>
        </div>

        <!-- Text-controlls -->
        <div class="controlls">

            <div class="controller-line"
                v-for="_, idx of mainVModel">
                <span>{{ propertyNames[idx] }}</span>

                <v-icon @click="mainModel.onLockClicked(idx)"
                    :icon="mainModel.locks.value[idx] ? 'mdi-lock-outline' : 'mdi-lock-open-outline'" />

                <input @input="mainModel.onTextInput($event, idx)"
                    :type="mainModel.locks.value[idx] ? 'text' : 'number'"
                    min="0"
                    max="1"
                    step="0.01"
                    :value="mainVModel[idx]" />
            </div>

            <div class="controller-line ctrl-secondary"
                v-if="isDualModel"
                v-for="_, idx of secondVModel">

                <input @input="secondModel!.onTextInput($event, idx)"
                    :type="secondModel!.locks.value[idx] ? 'text' : 'number'"
                    min="0"
                    max="1"
                    step="0.01"
                    :value="secondVModel![idx]" />

                <v-icon @click="secondModel!.onLockClicked(idx)"
                    :icon="secondModel!.locks.value[idx] ? 'mdi-lock-outline' : 'mdi-lock-open-outline'" />

                <span>{{ propertyNames[idx] }}</span>

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

        &.ctrl-secondary {
            text-align: right;

            input {
                text-align: right;
            }
        }
    }

}

.hex-display {
    display: flex;

    &>div {
        width: 100%;
        position: relative;
        border-radius: $border-radius;
        margin-right: $spacing;

        span {
            visibility: hidden;
        }

        input {
            outline: none;
            text-align: center;
            position: absolute;
            height: 100%;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
        }
    }

    &,
    input {
        width: 100%;
        font-size: $text-size;
    }

}

.hue-selector {
    width: $huewidth;
    border-radius: $border-radius;
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
    margin-right: $spacing;
}
</style>

<script setup
    lang="ts">
    import { PropType, Ref, ref, computed, ModelRef } from 'vue';
    import { useColorModel } from "./ColorModel";
    import Cursor from "./Cursor.vue"
    import Bar from "./Bar.vue"
    import { useMultiCursorMover } from "./MultiCursorMover";
    import { CachedColor, VariableColorType } from '@nodes/implementations/datasources/ColorDataSource';
    import { CachedRangeColor } from "@nodes/implementations/datasources/ColorRangeDataSource"
    import { $t } from "@localisation/Fluent";

    //#region Setup

    // HTML-References for the sliders
    const refSatValSlider = ref(null) as any as Ref<HTMLDivElement>;
    const refHueSlider = ref(null) as any as Ref<HTMLDivElement>;

    const emit = defineEmits<{
        (e: "preview", mainHex: string, secondHex?: string): void
    }>();

    const cachedColors = computed(()=>{
        const isSingle = (props.cache as any)["first"] === undefined;
        
        if(isSingle)
            return {
                first: props.cache as CachedColor,
                second: undefined
            }
        return props.cache as CachedRangeColor
    });

    const props = defineProps({
        cache: {
            type: Object as PropType<CachedColor | CachedRangeColor>,
            required: true,
        },

        disableShadows: {
            default: false,
            type: Boolean
        },

        disableArrows: {
            default: false,
            type: Boolean
        }
    });

    const propertyNames = [
        $t('colorpicker_property_name_hue'),
        $t('colorpicker_property_name_saturation'),
        $t('colorpicker_property_name_value'),
    ];

    // Main model of the component
    const mainVModel = defineModel("modelValue", {
        required: true,
        type: Object as PropType<VariableColorType>
    })

    // Second model of the component
    const secondVModel = defineModel("secondary", {
        type: Object as PropType<VariableColorType>,
    })

    // Simple computed prop which holds if the second model is available
    const isDualModel = computed(() => {
        return secondVModel.value !== undefined;
    })

    // Model with the logic of the color model
    const mainModel = useColorModel(mainVModel, refSatValSlider, refHueSlider, computed(()=>cachedColors.value.first));

    // Model with the logic of the color model
    const secondModel = isDualModel.value ? useColorModel(secondVModel as ModelRef<VariableColorType>, refSatValSlider, refHueSlider, computed(()=>cachedColors.value.second!)) : undefined;

    const startMover = isDualModel.value ? useMultiCursorMover(mainModel, secondModel!, mainVModel, secondVModel as ModelRef<VariableColorType>, refSatValSlider) : undefined;

    //#endregion

    //#region Computed properties

    // Positions of the arrows for the saturation / value cursors
    const arrowPositionsSatVal = computed(() => {
        if (!isDualModel.value || props.disableArrows) return undefined;

        // Calculates the distance between the two points
        const x1 = mainModel.cursorSVPosition.value.left;
        const y1 = mainModel.cursorSVPosition.value.top;
        const x2 = secondModel!.cursorSVPosition.value.left;
        const y2 = secondModel!.cursorSVPosition.value.top;

        const deltaX = x1 - x2;
        const deltaY = y1 - y2;

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Prevents rendering the arrows would be near each other
        if (distance <= 6) return undefined;

        return {
            x1: `${x1}%`,
            y1: `${y1}%`,

            x2: `${x2}%`,
            y2: `${y2}%`,
        }
    });

    // Positions of the arrow
    const arrowPositionsHue = computed(() => {
        if (!isDualModel.value || props.disableArrows) return undefined;

        const y1 = mainModel.cursorHuePosition.value;
        const y2 = secondModel!.cursorHuePosition.value;

        // Distance between the hue sliders
        const dist = Math.abs(y1 - y2);

        // Prevents render if they are to near to each other
        if (dist <= 5) return undefined;

        return {
            first: `${y1}%`,
            second: `${y2}%`
        }
    });


    const mainShadow = computed(() => {
        return `hsla(${360 * cachedColors.value.first.hsv[0]},100%, 50%,1)`;
    });

    const secondShadow = computed(() => {
        return `hsla(${360 * cachedColors.value.second!.hsv[0]},100%, 50%,1)`;
    });

    // Style to use for the background color of the saturation / value slider
    const backgroundStyle = computed(() => {
        const hsla = (
            isDualModel.value && (
                secondModel!.isSatValMouseDown.value ||
                (secondModel!.isHueMouseDown.value && !secondModel!.locks.value[0])
            )
        ) ? secondShadow.value : mainShadow.value;

        return "background: " + hsla + ";";
    })

    //#endregion

    //#region Events

    // Event: Colors shall be randomized
    function actionRandomizeColors() {
        function biasedRandomColor(){
            let x = Math.random();

            return 1 - 1/(10*x+1) + .09;
        }

        mainModel.setFullModelValue([
            Math.random(),
            biasedRandomColor(),
            biasedRandomColor()
        ])

        if (isDualModel.value)
            secondModel!.setFullModelValue([
                Math.random(),
                biasedRandomColor(),
                biasedRandomColor()
            ])
    }

    // Event: Colors shall be swapped
    function actionSwapColors(which: boolean[]) {
        if (which.length != 3) {
            console.error("actionSwapColors was called with other than three components to be swapped?!");
            return;
        }

        const clrNewSec = [];
        const clrNewMain = [];

        // Iterates over all components and swaps them
        for (let i = 0; i < 3; i++) {

            clrNewSec[i] = which[i] ? mainVModel.value[i] : secondVModel.value![i];
            clrNewMain[i] = which[i] ? secondVModel.value![i] : mainVModel.value![i];
        }

        // Applies the swapped colors
        mainModel.setFullModelValue(clrNewMain as any);
        secondModel!.setFullModelValue(clrNewSec as any);
    }

    //#endregion

</script>