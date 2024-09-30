import { $t } from "@localisation/Fluent";
import { runAllTests } from "@test/AllTests.test";
import DesktopApi from "@webapp/desktopapi/DesktopApi";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import { Menu, MenuItem } from "@webapp/utils/taskbar/TaskBar";

// Event: When the run tests button is clicked
function onRuntestsClicked(){
    
    const errorAmount = runAllTests();

    // Shows a popup as an info
    SignalDispatcher.emit(Signals.DISPLAY_SNACKBAR, {
        text: errorAmount <= 0 ? $t('developer_runtests_info_success') : $t('developer_runtests_info_error', { errors: errorAmount }),
        timeout: 5000,
        type: errorAmount <= 0 ? "success" : "warning"
    })
}

export const createDeveloperTab: ()=>Menu = ()=>({
    text: $t('tab_developer'),
    items: ()=>[
        {
            text: $t('tab_developer_runTests'),
            action: onRuntestsClicked,
            icon: "mdi-test-tube"
        },
        ...(DesktopApi.isDesktop() ? [{
            text: $t('tab_developer_open_devtools'),
            action: DesktopApi.openDevTools,
            icon: "mdi-test-tube"
        }] as MenuItem[] : [])
        
    ]
})