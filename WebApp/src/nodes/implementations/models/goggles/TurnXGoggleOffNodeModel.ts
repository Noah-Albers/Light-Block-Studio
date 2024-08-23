import { IDataSource } from "@nodes/definitions/DataSource";
import { IDataSourceSupplier, INodeModel, OnBlockSettings } from "@nodes/definitions/Node";
import { $t } from "@localisation/Fluent";
import { selectBestColorProcedure } from "@webapp/utils/color/SelectBestColorProcedure";
import { OptionDataSource } from "@nodes/implementations/datasources/OptionDataSource";
import { createGoggleSelection, getGoggleSelection } from "./GoggleNodeUtils";

// TODO: Lang

export class TurnXGoggleOffNodeModel implements INodeModel {

    private fldGoogle = createGoggleSelection();

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

        const { size, idxStart } = getGoggleSelection(supplier, this.fldGoogle);

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