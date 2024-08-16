import { IDataSource } from "@nodes/definitions/DataSource";
import { IDataSourceSupplier, INodeModel, OnBlockSettings } from "@nodes/definitions/Node";
import { $t } from "@localisation/Fluent";
import { selectBestColorProcedure } from "@webapp/utils/color/SelectBestColorProcedure";
import { OptionDataSource } from "@nodes/implementations/datasources/OptionDataSource";

// TODO: Lang

export class TurnXGoggleOffNodeModel implements INodeModel {

    private fldGoogle = new OptionDataSource("goggle", "right", {
        displayTitle: "Which goggle to turn off",
        info: "Select the goggle which shall be turned of by this node.",
        values: {
            "right": "the right",
            "left": "the left",
            "both": "both"
        } as const
    })

    getModelName(): string {
        return "turn_x_goggle_off";
    }
    getOnBlockSettings(): OnBlockSettings {
        return {
            category: "goggles",
            color: 1
        };
    }
    getBlockMessage(): string {
        return "Turn %1 goggle(s) off";
    }
    getOnBlockSources(): IDataSource<any, any, any>[] {
        return [this.fldGoogle]
    }
    getSources(): IDataSource<any, any, any>[] {
        return this.getOnBlockSources();
    }
    createConfigWithProcedure(supplier: IDataSourceSupplier) {

        // Gets the indexes

        const val = supplier.get(this.fldGoogle);

        const half = supplier.solveExpression("amt/2");

        let idxStart = val === "left" ? half : 0;

        let size = val === "both" ? supplier.getVariable("amt") : half;

        return selectBestColorProcedure({
            h: 0,
            s: 0,
            v: 0,
            idxStart: idxStart,
            steps: 1,
            isParallel: false,
            ledDelay: 0,
            ledsReversed: false,
            stepDelay: 0,
            stepSize: size,
            stepSpace: 0,
            stepsReversed: false
        });
    }

    hasSubNodes(): boolean {
        return false;
    }
}