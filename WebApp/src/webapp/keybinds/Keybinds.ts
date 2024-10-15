import UiActions from "@webapp/globalactions/UiActions";
import { useSettingsStore } from "@webapp/stores/SettingsStore";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import hotkeys from "hotkeys-js"

export function setupKeybinds(){

    // Save-hotkey
    hotkeys("ctrl+shift+s, command+shift+s, ctrl+s, command+s", (evt, handler)=>{
        evt.preventDefault();
        if(handler.key.indexOf("shift") === -1)
            UiActions.save("save");
        else
            UiActions.save("saveas")
    });

    // Open hotkey
    hotkeys("ctrl+o, command+o", evt=>{
        evt.preventDefault();
        UiActions.open();
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

    // Cycle through the view
    hotkeys("ctrl+shift+v,command+shift+v", evt=>{
        evt.preventDefault();
        const store = useSettingsStore();
        store.mainView = (()=>{
            switch(store.mainView){
                default: case "code": return "visualizer";
                case "visualizer": return "serial";
                case "serial": return "code";
            };
        })();
    })

    // Open Settings hotkey
    hotkeys("ctrl+.,command+.", evt=>{
        evt.preventDefault();
        SignalDispatcher.emit(Signals.OPEN_SETTINGS);
    })
}