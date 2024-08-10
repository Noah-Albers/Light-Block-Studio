import { IDataSource } from "@nodes/definitions/DataSource";
import { IDataSourceSupplier, INodeModel, OnBlockSettings } from "@nodes/definitions/Node";
import { NumberDataSource } from "../datasources/NumberDataSource";
import { Registry } from "@registry/Registry";
import { ColorDataSource } from "../datasources/ColorDataSource";
import { OptionDataSource } from "../datasources/OptionDataSource";
import { selectBestColorProcedure } from "@webapp/utils/color/SelectBestColorProcedure";
import { ColorRangeDataSource } from "../datasources/ColorRangeDataSource";

// TODO: Lang

export class DebugNodeModel implements INodeModel {

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
    private colorField = new ColorRangeDataSource("clr", [1,1,1], [.5,.5,.5], {
        displayTitle: "Color",
        info: "what color should be set"
    });

    getModelName(): string {
        return "debug";
    }
    getOnBlockSettings(): OnBlockSettings {
        return {
            category: "debug",
            color: 240
        };
    }
    getBlockMessage(): string {
        return "From %1 to %2 Color in %3 (Delay %4)";
    }
    getOnBlockSources(): IDataSource<any, any, any>[] {
        return [
            this.idxStartField,
            this.idxEndField,
            this.colorField,
            this.delayField,
        ]
    }
    getSources(): IDataSource<any, any, any>[] {
        return this.getOnBlockSources();
    }
    createConfigWithProcedure(supplier: IDataSourceSupplier) {
        const color = supplier.get(this.colorField);

        return {
            procedure: Registry.procedures.ledGradiant,
            options: {
                idxStart: supplier.get(this.idxStartField),
                idxEnd: supplier.get(this.idxEndField),
                hFrom: color.first[0],
                sFrom: color.first[1],
                vFrom: color.first[2],
                hTo: color.second[0],
                sTo: color.second[1],
                vTo: color.second[2],
                ledDelay: supplier.get(this.delayField)
            }
        }
    }

    hasSubNodes(): boolean {
        return false;
    }

}