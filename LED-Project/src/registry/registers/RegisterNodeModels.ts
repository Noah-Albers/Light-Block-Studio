import { INodeModel } from "@nodes/definitions/Node";
import { DelayNodeModel } from "@nodes/implementations/models/DelayNodeModel";
import { SetLedNodeModel } from "@nodes/implementations/models/SetLedNodeModel";

export function registerNodeModels() : INodeModel[] {
    return [
        new DelayNodeModel(),
        new SetLedNodeModel()
    ]
}