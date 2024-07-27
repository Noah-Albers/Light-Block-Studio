
import { FluentBundle, FluentResource } from '@fluent/bundle'

import enFile from "@localisation/languages/en.ftl?raw";
import deFile from "@localisation/languages/de.ftl?raw";
import { createFluentVue } from 'fluent-vue';

// Creates the languages
const Languages = (()=> {
    const en = new FluentBundle("en");
    const de = new FluentBundle("de");

    en.addResource(new FluentResource(enFile));
    de.addResource(new FluentResource(deFile));

    return { en, de }
})();

// Creates the vue language binding
export const Fluent = createFluentVue({ bundles: [] });

// Function to change the language. This must be called at least once at the start to set the initial language
export function changeLanguage(language: "de" | "en"){
    Fluent.bundles = (()=>{
        switch(language){
            case "de":
                return [Languages.de, Languages.en];
            case "en": default:
                return [Languages.en]
        }
    })();
}

export const $t = Fluent.$t;