<template>
    <v-tooltip
        text="Used to prevent random USB-Devices from showing up when connecting to hardware. Disable if your device isn't listed"
        location="top">
        <template v-slot:activator="{ props }">
            <v-checkbox v-bind="props" label="Hide unknown Serial-Vendors"
                v-model="store.whitelistUsbVendors.enabled"></v-checkbox>
        </template>
    </v-tooltip>

    <v-card class="me-auto pa-2">
        <template v-slot:prepend>
            <h1 class="text-subtitle-1">Additional USB-Vendors</h1>
        </template>
        <template v-slot:append>
            <v-btn color="error" @click="askRestoreDefaults">Restore defaults</v-btn>

        </template>
        <v-list>
            <v-list-item v-for="(item, i) in store.whitelistUsbVendors.whitelist" :key="i" :value="item" color="primary"
                :title="item[0]" :subtitle="`VendorID: 0x${item[1].toString(16)}`" prepend-icon="mdi-usb">
                <template v-slot:append>
                    <v-icon @click="store.removeVendor(item[1])" icon="mdi-close"></v-icon>
                </template>
            </v-list-item>

        </v-list>

        <v-container>
            <v-row>
                <v-col cols="12" md="5">
                    <v-text-field variant="outlined" v-model="newItem[0]" label="Vendor Name (Info Only)"
                        hide-details></v-text-field>
                </v-col>

                <v-col cols="12" md="5">
                    <v-text-field variant="outlined" v-model="newItem[1]" label="Vendor-ID" hide-details></v-text-field>
                </v-col>
                <v-col cols="12" md="2" class="mt-2">
                    <v-btn prepend-icon="mdi-plus" color="primary" @click="onAddNewClicked">Add</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>
    
<script setup
    lang="ts">
    import { ref } from "vue";
    import { useSettingsStore } from '@webapp/stores/SettingsStore';
    const store = useSettingsStore();

    // Mapping for any new vendor item set to be added
    const newItem = ref(["", ""]);

    // Event: Whent the button to restore the default vendors is clicked
    function askRestoreDefaults(){
        if(!confirm("Do you wish to restore the vendor settings to their defaults?"))
            return;

        store.restoreVendorDefaults();
    }

    // Event: When the button to add a new vendor is clicked
    function onAddNewClicked(){
        const name = newItem.value[0];
        const vendorId = newItem.value[1];

        // Ensures both are given
        if(name.trim().length <= 0){
            alert("Please specify a name.");
            return;
        }

        if(!/^0x[\da-fA-F]+$/.test(vendorId)){
            alert("Please specify the vendor id in the following format:\n0xABCDEF (Hexcode)");
            return;
        }

        const parsedID = parseInt(vendorId);

        if(store.doesVendorIDExist(parsedID)){
            alert("A vendor with that id already exists. Duplicates are not allowed.");
            return;
        }

        // Parses and adds the vendor id
        store.addVendor(name,parsedID)
    }

    </script>