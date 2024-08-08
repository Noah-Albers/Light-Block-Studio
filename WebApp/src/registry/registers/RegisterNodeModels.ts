import { INodeModel } from "@nodes/definitions/Node";
import { DebugNodeModel } from "@nodes/implementations/models/DebugNodeModel";
import { DelayNodeModel } from "@nodes/implementations/models/DelayNodeModel";
import { LoopNodeModel } from "@nodes/implementations/models/LoopNodeModel";
import { SetLedNodeModel } from "@nodes/implementations/models/SetLedNodeModel";
import { SetLedRangeNodeModel } from "@nodes/implementations/models/SetLedRangeNodeModel";

export function registerNodeModels() : INodeModel[] {
    return [
        new DelayNodeModel(),
        new SetLedNodeModel(),
        new LoopNodeModel(),
        new SetLedRangeNodeModel(),
        new DebugNodeModel()
    ]
}