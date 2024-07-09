import { INodeModel } from "@nodes/definitions/Node";
import { SetLedNodeModel } from "@nodes/implementations/models/SetLedNodeModel";

export function registerNodeModels() : INodeModel[] {
    return [
        //new DelayNodeModel(),
        new SetLedNodeModel(),
        //new LoopNodeModel()
    ]
}