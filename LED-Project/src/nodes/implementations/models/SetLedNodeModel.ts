import { IDataSource } from "@nodes/definitions/DataSource";
import { IDataSourceSupplier, INodeModel, OnBlockSettings } from "@nodes/definitions/Node";
import { NumberDataSource } from "../datasources/NumberDataSource";
import { ColorDataSource } from "../datasources/ColorDataSource";
import { ColorRangeDataSource } from "../datasources/ColorRangeDataSource";

export class SetLedNodeModel implements INodeModel {

    // Index of the field
    private idxField = new NumberDataSource("idx", "0", {
        info: "Index of the led. Starting from 0 (first).",
        type: "int",
        min: 0
    })

    // Field to select the color
    private colorField = new ColorDataSource("clr", [1,1,1], {
        info: "what color should be set"
    });

    private colorRangeField = new ColorRangeDataSource("clr", [1,1,1], [0.2,1,1], {
        info: "what color range should be set"
    })

    getModelName(): string {
        return "setled";
    }
    getOnBlockSettings(): OnBlockSettings {
        return {
            category: "led",
            color: 100
        };
    }
    getBlockMessage(): string {
        return "Color led %1 in %2 or with %3";
    }
    getOnBlockSources(): IDataSource<any>[] {
        return [this.idxField, this.colorField, this.colorRangeField]
    }
    getSources(): IDataSource<any>[] {
        return this.getOnBlockSources();
    }
    createConfigWithProcedure(supplier: IDataSourceSupplier) {
        throw new Error("Method not implemented.");
    }

    hasSubModules(): boolean {
        return true;
    }
}