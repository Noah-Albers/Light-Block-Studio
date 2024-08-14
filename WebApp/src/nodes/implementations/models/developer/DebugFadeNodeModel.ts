import { IDataSource } from "@nodes/definitions/DataSource";
import { IDataSourceSupplier, INodeModel, OnBlockSettings } from "@nodes/definitions/Node";
import { NumberDataSource } from "../../datasources/NumberDataSource";
import { Registry } from "@registry/Registry";
import { ColorDataSource } from "../../datasources/ColorDataSource";
import { OptionDataSource } from "../../datasources/OptionDataSource";
import { selectBestColorProcedure } from "@webapp/utils/color/SelectBestColorProcedure";
import { ColorRangeDataSource } from "../../datasources/ColorRangeDataSource";

export class DebugFadeNodeModel implements INodeModel {

    // Index of the field
    private idxStartField = new NumberDataSource("idxStart", "0", {
        displayTitle: "Start-Index",
        info: "",
        type: "int",
        min: 0
    });

    // Index of the field
    private idxEndField = new NumberDataSource("idxEnd", "amt", {
        displayTitle: "End-Index",
        info: "",
        type: "int",
    });


    // Delay field
    private updateRate = new NumberDataSource("updateRate", "50", {
        displayTitle: "UpdateRate",
        info: "",
        type: "int",
    });

    private offsetField = new NumberDataSource("offset", "20", {
        displayTitle: "Offset (Per Led)",
        info: "",
        type: "int",
    });

    private lengthField = new NumberDataSource("length", "1000", {
        displayTitle: "Playlength",
        info: "",
        type: "int",
    });

    private cycleLengthField = new NumberDataSource("cycle", "500", {
        displayTitle: "Cycle Length",
        info: "",
        type: "int",
    });

    private colorField = new ColorRangeDataSource("clr", [1,1,1], [.5,.5,.5],{
        displayTitle: "Color",
        info: ""
    })

    getModelName(): string {
        return "debug_fade_proc";
    }
    getOnBlockSettings(): OnBlockSettings {
        return {
            category: "debug",
            color: 240
        };
    }
    getBlockMessage(): string {
        return "Debug Fade-Procedure";
    }
    getOnBlockSources(): IDataSource<any, any, any>[] {
        return []
    }
    getSources(): IDataSource<any, any, any>[] {
        return [
            this.idxStartField,
            this.idxEndField,
            this.cycleLengthField,
            this.lengthField,
            this.offsetField,
            this.updateRate,
            this.colorField
        ];
    }
    createConfigWithProcedure(supplier: IDataSourceSupplier) {
        
        const clr = supplier.get(this.colorField);

        return {
            procedure: Registry.procedures.fade,
            options: {
                cycleMs: supplier.get(this.cycleLengthField),
                idxStart: supplier.get(this.idxStartField),
                idxEnd: supplier.get(this.idxEndField),
                ledOffsetMs: supplier.get(this.offsetField),
                updateRateMs: supplier.get(this.updateRate),
                playLength: supplier.get(this.lengthField),
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