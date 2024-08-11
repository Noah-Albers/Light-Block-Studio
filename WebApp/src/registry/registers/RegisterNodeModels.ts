import { INodeModel } from "@nodes/definitions/Node";
import { DelayNodeModel } from "@nodes/implementations/models/control/DelayNodeModel";
import { LoopNodeModel } from "@nodes/implementations/models/control/LoopNodeModel";
import { DebugFadeNodeModel } from "@nodes/implementations/models/developer/DebugFadeNodeModel";
import { DebugNodeModel } from "@nodes/implementations/models/developer/DebugNodeModel";
import { DebugRainbowNodeModel } from "@nodes/implementations/models/developer/DebugRainbowNodeModel";
import { ClearAllLedsNodeModel } from "@nodes/implementations/models/leds/ClearAllLedsNodeModel";
import { SetLedNodeModel } from "@nodes/implementations/models/leds/SetLedNodeModel";
import { SetLedRangeNodeModel } from "@nodes/implementations/models/leds/SetLedRangeNodeModel";

export function registerNodeModels(isDeveloper: boolean) : INodeModel[] {
    return [
        new DelayNodeModel(),
        new SetLedNodeModel(),
        new LoopNodeModel(),
        new SetLedRangeNodeModel(),
        new ClearAllLedsNodeModel(),

        ...(isDeveloper ? [
            new DebugNodeModel(),
            new DebugFadeNodeModel(),
            new DebugRainbowNodeModel()
        ]: [])
    ]
}