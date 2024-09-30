import { z } from "zod";
import { int, min } from "../ZodUtil"
import { SupportedLanguages } from "@localisation/Fluent";
import { BuildInPreviews, MainViews } from "@webapp/stores/SettingsStore";

//#region Schemas

const InternalSchemas = {
    PlainSettings: z.object({
        recentProjectPaths: z.array(z.string()).default([]),
        language: z.enum(SupportedLanguages.map(x=>x.key) as [string, ...string[]]),
        isDeveloper: z.boolean(),
        mainView: z.enum(Object.keys(MainViews) as [string, ...string[]]),

        serialPreview: z.object({
            pin: z.any().transform(int()).transform(min(0)),
            ledAmount: z.any().transform(int()).transform(min(0)),
        }),

        usbVendorsWhitelist: z.object({
            enabled: z.boolean(),
            whitelist: z.array(z.tuple([z.string(), z.number()]))
        }),

        buildConfig: z.object({
            enablePreview: z.boolean()
        }),

        defaultPreview: z.union([
            z.string(),
            z.any().transform(int()).transform(min(0)),
        ]).default(BuildInPreviews[0]),
    })
}


export const GlobalSettingsSchema = z.object({
    plainSettings: InternalSchemas.PlainSettings
})

//#endregion

//#region Main Types

export type ExportedGlobalSettingsType = z.infer<typeof GlobalSettingsSchema>;
export type ExportedGlobalPlainSettings = z.infer<typeof InternalSchemas.PlainSettings>;

//#endregion