import { $t } from "@localisation/Fluent";
import { Menu } from "@webapp/utils/taskbar/TaskBar";

export const createDeveloperTab: ()=>Menu = ()=>({
    text: $t('tab_developer'),
    items: ()=>[
    ]
})