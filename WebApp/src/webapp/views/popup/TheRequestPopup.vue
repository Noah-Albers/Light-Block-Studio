<template>
    <v-overlay v-model="isOpen"
        class="align-center justify-center"
        :close-on-back="false"
    >
        <v-card
            :text="args!.message"
        >
        <template v-slot:actions>
            <v-spacer></v-spacer>
            <v-btn @click="()=>onClick('yes')">{{ args!.yes }}</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="()=>onClick('no')">{{ args!.no }}</v-btn>
            <v-spacer></v-spacer>
        </template>
        </v-card>
    </v-overlay>
</template>

<script setup lang="ts">

import { EventArgsPopup } from "@webapp/utils/signals/SignalArgumentTypes";
import { Signals } from "@webapp/utils/signals/Signals";
import { useSignal } from "@webapp/utils/vue/VueSignalListener";
import { ref } from "vue"

const isOpen = ref(false);
const args = ref(undefined as EventArgsPopup|undefined)

useSignal(Signals.DISPLAY_POPUP, (a: EventArgsPopup)=>{
    isOpen.value = true;
    args.value = a;
})

function onClick(value: "yes" | "no"){
    isOpen.value = false;
    args.value!.onResolve(value);
}

</script>