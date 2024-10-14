<template>

<v-overlay v-model="isOpen" class="align-center justify-center">
    <v-card class="text-h5 pa-4">
        <v-card-text class="pa-0" >
            <v-table class="text-h6">
                <thead>
                    <tr class="text-h4">
                        <th class="text-left">{{ $t('keyinfo_title_shortcut') }}</th>
                        <th class="text-left">{{ $t('keyinfo_title_action') }}</th>
                    </tr>
                </thead>
                <tbody>
                <tr v-for="item,idx in KEYCODES" :key="idx">
                    <td class="keyboard-keys">
                        <span v-for="key,kIdx in item.keys" :key="kIdx">{{ key }}</span>
                    </td>
                    <td>
                        <p class="text-h5 mt-2">{{ item.title }}</p>
                        <br>
                        <p class="text-h6 mb-2">{{ item.desc }}</p>
                    </td>
                </tr>
                </tbody>
            </v-table>
        </v-card-text>
  </v-card>
</v-overlay>

</template>

<style lang="scss" scoped>

.keyboard-keys {

    span{
        background: rgb(60, 60, 60);
        border: 1px solid white;
        border-radius: .6rem;
        margin-right: .5rem;
        padding: 5px 10px;
        color: rgb(230, 230, 230);
    }
}

.v-card{
    max-width: 90vw;
}

</style>

<script lang="ts" setup>
import { $t } from '@localisation/Fluent';
import { Signals } from '@webapp/utils/signals/Signals';
import { useSignal } from '@webapp/utils/vue/VueSignalListener';
import { ref } from 'vue';

  const isOpen = ref(false);

  const KEYCODES = (()=>{
    const ctrl = $t('keyinfo_key_ctrl');
    const shift = $t('keyinfo_key_shift');
    
    return [
        {keys: [ctrl,shift,"S"], title: $t('keyinfo_info_saveas_title'), desc: $t('keyinfo_info_saveas_desc')},
        {keys: [ctrl,"S"], title: $t('keyinfo_info_save_title'), desc: $t('keyinfo_info_save_desc')},
        {keys: [ctrl,"O"], title: $t('keyinfo_info_open_title'), desc: $t('keyinfo_info_open_desc')},
        {keys: [ctrl,"R"], title: $t('keyinfo_info_rlconfig_title'), desc: $t('keyinfo_info_rlconfig_desc')},
        {keys: [ctrl,shift, "C"], title: $t('keyinfo_info_cpcode_title'), desc: $t('keyinfo_info_cpcode_desc')},
        {keys: [ctrl,shift, "V"], title: $t('keyinfo_info_cycleview_title'), desc: $t('keyinfo_info_cycleview_desc')},
    ]
    })();


  useSignal(Signals.OPEN_KEYBOARD_INFO, ()=>isOpen.value = true);

</script>