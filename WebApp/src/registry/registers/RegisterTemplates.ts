import { TemplateDefault } from "@template/buildin/TemplateDefault";
import { TemplateSwitchableAnimations } from "@template/buildin/TemplateSwitchableAnimations";

export function registerTemplates() {
    return {
        Default: TemplateDefault,
        SwitchableAnimations : TemplateSwitchableAnimations,
    }
}