import { IDataSource } from "@nodes/definitions/DataSource";
import { IDataSourceSupplier, INodeModel, OnBlockSettings } from "@nodes/definitions/Node";
import { NumberDataSource } from "../datasources/NumberDataSource";
import { Registry } from "@registry/Registry";
import { ColorDataSource } from "../datasources/ColorDataSource";
import { OptionDataSource } from "../datasources/OptionDataSource";
import { selectBestColorProcedure } from "@webapp/utils/color/SelectBestColorProcedure";

// TODO: Lang

export class DebugNodeModel implements INodeModel {

    private delayStepField = new NumberDataSource("delayStep", "500", {
        displayTitle: "Delay (Step)",
        info: "",
        type: "int",
        min: 0
    });
    private delayLedField = new NumberDataSource("delayLed", "100", {
        displayTitle: "Delay (Step)",
        info: "",
        type: "int",
        min: 0
    });
    private stepsField = new NumberDataSource("steps", "4", {
        displayTitle: "Steps",
        info: "",
        type: "int",
        min: 0
    });

    private spaceField = new NumberDataSource("space", "2", {
        displayTitle: "Space",
        info: "",
        type: "int",
        min: 0
    });

    private idxField = new NumberDataSource("idx", "5", {
        displayTitle: "Start Index",
        info: "",
        type: "int",
        min: 0
    });

    private stepLengthField = new NumberDataSource("stepLength", "3", {
        displayTitle: "Led Amount",
        info: "",
        type: "int",
        min: 0
    });



    private colorField = new ColorDataSource("clr", [1, 1, 1], {
        displayTitle: "Color",
        info: ""
    });

    private reverseLedField = new OptionDataSource("reverseLed", "yes", {
        values: { "yes": "yes", "no": "No" },
        displayTitle: "Reverse Led",
        info: ""
    })
    private reverseStepField = new OptionDataSource("reverseStep", "yes", {
        values: { "yes": "yes", "no": "No" },
        displayTitle: "Reverse Step",
        info: ""
    })

    private modeField = new OptionDataSource("mode", "parallel", {
        values: { "parallel": "Parallel", "series": "Series" },
        displayTitle: "Mode",
        info: ""
    })

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
        return "Idx: %1;Steps: %2;Space: %3;Size: %4;RevLed: %5; RevStep: %6; LedDel: %7; StepDel: %8;Color %9; Mode %10";
    }
    getOnBlockSources(): IDataSource<any, any, any>[] {
        return [
            this.idxField, this.stepsField, this.spaceField,
            this.stepLengthField, this.reverseLedField, this.reverseStepField,
            this.delayLedField, this.delayStepField, this.colorField, this.modeField
        ]
    }
    getSources(): IDataSource<any, any, any>[] {
        return this.getOnBlockSources();
    }
    createConfigWithProcedure(supplier: IDataSourceSupplier) {
        const color = supplier.get(this.colorField);

        return selectBestColorProcedure({
            idxStart: supplier.get(this.idxField),
            steps: supplier.get(this.stepsField),
            stepSpace: supplier.get(this.spaceField),
            stepSize: supplier.get(this.stepLengthField),
            stepsReversed: supplier.get(this.reverseStepField) === "yes",
            ledsReversed: supplier.get(this.reverseLedField) === "yes",
            ledDelay: supplier.get(this.delayLedField),
            stepDelay: supplier.get(this.delayStepField),
            h: color[0],
            s: color[1],
            v: color[2],
            isParallel: supplier.get(this.modeField) === "parallel"
        })
    }

    hasSubNodes(): boolean {
        return false;
    }

}