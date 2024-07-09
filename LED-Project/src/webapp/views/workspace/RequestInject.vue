<template>
    <div v-for="id in aliveElements" :class="`render-element-${id}`" :key="id">
        <component
        :is="mapping[id].renderer"
        :source="mapping[id].source"
        :blockData="mapping[id].dataObj"
        :cache="mapping[id].cache.value"
        :extraInfo="mapping[id].extraInfo"
        />
    </div>
</template>

<script lang="ts" setup>
import { useSignal } from '@webapp/utils/vue/VueSignalListener';
import { Signals } from "@webapp/utils/signals/Signals";
import { EventVue2HTMLRequest } from "@webapp/utils/signals/SignalArgumentTypes";
import { ref } from 'vue';
import { onUpdated } from 'vue';

// List of id's for requested elements
const counter = ref(0);

// List of active element (Used to let vue render them)
const aliveElements = ref([] as number[]);

// A mapping between ids take from the counter and their HTML-Elements
const mapping: { [key: number]: EventVue2HTMLRequest<any> } = {};

// List of flaged elements of which the HTML has not yet been transplaned. Should almost always be empty.
let untriggered: number[] = [];

/**
 * Takes in an HTML-Element and returns its id
 */
function getIdByElement(base: HTMLElement): number | undefined {
    for (let id in mapping)
        if (mapping[id].base === base)
            return parseInt(id);
    return undefined;
}

useSignal(Signals.BLOCKLY_REQUEST_VUE_HTML_INJECT, (base: EventVue2HTMLRequest<any>) => {

    // Creates an internal id
    const id = counter.value++;

    // Registers the mapping between the id and the HTML-Element
    mapping[id] = base;
    // Flags it to be untriggered (Meaning the HTML has not been transplanted)
    untriggered.push(id);

    // Adds it to the actively rendered elements (Meaning vue will render it)
    aliveElements.value.push(id);
});

useSignal(Signals.BLOCKLY_REQUEST_VUE_HTML_DETACH, base => {

    // Gets the id
    const id = getIdByElement(base);

    // Ensures it was found
    if (id === undefined) {
        console.warn("Couldn't detach HTML-Element " + id + " because no element was found.");
        return;
    }

    // Removes it from any untriggered listeners (Unlikely to exist but oh well)
    if (untriggered.includes(id))
        untriggered = untriggered.filter(itm => itm !== id);

    // Deletes it from the mapping
    delete mapping[id];

    // Removes it from the active elements (There vue will remove it)
    aliveElements.value = aliveElements.value.filter(itm => itm !== id)

});

onUpdated(() => {
    // For every untriggered element (Elements which didn't have their HTML transplanted yet)
    for (let id of [...untriggered]) {
        // Gets the element from the DOM
        const elm = document.querySelector(".render-element-" + id)!;


        // Checks if the element actually exists
        if (elm === null)
            continue;

        mapping[id].base.appendChild(elm);

        // Handles the dom-ripping logic and sets the state to true
        untriggered = untriggered.filter(itm => itm !== id);
    }

});

</script>