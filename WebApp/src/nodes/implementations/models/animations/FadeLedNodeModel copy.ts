import { IDataSource } from "@nodes/definitions/DataSource";
import { IDataSourceSupplier, INodeModel, OnBlockSettings } from "@nodes/definitions/Node";
import { NumberDataSource } from "../../datasources/NumberDataSource";
import { Registry } from "@registry/Registry";
import { $t } from "@localisation/Fluent";
import { ColorRangeDataSource } from "@nodes/implementations/datasources/ColorRangeDataSource";

export class FadeLedNodeModel implements INodeModel {

    // Index of the field
    private idxStartField = new NumberDataSource("idxStart", "0", {
        displayTitle: $t('models_fade_field_idxStart_title'),
        info: $t('models_fade_field_idxStart_info'),
        type: "int",
        min: 0
    });

    // Index of the field
    private idxEndField = new NumberDataSource("idxEnd", "amt", {
        displayTitle: $t('models_fade_field_idxEnd_title'),
        info: $t('models_fade_field_idxEnd_info'),
        type: "int",
        min: 0
    });


    // Field to offset each led color
    private offsetField = new NumberDataSource("offset", "20", {
        displayTitle: $t('models_fade_field_offset_title'),
        info: $t('models_fade_field_offset_info'),
        type: "int"
    });

    // Field: Defines how many fast and how many cycles will be done
    private cycleField = new NumberDataSource("cycle", "5000", {
        displayTitle: $t('models_fade_field_cycle_title'),
        info: $t('models_fade_field_cycle_info'),
        type: "int",
        min: 0
    });

    // Field: Defines how long the animation plays
    private lengthField = new NumberDataSource("length", "5000", {
        displayTitle: $t('models_fade_field_runtime_title'),
        info: $t('models_fade_field_runtime_info'),
        type: "int",
        min: 0
    });

    // Field to select the color
    private colorField = new ColorRangeDataSource("clr", [1,1,1], [.5,1,1], {
        displayTitle: $t('models_fade_field_color_title'),
        info: $t('models_fade_field_color_info')
    });

    getModelName(): string {
        return "fade";
    }

    getOnBlockSettings(): OnBlockSettings {
        return {
            category: "animations",
            color: 300
        };
    }
    getBlockMessage(): string {
        return $t('models_fade_block');
    }
    getOnBlockSources(): IDataSource<any, any, any>[] {
        return [this.colorField, this.lengthField]
    }
    getSources(): IDataSource<any, any, any>[] {
        return [
            this.idxStartField,
            this.idxEndField,
            this.lengthField,
            this.offsetField,
            this.cycleField,
            this.colorField,
        ]
    }
    createConfigWithProcedure(supplier: IDataSourceSupplier) {

        const clr = supplier.get(this.colorField);

        return {
            procedure: Registry.procedures.fade,
            options: {

                cycleMs: supplier.get(this.cycleField),
                idxStart: supplier.get(this.idxStartField),
                idxEnd: supplier.get(this.idxEndField),
                ledOffsetMs: supplier.get(this.offsetField),
                playLength: supplier.get(this.lengthField),
                updateRateMs: 50,

                hFrom: clr.first[0],
                sFrom: clr.first[1],
                vFrom: clr.first[2],
                hTo: clr.second[0],
                sTo: clr.second[1],
                vTo: clr.second[2],
            }
        }
    }

    hasSubNodes(): boolean {
        return false;
    }
}