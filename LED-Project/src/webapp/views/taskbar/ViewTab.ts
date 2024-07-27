import { MainViews, useSettingsStore } from "@webapp/stores/SettingsStore";
import { Button, Menu } from "@webapp/utils/taskbar/TaskBar";

export const ViewTab: Menu = {
    text: "View",
    items: ()=>[
        {
            text: "Switch", items: Object.keys(MainViews).map(key=>({
                text: MainViews[key].name(),
                action: switchView(key),
                icon: MainViews[key].icon,
                disabled: useSettingsStore().mainView === key
            } as Button))
        }
    ]
}

function switchView(view: keyof typeof MainViews){
    return ()=>useSettingsStore().mainView = view;
}