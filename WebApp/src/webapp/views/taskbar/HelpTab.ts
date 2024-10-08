import { $t } from "@localisation/Fluent";
import { runAllTests } from "@test/AllTests.test";
import DesktopApi from "@webapp/desktopapi/DesktopApi";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import { Menu, MenuItem } from "@webapp/utils/taskbar/TaskBar";
import Branding from "@webapp/../Branding";
import PWAApi from "@webapp/PWAApi";


// Event: The report bug button is clicked
function onBugReportClicked(){
    if(DesktopApi.isDesktop())
        DesktopApi.openURL(Branding.ISSUE_URL);
    else
        window.open(Branding.ISSUE_URL, '_blank');
}

export const createHelpTab: ()=>Menu = ()=>({
    text: $t('tab_help'),
    items: ()=>[
        {
            text: $t('tab_help_report_bug'),
            action: onBugReportClicked,
            icon: "mdi-bug"
        },
        ...(PWAApi.isInstallable.value ? [{
            text: "Install as PWA!", //TODO: Lang
            action: PWAApi.prompt,
            icon: "mdi-download-outline"
        }] : []),
        // TODO: Add tutorial and FAQ and readme links
    ]
})