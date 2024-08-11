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
    private updateRate = new NumberDataSource("updateRate", "50", {
        displayTitle: "UpdateRate",
        info: "How many milliseconds to wait between the leds.",
        type: "int",
        min: 0
    });

    private offsetField = new NumberDataSource("offset", "20", {
        displayTitle: "Offset (Per Led)",
        info: "How many milliseconds to wait between the leds.",
        type: "int",
    });

    private lengthField = new NumberDataSource("length", "1000", {
        displayTitle: "Playlength",
        info: "How many milliseconds to wait between the leds.",
        type: "int",
        min: 0
    });

    private cycleLengthField = new NumberDataSource("cycle", "500", {
        displayTitle: "Cycle Length",
        info: "How many milliseconds to wait between the leds.",
        type: "int",
        min: 0
    });

    private vField = new NumberDataSource("v", "255", {
        displayTitle: "V",
        info: "How many milliseconds to wait between the leds.",
        type: "int",
        min: 0
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
        return "From %1 to %2 play %4ms; Cycle %3ms; Offset: %5; V: %6; UpdRate: %7";
    }
    getOnBlockSources(): IDataSource<any, any, any>[] {
        return [
            this.idxStartField,
            this.idxEndField,
            this.cycleLengthField,
            this.lengthField,
            this.offsetField,
            this.vField,
            this.updateRate
        ]
    }
    getSources(): IDataSource<any, any, any>[] {
        return this.getOnBlockSources();
    }
    createConfigWithProcedure(supplier: IDataSourceSupplier) {
        
        const offset = supplier.get(this.offsetField);
        console.log("Offset: ",offset);

        return {
            procedure: Registry.procedures.rainbow,
            options: {
                cycleMs: supplier.get(this.cycleLengthField),
                idxStart: supplier.get(this.idxStartField),
                idxEnd: supplier.get(this.idxEndField),
                ledOffsetMs: offset,
                updateRateMs: supplier.get(this.updateRate),
                playLength: supplier.get(this.lengthField),
                v: supplier.get(this.vField),
            }
        }
    }

    hasSubNodes(): boolean {
        return false;
    }

}