import { $t } from "@localisation/Fluent";
import { ProcedureWithOptions } from "@procedure/definitions/Procedure";
import ImportExportUi from "@webapp/storage/ImportExportUi";
import { sendSignalAwaitResponse } from "@webapp/utils/signals/SignalAwaiter";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import { generateCode } from "@webapp/views/codeview/CodeGenerator";

// Shows the save project file dialog
async function save(type: "save" | "saveas") {
    if(type === "save")
        await ImportExportUi.default.save();
    else
        await ImportExportUi.default.saveAs();
    SignalDispatcher.emit(Signals.DISPLAY_MINI_INFO, {
        icon: "mdi-content-save-outline", text: $t('miniinfo_saved_project')
    });
}

// Shows the open project file dialog
function open(){
    ImportExportUi.default.open();
}





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
    copyCode,
    save,
    open
}