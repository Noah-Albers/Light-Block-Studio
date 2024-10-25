import { Menu } from "@webapp/utils/taskbar/TaskBar";
import { $t } from "@localisation/Fluent";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import { sendSignalAwaitResponse } from "@webapp/utils/signals/SignalAwaiter";
import { generateCode } from "../codeview/CodeGenerator";
import { ProcedureWithOptions } from "@procedure/definitions/Procedure";
import UiActions from "@webapp/globalactions/UiActions";

export const createEditTab: () => Menu = () => {

    // Icon to copy the code
    const copyCode = {
        text: $t('tab_edit_copycode'),
        action: UiActions.copyCode,
        title: $t('tab_edit_copycode_title'),
        icon: "mdi-code-tags"
    }

    // Icon to reload the config
    const reloadItem = {
        text: $t('tab_edit_config'),
        action: ()=> SignalDispatcher.emit(Signals.REQUEST_CONFIG_BUILD),
        title: $t('tab_edit_config_title'),
        icon: "mdi-hammer"
    }

    // TODO: Lang
    const setAmtFromPreview = {
        text: "Sync Preview with led amount",
        title: "Copies the amount from the preview to the led-amount field of the project.",
        icon: "mdi-arrow-u-down-right",
        action: ()=>SignalDispatcher.emit(Signals.REQUEST_COPY_PREVIEW_AMT_TO_LED_AMT)
    }

    return {
        text: $t('tab_edit'),
        items: [
            copyCode,
            reloadItem,
            setAmtFromPreview
        ]
    }
}