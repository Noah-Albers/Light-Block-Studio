import { IDataSource } from "@nodes/definitions/DataSource"
import { INodeModel } from "@nodes/definitions/Node"
import { CachedColor, VariableColorType } from "@nodes/implementations/datasources/ColorDataSource"
import { CachedRangeColor } from "@nodes/implementations/datasources/ColorRangeDataSource"
import { Component, ComputedRef } from "vue"

export type EventVue2HTMLRequest<T> = {
    // The base HTML-Element to inject the vue component into
    base: Element,

    // The cache, data object and Datasource of the given block
    cache: ComputedRef<any>,
    dataObj: object,
    source: IDataSource,

    // The vue component to render
    renderer: Component,

    // Some extra info to pass if required
    extraInfo: T
}

export type EventArgsPopup = {
    // Message to ask the user
    message: string,

    // Messages for yes and no buttons
    yes: string,
    no: string,

    // Function to use when the user has resolved the popup
    onResolve: (res: "yes" | "no")=>void;
}

export type EventArgsMiniInfo = {
    // Text to display inside the popup
    text?: string,
    // The icon to display
    icon?: string,
    // Which type for notification shall be shown
    type?: "info" | "warning" | "error" | "success",
    // How long to display the info
    timeout?: number
}

export type EventArgsSnackbar = {
    // How long to display the popup
    timeout?: number,
    // Text to display inside the popup
    text?: string,
    
    // Which type for notification shall be shown
    type?: "info" | "warning" | "error" | "success"
}

export type EventArgsBlocklyClrReqAttach = {
    // HTML-Element to attach the element to
    elm: Element,

    // Inital value for the main model
    mainValue: VariableColorType,

    // Inital value for the secondary model (If not set, no secondary model is used)
    secondValue?: VariableColorType

    // Caches used by the block
    cache: ComputedRef<CachedColor | CachedRangeColor>,


    // Only used if a second model is in use

    // Disables the shadows which show the hue of the secondary model
    disableShadows?: boolean, // Default: false

    // Disables the arrows which show the direction in which an animation likely will flow
    disableArrows?: boolean, // Default: false
}