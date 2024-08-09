import { IDataSource } from "@nodes/definitions/DataSource";
import { IDataSourceSupplier, INodeModel, OnBlockSettings } from "@nodes/definitions/Node";
import { NumberDataSource } from "../../datasources/NumberDataSource";
import { ColorDataSource } from "../../datasources/ColorDataSource";
import { ColorRangeDataSource } from "../../datasources/ColorRangeDataSource";
import { Registry } from "@registry/Registry";
import { $t } from "@localisation/Fluent";

export class SetLedNodeModel implements INodeModel {

    // Index of the field
    private idxField = new NumberDataSource("idx", "0", {
        displayTitle: $t('models_color_field_color_index_title'),
        info: $t('models_color_field_color_index_info'),
        type: "int",
        min: 0
    })

    // Field to select the color
    private colorField = new ColorDataSource("clr", [1,1,1], {
        displayTitle: $t('models_color_field_color_title'),
        info: $t('models_color_field_color_color')
    });

    getModelName(): string {
        return "setled_simple";
    }
    getOnBlockSettings(): OnBlockSettings {
        return {
            category: "led",
            color: 100
        };
    }
    getBlockMessage(): string {
        return $t('models_color_block');
    }
    getOnBlockSources(): IDataSource<any, any, any>[] {
        return [this.idxField, this.colorField]
    }
    getSources(): IDataSource<any, any, any>[] {
        return this.getOnBlockSources();
    }
    createConfigWithProcedure(supplier: IDataSourceSupplier) {

        const clr = supplier.get(this.colorField);

        return {
            procedure: Registry.procedures.setLedSimple,
            options: {
                idx: supplier.get(this.idxField),
                h: clr[0],
                s: clr[1],
                v: clr[2]
            }
        }
    }

    hasSubNodes(): boolean {
        return false;
    }
}