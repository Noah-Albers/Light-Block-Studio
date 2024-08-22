import { $t } from "@localisation/Fluent";
import { Registry } from "@registry/Registry";
import { Hooks, Template } from "@template/definitions/Template";
import { useProjectStore } from "@webapp/stores/ProjectStore";
import { useVariableStore } from "@webapp/stores/VariableStore";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import { Button, Menu } from "@webapp/utils/taskbar/TaskBar";

// Event: When the hook is clicked
function onClickOnTemplate(tmp: Template){
    // Askes the user if he really wants to load the template
    if(!confirm($t('templates_prompt_load'))) return;

    const projStore = useProjectStore();
    const varStore = useVariableStore();

    // Loads the variables
    if(tmp.variables !== undefined)
        for(let name in tmp.variables){
            
            // Checks if there are already variables with that name
            if(varStore.variables.some(v=>v.name === name)) continue;

            varStore.addNewVariable(name, tmp.variables[name]);
        }

    projStore.applyTemplate(tmp)

    // Sends the signal to rebuild the config
    SignalDispatcher.emit(Signals.REQUEST_CONFIG_BUILD);
}

// Takes in a template and creates its tab
function createTemplateTab(template: Template) : Button {
    return {
        text: $t('template_name', { template: template.name, author: template.author }),
        action: ()=>onClickOnTemplate(template)
    }
}

export const createTemplateSubTab: ()=>Menu = ()=>({
    text: $t('templates_title'),
    icon: "mdi-text-box",
    items: ()=>Object.values(Registry.templates).map(createTemplateTab)
})