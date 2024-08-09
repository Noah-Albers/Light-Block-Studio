import { IDataSource } from "@nodes/definitions/DataSource";
import { IDataSourceSupplier, INodeModel, OnBlockSettings } from "@nodes/definitions/Node";
import { NumberDataSource } from "../../datasources/NumberDataSource";
import { ColorDataSource } from "../../datasources/ColorDataSource";
import { Registry } from "@registry/Registry";
import { $t } from "@localisation/Fluent";
import { selectBestColorProcedure } from "@webapp/utils/color/SelectBestColorProcedure";


// TODO: Language
export class ClearAllLedsNodeModel implements INodeModel {

    getModelName(): string {
        return "clearleds";
    }
    getOnBlockSettings(): OnBlockSettings {
        return {
            category: "led",
            color: 100
        };
    }
    getBlockMessage(): string {
        return "Turn all leds off";
    }
    getOnBlockSources(): IDataSource<any, any, any>[] {
        return []
    }
    getSources(): IDataSource<any, any, any>[] {
        return this.getOnBlockSources();
    }
    createConfigWithProcedure(supplier: IDataSourceSupplier) {

        return selectBestColorProcedure({
            h: 0,
            s: 0,
            v: 0,
            idxStart: 0,
            steps: 1,
            isParallel: false,
            ledDelay: 0,
            ledsReversed: false,
            stepDelay: 0,
            stepSize: supplier.getVariable("amt"),
            stepSpace: 0,
            stepsReversed: false
        })
    }

    hasSubNodes(): boolean {
        return false;
    }
}