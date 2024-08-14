import { IDataSource } from "@nodes/definitions/DataSource";
import { IDataSourceSupplier, INodeModel, OnBlockSettings } from "@nodes/definitions/Node";
import { NumberDataSource } from "../../datasources/NumberDataSource";
import { Registry } from "@registry/Registry";
import { $t } from "@localisation/Fluent";

export class RainbowLedNodeModel implements INodeModel {

    // Index of the field
    private idxStartField = new NumberDataSource("idxStart", "0", {
        displayTitle: $t('models_rainbow_field_idxStart_title'),
        info: $t('models_rainbow_field_idxStart_info'),
        type: "int",
        min: 0
    });

    // Index of the field
    private idxEndField = new NumberDataSource("idxEnd", "amt", {
        displayTitle: $t('models_rainbow_field_idxEnd_title'),
        info: $t('models_rainbow_field_idxEnd_info'),
        type: "int",
        min: 0
    });


    // Field to offset each led color
    private offsetField = new NumberDataSource("offset", "20", {
        displayTitle: $t('models_rainbow_field_offset_title'),
        info: $t('models_rainbow_field_offset_info'),
        type: "int"
    });

    // Field: Defines how many fast and how many cycles will be done
    private cycleField = new NumberDataSource("cycle", "5000", {
        displayTitle: $t('models_rainbow_field_cycle_title'),
        info: $t('models_rainbow_field_cycle_info'),
        type: "int",
        min: 0
    });

    // Field: Defines how long the animation plays
    private lengthField = new NumberDataSource("length", "5000", {
        displayTitle: $t('models_rainbow_field_runtime_title'),
        info: $t('models_rainbow_field_runtime_info'),
        type: "int",
        min: 0
    });

    // Field: Defines the brightness (value) of the rainbow
    private vField = new NumberDataSource("v", "255", {
        displayTitle: $t('models_rainbow_field_value_title'),
        info: $t('models_rainbow_field_value_info'),
        type: "int",
        min: 0,
        max: 255
    });

    getModelName(): string {
        return "rainbow";
    }

    getOnBlockSettings(): OnBlockSettings {
        return {
            category: "animations",
            color: 300
        };
    }
    getBlockMessage(): string {
        return $t('models_rainbow_block');
    }
    getOnBlockSources(): IDataSource<any, any, any>[] {
        return [this.lengthField]
    }
    getSources(): IDataSource<any, any, any>[] {
        return [
            this.idxStartField,
            this.idxEndField,
            this.lengthField,
            this.offsetField,
            this.cycleField,
            this.vField,
        ]
    }
    createConfigWithProcedure(supplier: IDataSourceSupplier) {

        let offsetPerLed = supplier.get(this.offsetField);

        const cycleLength = supplier.get(this.cycleField);
        const idxStart = supplier.get(this.idxStartField);
        const idxEnd = supplier.get(this.idxEndField);
        

        // TODO: Fix this
        // Maybe implement some kind of local variable or smth.

        // Usese this as a "magic" autocalulate value
        if(offsetPerLed === 12345678){
            let stripLength = Math.abs(idxStart - idxEnd);

            if(stripLength !== 0)
                offsetPerLed = Math.round(cycleLength/stripLength);
        }

        return {
            procedure: Registry.procedures.rainbow,
            options: {
                idxStart: idxStart,
                idxEnd: idxEnd,

                ledOffsetMs: offsetPerLed,
                cycleMs: cycleLength,
                playLength: supplier.get(this.lengthField),
                v: supplier.get(this.vField),

                updateRateMs: 50,
            }
        }
    }

    hasSubNodes(): boolean {
        return false;
    }
}