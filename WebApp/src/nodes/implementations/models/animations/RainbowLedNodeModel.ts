import { IDataSource } from "@nodes/definitions/DataSource";
import { IDataSourceSupplier, INodeModel, OnBlockSettings } from "@nodes/definitions/Node";
import { NumberDataSource } from "../../datasources/NumberDataSource";
import { ColorDataSource } from "../../datasources/ColorDataSource";
import { Registry } from "@registry/Registry";
import { $t } from "@localisation/Fluent";
import { selectBestColorProcedure } from "@webapp/utils/color/SelectBestColorProcedure";

// TODO: lang

export class RainbowLedNodeModel implements INodeModel {

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


    // Field to offset each led color
    private offsetField = new NumberDataSource("offset", "20", {
        displayTitle: "LED-Offset",
        info: "An offset for each led. Use it to create a flow throughout the stripe.",
        type: "int"
    });

    // Field: Defines how many fast and how many cycles will be done
    private cycleField = new NumberDataSource("cycle", "5000", {
        displayTitle: "Cycle Length in ms",
        info: "How long (in ms) one rainbow-cycle takes to complete.",
        type: "int",
        min: 0
    });

    // Field: Defines how long the animation plays
    private lengthField = new NumberDataSource("length", "5000", {
        displayTitle: "Runtime in ms",
        info: "How long (in ms) the rainbow shall play. Eg. Runtime: 1000ms and cycle length 500ms would be 1s with 2 rainbow cycles.",
        type: "int",
        min: 0
    });

    // Field: Defines the brightness (value) of the rainbow
    private vField = new NumberDataSource("v", "255", {
        displayTitle: "Brightness (0-255)",
        info: "Brightness of the Rainbow.",
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
        return "Rainbow for %1 ms";
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