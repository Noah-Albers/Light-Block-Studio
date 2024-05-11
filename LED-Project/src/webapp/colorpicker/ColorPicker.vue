<template>
    {{ isDualModel }}
    <br>
    <div :class="`frame ${isDualModel ? 'dualMode' : ''}`">

        <!-- HEX-Display (Shows the current color in hex and lets the user edit it)  -->
        <div class="hex-display">
            <div :style="`background: ${mainModel.hexColor.value}`">
                <span>Spacer</span>
                <input type="text"
                    :value="mainModel.hexColor.value"
                    :style="mainModel.hexDisplayTextStyle.value"
                    @change="mainModel.onInputHexNumber">
            </div>

            <div v-if="isDualModel"
                :style="`background: ${secondModel!.hexColor.value}`">
                <input type="text"
                    :value="secondModel!.hexColor.value"
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
                        @click="actionSwapColors"
                        prepend-icon="mdi-swap-horizontal">
                        <v-list-item-title>Swap Colors</v-list-item-title>
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
                @mousedown.left="mainModel.onSatValMouseDown"
                @mousedown.middle="secondModel?.onSatValMouseDown"
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

                    <filter id="f1"
                        x="0"
                        y="0"
                        xmlns="http://www.w3.org/2000/svg">
                        <feGaussianBlur in="SourceGraphic"
                            stdDeviation="15" />
                    </filter>
                </defs>


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
                @mousedown.middle="secondModel?.onHueMouseDown"
                :style="`background: linear-gradient(0deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red)`">

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

                &[type="number"] {}
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
    import { PropType, Ref, ref, watchEffect, computed, ModelRef } from 'vue';
    import { useColorModel, VariableColorType } from "./ColorModel";
    import Cursor from "./Cursor.vue"
    import Bar from "./Bar.vue"

    // HTML-References for the sliders
    const refSatValSlider = ref(null) as any as Ref<HTMLDivElement>;
    const refHueSlider = ref(null) as any as Ref<HTMLDivElement>;

    const emit = defineEmits<{
        (e: "mainPreview", hex: string): void,
        (e: "secondPreview", hex: string): void
    }>();

    const propertyNames = ["Hue", "Saturation", "Value"];

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

    // Style to use for the background color of the saturation / value slider
    const backgroundStyle = computed(() => {
        const model = (
            isDualModel && (
                secondModel!.isSatValMouseDown.value ||
                secondModel!.isHueMouseDown.value
            )
        ) ? secondModel! : mainModel;
        return `background: hsla(${360 * model.coloredColorType.value[0]},100%, 50%,1)`;
    })


    // Model with the logic of the color model
    const mainModel = useColorModel(mainVModel, refSatValSlider, refHueSlider);

    // Model with the logic of the color model
    const secondModel = isDualModel ? useColorModel(secondVModel as ModelRef<VariableColorType>, refSatValSlider, refHueSlider) : undefined;

    // Registers the event updater for the previews
    watchEffect(() => { emit("mainPreview", mainModel.hexColor.value); });
    if (isDualModel)
        watchEffect(() => { emit("secondPreview", secondModel!.hexColor.value); });


    //#region Events

    // Event: Colors shall be swapped
    function actionSwapColors() {
        let clrOne = mainVModel.value;
        mainVModel.value = secondVModel.value!;
        secondVModel.value = clrOne;
    }

    //#endregion

</script>