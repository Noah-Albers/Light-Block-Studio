import { IDataSource } from "@nodes/definitions/DataSource";
import { NumberDataSource } from "@nodes/implementations/datasources/NumberDataSource";
import { OnBlockTextInput } from "./fields/OnBlockTextfield";
import { ColorDataSource } from "@nodes/implementations/datasources/ColorDataSource";
import { OnBlockColorPicker } from "./fields/OnBlockColorPicker";
import { ColorRangeDataSource } from "@nodes/implementations/datasources/ColorRangeDataSource";
import { OnBlockRangeColorPicker } from "./fields/OnBlockColorrangePicker";

/**
 * Takes in a
 * @param datasource 
 * @returns the corresponding name of the blockly-field which shall be used for that data source
 */
export function getBlocklyFieldNameFromModel(ds: IDataSource<any, any>) : string {

    // TODO: Improve mapping

    // List of direct mappings between name sources and block input fields
    const staticlyKnown: (()=>[boolean, string])[] = [
        ()=>[ds instanceof NumberDataSource, OnBlockTextInput.FIELD_NAME],
        ()=>[ds instanceof ColorDataSource, OnBlockColorPicker.FIELD_NAME],
        ()=>[ds instanceof ColorRangeDataSource, OnBlockRangeColorPicker.FIELD_NAME]
    ];

    // Finds the correct one
    for(const test of staticlyKnown){
        let result = test();
        if(result[0]) return result[1];
    }

    throw new Error(`No blockly on-block field found for model ${ds.constructor.name}`);
}