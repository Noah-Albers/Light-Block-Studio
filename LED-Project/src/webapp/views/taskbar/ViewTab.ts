import { $t } from "@localisation/Fluent";
import { MainViews, useSettingsStore } from "@webapp/stores/SettingsStore";
import { Button, Menu } from "@webapp/utils/taskbar/TaskBar";

export const createViewTab: ()=>Menu = ()=>({
    text: $t('tab_view'),
    items: ()=>[
        {
            text: $t('tab_view_switch'), items: Object.keys(MainViews).map(key=>({
                text: MainViews[key].name(),
                action: switchView(key),
                icon: MainViews[key].icon,
                disabled: useSettingsStore().mainView === key
            } as Button))
        }
    ]
})

function switchView(view: keyof typeof MainViews){
    return ()=>useSettingsStore().mainView = view;
}