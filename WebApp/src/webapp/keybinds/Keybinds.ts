import DesktopApi from "@webapp/desktopapi/DesktopApi"
import UiActions from "@webapp/globalactions/UiActions";
import ImportExportUi from "@webapp/storage/ImportExportUi"
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import hotkeys from "hotkeys-js"

export function setupKeybinds(){

    // Save-hotkey
    hotkeys("ctrl+shift+s, command+shift+s, ctrl+s, command+s", (evt, handler)=>{
        evt.preventDefault();
        if(handler.key.indexOf("shift") === -1)
            ImportExportUi.default.save();
        else
            ImportExportUi.default.saveAs();
    });

    // Open hotkey
    hotkeys("ctrl+o, command+o", evt=>{
        evt.preventDefault();
        ImportExportUi.default.open();
    });

    // Reload config hotkey
    hotkeys("ctrl+r, command+r", evt=>{
        evt.preventDefault();
        SignalDispatcher.emit(Signals.REQUEST_CONFIG_BUILD);
    });

    // Copy-code hotkey
    hotkeys("ctrl+shift+c, command+shift+c", evt=>{
        evt.preventDefault();
        UiActions.copyCode();
    });
}