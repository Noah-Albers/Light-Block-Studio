import { IDataSource } from "@nodes/definitions/DataSource";
import { IDataSourceSupplier, INodeModel, OnBlockSettings } from "@nodes/definitions/Node";
import { NumberDataSource } from "../../datasources/NumberDataSource";
import { ColorDataSource } from "../../datasources/ColorDataSource";
import { Registry } from "@registry/Registry";
import { $t } from "@localisation/Fluent";
import { selectBestColorProcedure } from "@webapp/utils/color/SelectBestColorProcedure";
import { ColorRangeDataSource } from "@nodes/implementations/datasources/ColorRangeDataSource";

// TODO: lang

export class FadeLedNodeModel implements INodeModel {

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
        info: "How long (in ms) one color-cycle takes to complete.",
        type: "int",
        min: 0
    });

    // Field: Defines how long the animation plays
    private lengthField = new NumberDataSource("length", "5000", {
        displayTitle: "Runtime in ms",
        info: "How long (in ms) the cycle shall play. Eg. Runtime: 1000ms and cycle length 500ms would be 1s with 2 color-cycles.",
        type: "int",
        min: 0
    });

    // Field to select the color
    private colorField = new ColorRangeDataSource("clr", [1,1,1], [.5,1,1], {
        displayTitle: "Color",
        info: "what color should be faded"
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
        return "Color-Cycle of %1 for %2 ms";
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