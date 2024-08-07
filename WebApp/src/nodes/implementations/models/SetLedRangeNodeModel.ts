import { IDataSource } from "@nodes/definitions/DataSource";
import { IDataSourceSupplier, INodeModel, OnBlockSettings } from "@nodes/definitions/Node";
import { NumberDataSource } from "../datasources/NumberDataSource";
import { ColorDataSource } from "../datasources/ColorDataSource";
import { Registry } from "@registry/Registry";
import { $t } from "@localisation/Fluent";

// TODO: lang

export class SetLedRangeNodeModel implements INodeModel {

    // Index of the field
    private idxStartField = new NumberDataSource("idxStart", "0", {
        displayTitle: "Start-Index",
        info: "Starting index for the range.",
        type: "int",
        min: 0
    });

    // Index of the field
    private idxEndField = new NumberDataSource("idxEnd", "amt", {
        displayTitle: "End-Index",
        info: "The index where the range shall stop",
        type: "int",
        min: 0
    });


    // Delay field
    private delayField = new NumberDataSource("ledFelay", "0", {
        displayTitle: "Delay",
        info: "How many milliseconds to wait between the leds.",
        type: "int",
        min: 0
    });

    // Field to select the color
    private colorField = new ColorDataSource("clr", [1,1,1], {
        displayTitle: "Color",
        info: "what color should be set"
    });

    getModelName(): string {
        return "setledrange_simple";
    }

    getOnBlockSettings(): OnBlockSettings {
        return {
            category: "led",
            color: 100
        };
    }
    getBlockMessage(): string {
        return "Color from %1 to %2 in %3";
    }
    getOnBlockSources(): IDataSource<any, any, any>[] {
        return [this.idxStartField, this.idxEndField, this.colorField]
    }
    getSources(): IDataSource<any, any, any>[] {
        return [...this.getOnBlockSources(), this.delayField];
    }
    createConfigWithProcedure(supplier: IDataSourceSupplier) {

        const clr = supplier.get(this.colorField);

        return {
            procedure: Registry.procedures.setLedRangeSimple,
            options: {
                idxStart: supplier.get(this.idxStartField),
                idxEnd: supplier.get(this.idxEndField),
                ledDelay: supplier.get(this.delayField),
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