import { IDataSource } from "@nodes/definitions/DataSource";
import { IDataSourceSupplier, INodeModel, OnBlockSettings } from "@nodes/definitions/Node";
import { NumberDataSource } from "../../datasources/NumberDataSource";
import { Registry } from "@registry/Registry";
import { ColorRangeDataSource } from "@nodes/implementations/datasources/ColorRangeDataSource";

// TODO: lang

export class MultiLedGradiantNodeModel implements INodeModel {

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
    private colorField = new ColorRangeDataSource("clr", [1,1,1], [.5,1,1], {
        displayTitle: "Color",
        info: "what color should be set"
    });

    getModelName(): string {
        return "multi_led_gradiant";
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
            procedure: Registry.procedures.ledGradiant,
            options: {
                hFrom: clr.first[0],
                sFrom: clr.first[1],
                vFrom: clr.first[2],
                hTo: clr.second[0],
                sTo: clr.second[1],
                vTo: clr.second[2],

                idxEnd: supplier.get(this.idxEndField),
                idxStart: supplier.get(this.idxStartField),
                ledDelay: supplier.get(this.delayField)
            }
        }
    }

    hasSubNodes(): boolean {
        return false;
    }
}