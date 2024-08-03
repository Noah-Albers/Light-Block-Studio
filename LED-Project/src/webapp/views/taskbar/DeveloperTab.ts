import { $t } from "@localisation/Fluent";
import { runAllTests } from "@test/AllTests.test";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import { Menu } from "@webapp/utils/taskbar/TaskBar";

// Event: When the run tests button is clicked
function onRuntestsClicked(){
    
    const errorAmount = runAllTests();

    // Shows a popup as an info
    SignalDispatcher.emit(Signals.DISPLAY_POPUP, {
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
        }
    ]
})