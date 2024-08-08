import { Component } from "vue"
import { ColorPickerField } from "../buildin/colorpicker/FieldColorPicker"
import OffBlockColorPicker from "../buildin/colorpicker/OffBlockColorPicker.vue"
import OffBlockRangeColorPicker from "../buildin/rangecolorpicker/OffBlockRangeColorPicker.vue"
import OffBlockNumber from "../buildin/number/OffBlockNumber.vue"
import OffBlockOption from "../buildin/option/OffBlockOption.vue"
import { ColorDataSource } from "@nodes/implementations/datasources/ColorDataSource"
import { ColorRangePickerField } from "../buildin/rangecolorpicker/FieldRangeColorPicker"
import { ColorRangeDataSource } from "@nodes/implementations/datasources/ColorRangeDataSource"
import { NumberField } from "../buildin/number/FieldNumber"
import { NumberDataSource } from "@nodes/implementations/datasources/NumberDataSource"
import { OptionField } from "../buildin/option/FieldOption"
import { OptionDataSource } from "@nodes/implementations/datasources/OptionDataSource"

type FieldCollection = {
    OffBlockView: Component,
    BlocklyField: any,
    DataSource: any
}

export function getBlocklyFields2Register() : FieldCollection[] {
    return [
        { BlocklyField: ColorPickerField, OffBlockView: OffBlockColorPicker, DataSource: ColorDataSource },
        { BlocklyField: ColorRangePickerField, OffBlockView: OffBlockRangeColorPicker, DataSource: ColorRangeDataSource },
        { BlocklyField: NumberField, OffBlockView: OffBlockNumber, DataSource: NumberDataSource },
        { BlocklyField: OptionField, OffBlockView: OffBlockOption, DataSource: OptionDataSource }
    ]
}