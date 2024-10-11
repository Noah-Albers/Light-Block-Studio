import { $t } from "@localisation/Fluent";
import { ProcedureWithOptions } from "@procedure/definitions/Procedure";
import { sendSignalAwaitResponse } from "@webapp/utils/signals/SignalAwaiter";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import { generateCode } from "@webapp/views/codeview/CodeGenerator";

 /**
 * When the user wants to copy the generated code
 */
 async function copyCode() {

    try {
        // Gets the config
        const { setup, loop } = await sendSignalAwaitResponse(Signals.REQUEST_CONFIG_BUILD, undefined, Signals.BLOCKLY_ALL_CREATE_CONFIG) as { setup: ProcedureWithOptions<any>[], loop: ProcedureWithOptions<any>[] };

        // Build the code
        const code = generateCode(setup, loop);

        await navigator.clipboard.writeText(code);

        SignalDispatcher.emit(Signals.DISPLAY_SNACKBAR, { text: $t('popup_codecopied') })
    } catch (err) {
        console.error("Failed to copy / create code", err);
    }
}

export default {
    copyCode
}