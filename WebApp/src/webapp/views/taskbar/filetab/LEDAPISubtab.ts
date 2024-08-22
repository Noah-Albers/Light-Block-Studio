import { $t } from "@localisation/Fluent";
import { Registry } from "@registry/Registry";
import { Hooks, Template } from "@template/definitions/Template";
import { LEDAPIAdafruitPreset } from "@template/ledapi/LEDAPIAdafruit";
import { LEDAPIFastLedPreset } from "@template/ledapi/LEDAPIFastLED";
import { useProjectStore } from "@webapp/stores/ProjectStore";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import { Button, Menu } from "@webapp/utils/taskbar/TaskBar";

// Event: When the hook is clicked
function onClick(type: "FastLED" | "Adafruit"){
    const store = useProjectStore();

    store.applyLEDSystemPreset(type == "FastLED" ? LEDAPIFastLedPreset : LEDAPIAdafruitPreset);

    // Sends the signal to rebuild the config
    SignalDispatcher.emit(Signals.REQUEST_CONFIG_BUILD);
}

export const createLEDApiSubTab: ()=>Menu = ()=>({
    text: $t('file_tab_ledapi'),
    icon: "mdi-led-outline",
    items: ()=>([
        { text: $t('file_tab_ledapi_fastled'), action: ()=>onClick('FastLED') },
        { text: $t('file_tab_ledapi_adafruit'), action: ()=>onClick('Adafruit') },
    ])
})