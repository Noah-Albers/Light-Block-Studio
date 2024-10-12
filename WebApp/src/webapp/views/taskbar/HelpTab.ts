import { $t } from "@localisation/Fluent";
import { runAllTests } from "@test/AllTests.test";
import DesktopApi from "@webapp/desktopapi/DesktopApi";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import { Menu, MenuItem } from "@webapp/utils/taskbar/TaskBar";
import Branding from "@webapp/../Branding";
import PWAApi from "@webapp/PWAApi";
import PlatformUtils from "@webapp/utils/PlatformUtils";

export const createHelpTab: ()=>Menu = ()=>({
    text: $t('tab_help'),
    items: ()=>[
        {
            text: $t('tab_help_report_bug'),
            action: ()=>PlatformUtils.openURL(Branding.ISSUE_URL),
            icon: "mdi-bug"
        }, {
            text: $t('tab_help_install_pwa'),
            action: PWAApi.prompt,
            icon: "mdi-download-outline",
            disabled: !PWAApi.isInstallable.value,
            title: PWAApi.isInstallable.value ? undefined : $t('tab_help_install_pwa_not_supported')
        }, {
            text: 'About',
            action: ()=>PlatformUtils.openURL(Branding.ABOUT_URL),
            icon: "mdi-information-outline"
        }, {
            text: "View Shortcuts",
            action: ()=>SignalDispatcher.emit(Signals.OPEN_KEYBOARD_INFO),
            icon: "mdi-keyboard-variant"
        }

        // TODO: Lang

        // TODO: Add tutorial and FAQ and readme links
    ]
})