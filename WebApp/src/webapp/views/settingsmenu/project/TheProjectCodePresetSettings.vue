<template>
    <v-textarea auto-grow :rows="20"
        variant="outlined"
        v-bind="$ta('projectsettings_blueprint')"
        hide-details
        v-model="store.codeBlueprint"></v-textarea>
    <!--TODO: Lang-->

    <v-expansion-panels
        hide-actions
        tile
        class="pb-10 pt-10"
    >
        <v-expansion-panel
            title="What is the blueprint?"
        >
            <v-expansion-panel-text class="text-h5">
                <p>The blueprint is the basic code surrounding the final generated code.</p>
                <p>You can write custom logic here and extend or change it.</p>
                <p>Using variables you can specify where the genrated code shall be put.</p>                
            </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel
            title="How do i use variables?"
        >
            <v-expansion-panel-text class="text-h5">
                <p>
                    You can simple insert the text $$VariableName$$ into any part of the code and that part will<br>
                    be replaced with the corresponding variable you specified.
                </p>
                <p>But be careful. Reserved variable names will always be overwritten with generated code.</p>
            </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel
            title="Which reserved variables exist?"
        >
            <v-expansion-panel-text class="text-h5">

                <p><span>$$ledInclude$$</span> is replaced with the #include Statement used by the led-library you selected.</p>
                <br>

                <p>If you for example selected Fast-LED, this might be something like: #include &lt;FastLED.h&gt;</p>
                <br>
                <p><span>$$pin$$</span> is replaced with the led pin you specified in the project settings.</p>
                <br>
                <p><span>$$amt$$</span> is replaced with the led amount you specified in the project settings.</p>
                <br>
                <p><span>$$ledGlobal$$</span> is replaced with any global-scoped code that the led-library might need.</p>
                <br>
                <p><span>$$globals$$</span> is replaced with any global-scoped code that the generated application code might need.</p>
                <br>
                <p><span>$$ledSetup$$</span> is replaced with any setup code that the led-library might need.</p>
                <br>
                <p><span>$$setup$$</span> is replaced with any generated setup code that the application generated.<br></p>
                <br>
                <p><span>$$setup$$</span> is replaced with any generated setup code that the application generated.</p>
                <br>
                <p><span>$$loop$$</span> is replaced with any generated loop code that the application generated.</p>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script setup
    lang="ts">
    import { useProjectStore } from '@webapp/stores/ProjectStore';
    const store = useProjectStore();
</script>

<style scoped lang="scss">
    span {
        background: rgb(62, 62, 62);
        padding: 2px 5px;
        border: 1px solid rgb(42, 42, 42);
        border-radius: 10px;
    }
</style>