import { IDataSource } from "@nodes/definitions/DataSource";
import { IDataSourceSupplier, INodeModel, OnBlockSettings } from "@nodes/definitions/Node";
import { $t } from "@localisation/Fluent";
import { selectBestColorProcedure } from "@webapp/utils/color/SelectBestColorProcedure";
import { OptionDataSource } from "@nodes/implementations/datasources/OptionDataSource";
import { ColorDataSource } from "@nodes/implementations/datasources/ColorDataSource";
import { NumberDataSource } from "@nodes/implementations/datasources/NumberDataSource";
import { createGoggleSelection, getGoggleSelection } from "./GoggleNodeUtils";

// TODO: Lang

export class ColorGoggleNodeModel implements INodeModel {

    private fldGoogle = createGoggleSelection();

    private fldColor = new ColorDataSource("clr", [1,1,1], {
        displayTitle: "Color",
        info: "In which color the goggle shall be colored"
    });

    private fldDirection = new OptionDataSource("direction", "forward", {
        displayTitle: "Direction",
        info: "Direction that the animation shall play",
        values: {
            "forward": "forward",
            "backward": "backward"
        }
    })

    private fldDelay = new NumberDataSource("delay", "0", {
        displayTitle: "Delay",
        info: "How many milliseconds to wait between each led",
        min: 0,
        type: "int"
    })

    getModelName(): string {
        return "color_google";
    }
    getOnBlockSettings(): OnBlockSettings {
        return {
            category: "goggles",
            color: 1
        };
    }
    getBlockMessage(): string {
        return "Color %1 google(s) in %2";
    }
    getOnBlockSources(): IDataSource<any, any, any>[] {
        return [this.fldGoogle, this.fldColor]
    }
    getSources(): IDataSource<any, any, any>[] {
        return [...this.getOnBlockSources(), this.fldDelay, this.fldDirection];
    }
    createConfigWithProcedure(supplier: IDataSourceSupplier) {

        const { size, idxStart } = getGoggleSelection(supplier, this.fldGoogle);

        const clr = supplier.get(this.fldColor);
        const isReversed = supplier.get(this.fldDirection) !== "forward";
        const delay = supplier.get(this.fldDelay);

        return selectBestColorProcedure({
            h: clr[0],
            s: clr[1],
            v: clr[2],
            idxStart: idxStart,
            steps: 1,
            isParallel: false,
            ledDelay: delay,
            ledsReversed: isReversed,
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