<template>
    <v-table>
        <thead>
            <tr>
                <th class="text-left">
                    Name
                </th>
                <th class="text-left">
                    Value
                </th>
                <th width="20px" class="text-left">
                </th>
            </tr>
        </thead>
        <tbody>

            <!-- System Variables -->
            <tr class="var-sys" :key="idx" v-for="itm, idx in varStore.systemVariables">
                <td>
                    <v-text-field class="px-1" density="compact" variant="plain" hide-details single-line disabled readonly
                        v-model="itm.name"></v-text-field>
                </td>
                <td>
                    <v-text-field class="px-1" readonly density="compact" disabled variant="plain" hide-details single-line
                        v-model="itm.value"></v-text-field>
                </td>
                <td>
                    <v-icon v-tooltip:left="itm.info" icon="mdi-information-outline" />
                </td>
            </tr>

            <!-- User Variables -->
            <tr class="var-usr" v-for="itm, idx in varStore.variables" :key="idx">
                <td>
                    <v-text-field class="px-1" :class="itm.nameProblem !== undefined ? 'error' : ''" density="compact"
                        label="Variable" variant="plain" hide-details single-line @update:model-value="onVarChange"
                        v-model="itm.name"></v-text-field>
                </td>
                <td>
                    <v-text-field class="px-1" :class="typeof itm.value === 'string' ? 'error' : ''" density="compact"
                        label="Value" variant="plain" hide-details single-line @update:model-value="onVarChange"
                        maxlength="15" v-model.number="itm.value"></v-text-field>
                </td>
                <td>
                    <v-icon icon="mdi-delete" @click="varStore.removeVariable(idx)" title="Delete the variable" />
                </td>
            </tr>

            <!-- Placeholder for new user variables -->
            <tr class="var-tmp">
                <td>
                    <v-text-field class="px-1" density="compact" label="Variable" variant="plain" hide-details single-line
                        @keydown.enter="onNewVariable" v-model="tmpVariable.name"></v-text-field>
                </td>
                <td>
                    <v-text-field class="px-1" density="compact" label="Value" variant="plain" hide-details single-line
                        maxlength="15" @keydown.enter="onNewVariable" v-model.number="tmpVariable.value"></v-text-field>
                </td>
                <td></td>
            </tr>
        </tbody>
    </v-table>


    <!-- Display error message if there's a problem -->
    <v-alert type="error" v-if="problemText !== false" icon="mdi-information" :text="problemText" />
</template>

<script setup
    lang="ts">
    import { ref } from "vue";
    import { useVariableStore } from "../../stores/VariableStore";
    import { computed } from "vue";
    import { ComputedRef } from "vue";
    import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
    import { Signals } from "@webapp/utils/signals/Signals";

    const varStore = useVariableStore();

    // Stores the values of the "tmp" variable which will become a real one when the user inputs a value
    const tmpVariable = ref({
        name: "" as string,
        value: 0 as number | ""
    })

    // Holds a text to show if a variable has a problem
    const problemText: ComputedRef<string | false> = computed(() => {
        const problemVars = varStore.variables.filter(v => v.nameProblem !== undefined || typeof v.value === "string");

        if (problemVars.length <= 0)
            return false;

        // Gets the first one and shows it's problem
        const v = problemVars[0];

        // Checks for variable problem
        if (typeof v.value === "string")
            return `'${v.name}' has an invalid value.`;

        switch (v.nameProblem) {
            case "duplicated": return `'${v.name}' is duplicated.`;
            case "firstChar": return `Variable names can't start with '${v.name[0]}'`;
            case "invalid": default: return `'${v.name}' is an invalid name.`;
            case "reserved": return `'${v.name}' is a reserved variable.`
        }
    });

    /**
     * Event: When the user typed in a new variable with a value
     */
    function onNewVariable() {
        varStore.addNewVariable(tmpVariable.value.name, tmpVariable.value.value);

        tmpVariable.value.name = "";
        tmpVariable.value.value = 0

        SignalDispatcher.emit(Signals.VAR_CHANGE);
    }

    /**
     * Event: When a variable changed (Tho this is before the change has been registered to vue)
     */
    function onVarChange() {
        // Mounts a small timeout to let vue register the change
        setTimeout(() => {

            // Updates the problems
            varStore.updateProblems()

            // Sends the var change emit
            SignalDispatcher.emit(Signals.VAR_CHANGE);

        }, 100);
    }

    </script>

<style scoped
    lang="scss">
    .error {
        box-shadow: 0 0 5px #b10000;
        transition: box-shadow 0.3s ease;
    }

    .var-tmp {
        color: gray;
    }
</style>