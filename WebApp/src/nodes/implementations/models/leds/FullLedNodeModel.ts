import { IDataSource } from "@nodes/definitions/DataSource";
import { IDataSourceSupplier, INodeModel, OnBlockSettings } from "@nodes/definitions/Node";
import { NumberDataSource } from "../../datasources/NumberDataSource";
import { ColorDataSource } from "../../datasources/ColorDataSource";
import { $t } from "@localisation/Fluent";
import { selectBestColorProcedure } from "@webapp/utils/color/SelectBestColorProcedure";
import { OptionDataSource } from "@nodes/implementations/datasources/OptionDataSource";

// TODO: Language

export class FullLedNodeModel implements INodeModel {

   /*
    ledsReversed: reversed,
    stepsReversed: reversed,

    h: clr[0],
    s: clr[1],
    v: clr[2],
    */

    private ledsReversedField = new OptionDataSource("ledsReverse", "false", {
        displayTitle: "Are the leds reversed?",
        info: "If the leds should be reversed when animating",
        values: {
            false: "No",
            true: "Yes"
        }
    })

    private stepsReversedField = new OptionDataSource("stepsReverse", "false", {
        displayTitle: "Are the steps reversed?",
        info: "If the step should be reversed when animating",
        values: {
            false: "No",
            true: "Yes"
        }
    })

    private parallelField = new OptionDataSource("seriesType", "serial", {
        displayTitle: "Type",
        info: "If the animation is parallel or serial",
        values: {
            "parallel": "Parallel",
            "serial": "Serial"
        }
    })

    private ledDelayField = new NumberDataSource("ledDelay", "0", {
        displayTitle: "Delay (Per Led)",
        info: "Milliseconds to wait between leds",
        type: "int",
        min: 0
    });

    private stepDelayField = new NumberDataSource("stepDelay", "0", {
        displayTitle: "Delay (Per Step)",
        info: "Milliseconds to wait between steps",
        type: "int",
        min: 0
    });

    private stepsField = new NumberDataSource("steps", "4", {
        displayTitle: "Steps",
        info: "How many steps there are",
        type: "int",
        min: 1
    });

    private stepSpaceField = new NumberDataSource("stepSpace", "1", {
        displayTitle: "Space between Steps",
        info: "Amount of leds to be empty between steps",
        type: "int",
        min: 0
    });

    private idxStartField = new NumberDataSource("idxStart", "0", {
        displayTitle: "Start-Index",
        info: "Index-Offset to start the animation from",
        type: "int",
        min: 0
    });

    private stepSizeField = new NumberDataSource("stepSize", "3", {
        displayTitle: "Step Size",
        info: "How long each step is in size.",
        type: "int",
        min: 1
    });

    private colorField = new ColorDataSource("clr", [1,1,1], {
        displayTitle: "Color",
        info: "What color should be set."
    });

    getModelName(): string {
        return "full_led";
    }

    getOnBlockSettings(): OnBlockSettings {
        return {
            category: "led",
            color: 100
        };
    }
    getBlockMessage(): string {
        return "Color %1 steps in %2 with %3 space";
    }
    getOnBlockSources(): IDataSource<any, any, any>[] {
        return [this.stepsField, this.colorField, this.stepSpaceField]
    }
    getSources(): IDataSource<any, any, any>[] {
        return [
            this.idxStartField,
            this.stepsField,
            this.stepSizeField,
            this.stepSpaceField,
            this.colorField,
            this.parallelField,
            this.ledsReversedField,
            this.stepsReversedField,
            this.ledDelayField,
            this.stepDelayField,
        ];
    }
    createConfigWithProcedure(supplier: IDataSourceSupplier) {

        const clr = supplier.get(this.colorField);

        return selectBestColorProcedure({
            idxStart: supplier.get(this.idxStartField),
            ledsReversed: supplier.get(this.ledsReversedField) === "true",
            stepsReversed: supplier.get(this.stepsReversedField) === "true",
            stepSize: supplier.get(this.stepSizeField),
            ledDelay: supplier.get(this.ledDelayField),
            h: clr[0],
            s: clr[1],
            v: clr[2],
            isParallel: supplier.get(this.parallelField) === "parallel",
            stepDelay: supplier.get(this.stepDelayField),
            steps: supplier.get(this.stepsField),
            stepSpace: supplier.get(this.stepSpaceField)
        })
    }

    hasSubNodes(): boolean {
        return false;
    }
}