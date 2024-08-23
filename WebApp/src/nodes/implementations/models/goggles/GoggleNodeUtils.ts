import { IDataSourceSupplier } from "@nodes/definitions/Node";
import { OptionDataSource } from "@nodes/implementations/datasources/OptionDataSource";


export function createGoggleSelection(){
    return new OptionDataSource("goggle", "right", {
        displayTitle: "Which goggle to color",
        info: "Select the goggle which shall be colored.",
        values: {
            "right": "the right",
            "left": "the left",
            "both": "both"
        } as const
    });
}

export function getGoggleSelection(supplier: IDataSourceSupplier, fld: OptionDataSource){
    const val = supplier.get(fld);

    const half = supplier.solveExpression("amt/2");

    let idxStart = val === "left" ? half : 0;

    let size = val === "both" ? supplier.getVariable("amt") : half;

    return {
        idxStart, size
    }
}