import { IDataSource } from "@nodes/definitions/DataSource";
import { IDataSourceSupplier, INodeModel, OnBlockSettings } from "@nodes/definitions/Node";
import { NumberDataSource } from "../../datasources/NumberDataSource";
import { ColorDataSource } from "../../datasources/ColorDataSource";
import { $t } from "@localisation/Fluent";
import { selectBestColorProcedure } from "@webapp/utils/color/SelectBestColorProcedure";

export class MultiLedNodeModel implements INodeModel {

    // Index of the field
    private idxStartField = new NumberDataSource("idxStart", "0", {
        displayTitle: $t('models_multiLed_field_idxStart_title'),
        info: $t('models_multiLed_field_idxStart_info'),
        type: "int",
        min: 0
    });

    // Index of the field
    private idxEndField = new NumberDataSource("idxEnd", "amt", {
        displayTitle: $t('models_multiLed_field_idxEnd_title'),
        info: $t('models_multiLed_field_idxEnd_info'),
        type: "int",
        min: 0
    });


    // Delay field
    private delayField = new NumberDataSource("ledFelay", "0", {
        displayTitle: $t('models_multiLed_field_delay_title'),
        info: $t('models_multiLed_field_delay_info'),
        type: "int",
        min: 0
    });

    // Field to select the color
    private colorField = new ColorDataSource("clr", [1,1,1], {
        displayTitle: $t('models_multiLed_field_color_title'),
        info: $t('models_multiLed_field_color_info')
    });

    getModelName(): string {
        return "multi_led";
    }

    getOnBlockSettings(): OnBlockSettings {
        return {
            category: "led",
            color: 100
        };
    }
    getBlockMessage(): string {
        return $t('models_multiLed_block');
    }
    getOnBlockSources(): IDataSource<any, any, any>[] {
        return [this.idxStartField, this.idxEndField, this.colorField]
    }
    getSources(): IDataSource<any, any, any>[] {
        return [...this.getOnBlockSources(), this.delayField];
    }
    createConfigWithProcedure(supplier: IDataSourceSupplier) {

        const clr = supplier.get(this.colorField);

        let idxStart = supplier.get(this.idxStartField);
        let idxEnd = supplier.get(this.idxEndField);

        const reversed = idxEnd < idxStart;

        if(reversed){
            let tmp = idxStart;
            idxStart = idxEnd;
            idxEnd = tmp;
        }

        return selectBestColorProcedure({
            idxStart,
            ledsReversed: reversed,
            stepsReversed: reversed,
            stepSize: Math.abs(idxEnd - idxStart),
            ledDelay: supplier.get(this.delayField),
            h: clr[0],
            s: clr[1],
            v: clr[2],
            isParallel: false,
            stepDelay: 0,
            steps: 1,
            stepSpace: 0
        })
    }

    hasSubNodes(): boolean {
        return false;
    }
}