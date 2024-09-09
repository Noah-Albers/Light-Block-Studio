import { IDataSource } from "@nodes/definitions/DataSource";
import { IDataSourceSupplier, INodeModel, OnBlockSettings } from "@nodes/definitions/Node";
import { NumberDataSource } from "../../datasources/NumberDataSource";
import { ColorDataSource } from "../../datasources/ColorDataSource";
import { selectBestColorProcedure } from "@webapp/utils/color/SelectBestColorProcedure";
import { OptionDataSource } from "@nodes/implementations/datasources/OptionDataSource";
import { $t } from "@localisation/Fluent";

export class FullLedNodeModel implements INodeModel {

    private ledsReversedField = new OptionDataSource("ledsReverse", "false", {
        displayTitle: $t('models_fullled_field_ledreverse_title'),
        info: $t('models_fullled_field_ledreverse_info'),
        values: {
            false: $t('models_fullled_field_ledreverse_opt_no'),
            true: $t('models_fullled_field_ledreverse_opt_yes')
        }
    })

    private stepsReversedField = new OptionDataSource("stepsReverse", "false", {
        displayTitle: $t('models_fullled_field_stepsreverse_title'),
        info: $t('models_fullled_field_stepsreverse_info'),
        values: {
            false: $t('models_fullled_field_stepsreverse_opt_no'),
            true: $t('models_fullled_field_stepsreverse_opt_yes')
        }
    })

    private parallelField = new OptionDataSource("seriesType", "serial", {
        displayTitle: $t('models_fullled_field_parallel_title'),
        info: $t('models_fullled_field_parallel_info'),
        values: {
            "parallel": $t('models_fullled_field_parallel_opt_parallel'),
            "serial": $t('models_fullled_field_parallel_opt_serial')
        }
    })

    private ledDelayField = new NumberDataSource("ledDelay", "0", {
        displayTitle: $t('models_fullled_field_delayled_title'),
        info: $t('models_fullled_field_delayled_info'),
        type: "int",
        min: 0
    });

    private stepDelayField = new NumberDataSource("stepDelay", "0", {
        displayTitle: $t('models_fullled_field_delaystep_title'),
        info: $t('models_fullled_field_delaystep_info'),
        type: "int",
        min: 0
    });

    private stepsField = new NumberDataSource("steps", "4", {
        displayTitle: $t('models_fullled_field_steps_title'),
        info: $t('models_fullled_field_steps_info'),
        type: "int",
        min: 1
    });

    private stepSpaceField = new NumberDataSource("stepSpace", "1", {
        displayTitle: $t('models_fullled_field_space_title'),
        info: $t('models_fullled_field_space_info'),
        type: "int",
        min: 0
    });

    private idxStartField = new NumberDataSource("idxStart", "0", {
        displayTitle: $t('models_fullled_field_idxStart_title'),
        info: $t('models_fullled_field_idxStart_info'),
        type: "int",
        min: 0
    });

    private stepSizeField = new NumberDataSource("stepSize", "3", {
        displayTitle: $t('models_fullled_field_stepsize_title'),
        info: $t('models_fullled_field_stepsize_info'),
        type: "int",
        min: 1
    });

    private colorField = new ColorDataSource("clr", [1,1,1], {
        displayTitle: $t('models_fullled_field_color_title'),
        info: $t('models_fullled_field_color_info')
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
        return $t('models_fullled_block');
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