import { $t } from "@localisation/Fluent";
import { IDataSourceSupplier } from "@nodes/definitions/Node";
import { OptionDataSource } from "@nodes/implementations/datasources/OptionDataSource";


export function createGoggleSelection(){
    return new OptionDataSource("goggle", "right", {
        displayTitle: $t('models_goggle_util_field_goggle_title'),
        info: $t('models_goggle_util_field_goggle_info'),
        values: {
            "right": $t('models_goggle_util_field_goggle_opt_right'),
            "left": $t('models_goggle_util_field_goggle_opt_left'),
            "both": $t('models_goggle_util_field_goggle_opt_both')
        } as const
    });
}

export function getGoggleSelection(supplier: IDataSourceSupplier, fld: OptionDataSource<"left" | "both" | "right">){
    const val = supplier.get(fld);

    const half = supplier.solveExpression("amt/2");

    let idxStart = val === "left" ? half : 0;

    let size = val === "both" ? supplier.getVariable("amt") : half;

    return {
        idxStart, size
    }
}