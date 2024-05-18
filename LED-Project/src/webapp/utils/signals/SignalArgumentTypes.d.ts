import { VariableColorType } from "@nodes/implementations/datasources/ColorDataSource"

export type EventArgsBlocklyClrReqAttach = {
    // HTML-Element to attach the element to
    elm: Element,

    // Inital value for the main model
    mainValue: VariableColorType,

    // Inital value for the secondary model (If not set, no secondary model is used)
    secondValue?: VariableColorType

    // Change listener (Changed on the colors will be passed to this, also directly with an RGB-color string (HEX) which can be passed to css)
    onMainChange: (value: VariableColorType, cachedColor: string)=>void,
    onSeconardyChange?: (value: VariableColorType, cachedColor: string)=>void,

    // Only used if a second model is in use

    // Disables the shadows which show the hue of the secondary model
    disableShadows?: boolean, // Default: false

    // Disables the arrows which show the direction in which an animation likely will flow
    disableArrows?: boolean, // Default: false
}