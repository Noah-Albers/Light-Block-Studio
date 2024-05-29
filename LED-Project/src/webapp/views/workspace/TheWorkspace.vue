<template>
<TheVueColorAttacher/>
<div ref="blocklyDiv" style="height: 100%"></div>
</template>

<script type="ts" setup>
import TheVueColorAttacher from "@webapp/blockly/fields/color/TheVueColorAttacher.vue"
import { SignalDispatcher } from '@webapp/utils/signals/SignalDispatcher';
import { Signals } from '@webapp/utils/signals/Signals';
import Blockly from 'blockly';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { createToolbox } from "@webapp/blockly/RegisterBlockly";
import { onWorkspaceChange } from "./WorkspaceConfigBuilder"; 

const Options = {
    // TODO: Add theme
    //theme: "sle_dark",
    collapse: false,
    comments: false,
    disable: false,
    maxBlocks: Infinity,
    trashcan: true,
    media: "blocklyAssets",
    horizontalLayout: false,
    toolboxPosition: "start",
    css: true,
    rtl: false,
    scrollbars: true,
    sounds: true,
    oneBasedIndex: true,
    grid: {
        spacing: 20,
        length: 1,
        colour: "#888",
        snap: false
    },
    zoom: {
        controls: true,
        wheel: true,
        startScale: 1,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
    }
};

const Toolbox = createToolbox();

// Workspace reference
const blocklyDiv = ref(null);

onMounted(() => {

    // Creates the workspace
    const workspace = Blockly.inject(blocklyDiv.value, {
        toolbox: Toolbox,
        ...Options
        // Other configuration options as needed
    });

    Blockly.svgResize(workspace);

    // Awaits a resize event and updates blockly accordingly
    var obs = new ResizeObserver(_ => Blockly.svgResize(workspace));
    obs.observe(blocklyDiv.value);

    // Creates the base blocks
    const rootBlocks = ["led_root_setup", "led_root_loop"];
    for(let i=0;i<rootBlocks.length;i++){
        var setup = workspace.newBlock(rootBlocks[i]);
        setup.moveBy(100 + 250*i,100);
        setup.initSvg();
        setup.render();	
    }

    // Listens for blockly-events
    workspace.addChangeListener(evt=>{

        switch(evt.type){
            // Waits for a block change (Select / deselect)
            case Blockly.Events.SELECTED:
                SignalDispatcher.emit(Signals.BLOCKLY_BLOCK_SELECTION_CHANGE, workspace.getBlockById(evt.newElementId));
            case Blockly.Events.BLOCK_FIELD_INTERMEDIATE_CHANGE: case Blockly.Events.CREATE: case Blockly.Events.MOVE: case Blockly.Events.CHANGE:
                // Runs the blockly change event
                onWorkspaceChange(workspace);
                return;
        }
    });

});

</script>