import { IDataSource } from "@nodes/definitions/DataSource";
import { IDataSourceSupplier, INodeModel, OnBlockSettings } from "@nodes/definitions/Node";
import { $t } from "@localisation/Fluent";
import { selectBestColorProcedure } from "@webapp/utils/color/SelectBestColorProcedure";
import { OptionDataSource } from "@nodes/implementations/datasources/OptionDataSource";
import { ColorDataSource } from "@nodes/implementations/datasources/ColorDataSource";
import { NumberDataSource } from "@nodes/implementations/datasources/NumberDataSource";
import { createGoggleSelection, getGoggleSelection } from "./GoggleNodeUtils";

export class ColorGoggleNodeModel implements INodeModel {

    private fldGoogle = createGoggleSelection();

    private fldColor = new ColorDataSource("clr", [1,1,1], {
        displayTitle: $t('models_goggle_color_field_color_title'),
        info: $t('models_goggle_color_field_color_info')
    });

    private fldDirection = new OptionDataSource("direction", "forward", {
        displayTitle: $t('models_goggle_color_field_direction_title'),
        info: $t('models_goggle_color_field_direction_info'),
        values: {
            "forward": $t('models_goggle_color_field_direction_opt_forward'),
            "backward": $t('models_goggle_color_field_direction_opt_backward')
        }
    })

    private fldDelay = new NumberDataSource("delay", "0", {
        displayTitle: $t('models_goggle_color_field_delay_title'),
        info: $t('models_goggle_color_field_delay_info'),
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
        return $t('models_goggle_color_block');
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