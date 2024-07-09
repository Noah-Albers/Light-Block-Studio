<template>
<v-btn @click="onClick">Add</v-btn>
<h1>Raw JS here</h1>
<div ref="rawRef">

</div>
</template>

<script lang="ts" setup>
import { SignalDispatcher } from '@webapp/utils/signals/SignalDispatcher';
import { Signals } from '@webapp/utils/signals/Signals';
import { ref } from 'vue';

const rawRef = ref(null as any as HTMLDivElement);

function onRemove(elm: HTMLElement){
    SignalDispatcher.emit(Signals.REQUEST_VUE_HTML_DETACH, elm);
}

function onAdd(elm: HTMLDivElement){
    //SignalDispatcher.emit(Signals.REQUEST_VUE_HTML_INJECT, elm as HTMLElement);
}

function onClick(){
    const randomAnimalEmoji = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵'][Math.floor(Math.random() * 15)];

    const div = document.createElement("div");
    const btn = document.createElement("input");
    btn.value = "Remove "+randomAnimalEmoji;
    btn.type = "button";
    btn.onclick=()=>onRemove(div);

    div.appendChild(btn);

    rawRef.value.appendChild(div);

    onAdd(div);
}

</script>