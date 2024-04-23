import { INodeModel } from "@nodes/definitions/Node";
import { DelayNodeModel } from "@nodes/implementations/models/DelayNodeModel";

export function registerNodeModels() : INodeModel[] {
    return [
        new DelayNodeModel()
    ]
}