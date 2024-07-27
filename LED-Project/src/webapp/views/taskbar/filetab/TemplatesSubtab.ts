import { Registry } from "@registry/Registry";
import { Hooks, Template } from "@template/definitions/Template";
import { useProjectStore } from "@webapp/stores/ProjectStore";
import { useVariableStore } from "@webapp/stores/VariableStore";
import { Button, Menu } from "@webapp/utils/taskbar/TaskBar";

// Event: When the hook is clicked
function onClickOnTemplate({ blueprint, hooks, variables }: Template){
    // Askes the user if he really wants to load the template
    if(!confirm("Do you really want to load the template? All your previous work will be lost.")) return;

    const projStore = useProjectStore();
    const varStore = useVariableStore();

    // Loads the blueprint
    if(blueprint !== undefined)
        projStore.codeBlueprint = blueprint;

    // Loads the variables
    if(variables !== undefined)
        for(let name in variables){
            
            // Checks if there are already variables with that name
            if(varStore.variables.some(v=>v.name === name)) continue;

            varStore.addNewVariable(name, variables[name]);
        }
    // Loads the hooks
    if(hooks !== undefined)
        for(let name in hooks)
            projStore.hooks[name as keyof Hooks] = hooks[name as keyof Hooks]!;
}

// Takes in a template and creates its tab
function createTemplateTab(template: Template) : Button {
    return {
        text: `${template.name} from ${template.author}`,
        action: ()=>onClickOnTemplate(template)
    }
}

export const TemplatesSubTab : Menu = {
    text: "Templates",
    icon: "mdi-text-box",
    items: ()=>Object.values(Registry.tempaltes).map(createTemplateTab)
}