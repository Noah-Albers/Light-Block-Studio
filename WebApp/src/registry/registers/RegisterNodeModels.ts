import { INodeModel } from "@nodes/definitions/Node";
import { DelayNodeModel } from "@nodes/implementations/models/control/DelayNodeModel";
import { LoopNodeModel } from "@nodes/implementations/models/control/LoopNodeModel";
import { DebugFadeNodeModel } from "@nodes/implementations/models/developer/DebugFadeNodeModel";
import { DebugNodeModel } from "@nodes/implementations/models/developer/DebugNodeModel";
import { DebugRainbowNodeModel } from "@nodes/implementations/models/developer/DebugRainbowNodeModel";
import { ClearAllLedsNodeModel } from "@nodes/implementations/models/leds/ClearAllLedsNodeModel";
import { SingleLedNodeModel } from "@nodes/implementations/models/leds/SingleLedNodeModel";
import { MultiLedNodeModel } from "@nodes/implementations/models/leds/MultiLedNodeModel";
import { MultiLedGradiantNodeModel } from "@nodes/implementations/models/leds/MultiLedGradiantNodeModel";

export function registerNodeModels(isDeveloper: boolean) : INodeModel[] {
    return [
        // Operations section
        new DelayNodeModel(),
        new LoopNodeModel(),
        
        // Led section
        new SingleLedNodeModel(),
        new MultiLedNodeModel(),
        new MultiLedGradiantNodeModel(),
        new ClearAllLedsNodeModel(),

        // Debug section
        ...(isDeveloper ? [
            new DebugNodeModel(),
            new DebugFadeNodeModel(),
            new DebugRainbowNodeModel()
        ]: [])
    ]
}