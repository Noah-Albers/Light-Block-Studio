import { z } from "zod";
import { int, min } from "../../ZodUtil"

// What a single preview must be
export const BasePreviewSchema = z.union([
    z.string(),
    z.object({
        __type: z.literal("grid").default("grid"),
        width: z.any().transform(int()).transform(min(1)).default(1),
        height: z.any().transform(int()).transform(min(1)).default(1),

        mode: z.enum(["alternating", "normal"]).default("normal"),
        type: z.enum(["stripe", "matrix"]).default("stripe"),

        startId: z.any().transform(int()).transform(min(0)).default(0),
        rotation: z.union([z.literal(90), z.literal(-90), z.literal(180), z.literal(0)]).default(0),

        idLength: z.any().transform(int()).transform(min(0)).default(1)
    }).default({
        __type: "grid",
        width: 10, height: 10, idLength: 1, mode: "normal",
        rotation: 0, startId: 0, type: "stripe"
    })
])

export type ExportedPreviewSchemaType = z.infer<typeof BasePreviewSchema>;
