import { MainViews, useSettingsStore, ViewVisualizer } from "@webapp/stores/SettingsStore";
import { Button, Menu } from "@webapp/utils/taskbar/TaskBar";

export const ViewTab: Menu = {
    text: "View",
    items: ()=>[
        {
            text: "Switch", items: Object.keys(MainViews).map(name=>({
                text: name,
                action: switchView(name),
                icon: MainViews[name].icon,
                disabled: useSettingsStore().mainView === name
            } as Button))
        }
    ]
}

function switchView(view: keyof typeof MainViews){
    return ()=>useSettingsStore().mainView = view;
}