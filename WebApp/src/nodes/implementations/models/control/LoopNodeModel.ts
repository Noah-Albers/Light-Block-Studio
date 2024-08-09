import { IDataSource } from "@nodes/definitions/DataSource";
import { IDataSourceSupplier, INodeModel, OnBlockSettings } from "@nodes/definitions/Node";
import { NumberDataSource } from "../../datasources/NumberDataSource";
import { Registry } from "@registry/Registry";
import { $t } from "@localisation/Fluent";

export class LoopNodeModel implements INodeModel {

    // Index of the field
    private repeatField = new NumberDataSource("repeats", "2", {
        displayTitle: $t('models_loop_field_repeats_title'),
        info: $t('models_loop_field_repeats_info'),
        type: "int",
        min: 0
    })

    getModelName(): string {
        return "loop";
    }
    getOnBlockSettings(): OnBlockSettings {
        return {
            category: "control",
            color: 240
        };
    }
    getBlockMessage(): string {
        return $t('models_loop_block');
    }
    getOnBlockSources(): IDataSource<any, any, any>[] {
        return [this.repeatField]
    }
    getSources(): IDataSource<any, any, any>[] {
        return this.getOnBlockSources();
    }
    createConfigWithProcedure(supplier: IDataSourceSupplier) {

        const repeats = supplier.get(this.repeatField);

        const subs = supplier.buildConfigOfSubnodes();

        return {
            procedure: Registry.procedures.loop,
            options: {
                repeats,
                sub: subs
            }
        }
    }

    hasSubNodes(): boolean {
        return true;
    }
}