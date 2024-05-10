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
                class="display-secondary"
                :style="`background: ${secondModel!.hexColor.value}`">
                <input type="text"
                    :value="secondModel!.hexColor.value"
                    :style="secondModel!.hexDisplayTextStyle.value"
                    @change="secondModel!.onInputHexNumber">
            </div>
        </div>

        <!-- Color picker -->
        <div class="color-picker">

            <!-- Saturation / Value slider-->
            <div class="sat-val-slider"
                ref="refSatValSlider"
                @mousedown.left="mainModel.onSatValMouseDown"
                @mousedown.middle="secondModel?.onSatValMouseDown"
                :style="backgroundStyle">

                <!-- Overlays for saturation and value -->
                <div class="saturation-panel"></div>
                <div class="value-panel"></div>

                <!-- Lock bars (Main) -->
                <div class="locked locked-x"
                    :style="mainModel.cursorSVPosition.value.top"
                    v-if="mainModel.locks.value[2]"></div>
                <div class="locked locked-y"
                    :style="mainModel.cursorSVPosition.value.left"
                    v-if="mainModel.locks.value[1]"></div>


                <!-- Lock bars (Secondary) -->
                <div class="locked locked-x"
                    :style="secondModel!.cursorSVPosition.value.top"
                    v-if="isDualModel && secondModel!.locks.value[2]"></div>
                <div class="locked locked-y"
                    :style="secondModel!.cursorSVPosition.value.left"
                    v-if="isDualModel && secondModel!.locks.value[1]"></div>


                <!-- Cursor (Main) -->
                <div class="cursor"
                    :style="mainModel.cursorSVPosition.value.left + mainModel.cursorSVPosition.value.top"></div>

                <!-- Cursor (Secondary) -->
                <div class="cursor cursor-secondary"
                    v-if="isDualModel"
                    :style="secondModel!.cursorSVPosition.value.left + secondModel!.cursorSVPosition.value.top"></div>
            </div>

            <!-- Hue selector -->
            <div class="hue-selector"
                ref="refHueSlider"
                @mousedown.left="mainModel.onHueMouseDown"
                @mousedown.middle="secondModel?.onHueMouseDown"
                :style="`background: linear-gradient(0deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red)`">

                <!-- Cursor (Main) -->
                <div :class="`cursor hue-cursor ${mainModel.locks.value[0] ? 'cursor-disabled' : ''}`"
                    :style="mainModel.cursorHuePosition.value"></div>

                <!-- Cursor (Main) -->
                <div :class="`cursor cursor-secondary hue-cursor ${secondModel!.locks.value[0] ? 'cursor-disabled' : ''}`"
                    v-if="isDualModel"
                    :style="secondModel!.cursorHuePosition.value"></div>
            </div>
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
                &[type="number"]{
                }
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

        span {
            visibility: hidden;
        }

        input {
            outline: none;
            text-align: center;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
        }

        &.display-secondary {
            margin-left: $spacing;
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

    &.cursor-secondary {
        border-radius: 0;
    }
}
</style>

<script setup
    lang="ts">
    import { PropType, Ref, ref, watchEffect, computed, ModelRef } from 'vue';
    import { useColorModel, VariableColorType } from "./ColorModel";

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
        return secondVModel !== undefined;
    })

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

</script>