import { TemplateAdafruitLibrary } from "@template/buildin/TemplateAdafruitLibrary";
import { TemplateSwitchableAnimations } from "@template/buildin/TemplateSwitchableAnimations";

export function registerTemplates() {
    return {
        SwitchableAnimations : TemplateSwitchableAnimations,
        AdafruitLibrary: TemplateAdafruitLibrary
    }
}