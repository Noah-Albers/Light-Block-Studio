import { IDataSource } from "@nodes/definitions/DataSource";
import { IDataSourceSupplier, INodeModel, OnBlockSettings } from "@nodes/definitions/Node";
import { NumberDataSource } from "../datasources/NumberDataSource";
import { Registry } from "@registry/Registry";
import { $t } from "@localisation/Fluent";

export class DelayNodeModel implements INodeModel {

    // Field for the delay
    private delayField = new NumberDataSource("delay", "100", {
        displayTitle: $t('models_delay_field_delay_title'),
        info: $t('models_delay_field_delay_info'),
        type: "int",
        min: 10
    })

    getModelName(): string {
        return "delay";
    }
    getOnBlockSettings(): OnBlockSettings {
        return {
            category: "control",
            color: 240
        };
    }
    getBlockMessage(): string {
        return $t("models_delay_block");
    }
    getOnBlockSources(): IDataSource<any, any, any>[] {
        return [this.delayField]
    }
    getSources(): IDataSource<any, any, any>[] {
        return [this.delayField]
    }
    createConfigWithProcedure(supplier: IDataSourceSupplier) {
        const delay = supplier.get(this.delayField);
        return {
            procedure: Registry.procedures.delay,
            options: {
                delay
            }
        }
    }

    hasSubNodes(): boolean {
        return false;
    }

}