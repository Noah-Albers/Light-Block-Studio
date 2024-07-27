import { defineStore } from 'pinia'
import { SystemVariable, Variable } from './definitions/Variables'
import { isValidVariableName } from '@mathSolver/index';
import { useProjectStore } from './ProjectStore';
import { $t } from '@localisation/Fluent';

// Defines reserved keywords that can't be used as variable names
const RESERVED = [
    "setup",
    "loop",
    "globals" 
]

export const useVariableStore = defineStore('variables', {
    state: () => ({
        variables: [] as Variable[]
    }),

    getters: {
        // Returns system defined variables
        systemVariables() {
            return {
                // Holds the amount of leds that is set inside the settings
                AMOUNT: {
                    name: "amt",
                    value: useProjectStore().amount || 0,
                    
                    info: $t('variables_system_amount_info')
                } as SystemVariable
            }
        },

        /**
         * Computed property which stores all variables in a [varName]: varValue object
         * @returns 
         */
        variable2ValueMap() : {[name: string]: number} {
            const obj: {[name: string]: number} = {};

            // Adds all user defined variables
            for(let v of this.variables) {
                // Skips variables with name problems
                if(v.nameProblem !== undefined)
                    continue;

                // Skips variables with an invalid value
                if(typeof v.value === "string")
                    continue;

                obj[v.name] = v.value;
            }

            // Adds all system variables
            for(let idx in this.systemVariables){
                const v = this.systemVariables[idx as keyof typeof this.systemVariables];

                obj[v.name] = v.value;
            }

            return obj;
        }

    },
    
    actions: {

        /**
         * Updates the problems of every variable
         */
        updateProblems() {
            const self = this;

            // Checks if a given variable has a duplicated name
            function checkForDuplication(varOne: Variable, idxOne: number): boolean {
                // Checks all other variables
                return [...self.variables, ...Object.values(self.systemVariables)].some((varTwo, idxTwo) => {
                    // Filters index
                    if (idxOne !== idxTwo && varOne.name === varTwo.name)
                        return true;
                });
            }

            // Checks every variable for duplicated names
            this.variables.forEach((itm, idx) => {

                // Checks for an invalid name
                const validResult = isValidVariableName(itm.name);
                if(validResult !== true){
                    itm.nameProblem = validResult;
                    return;
                }

                // Checks for reserved keywords
                if(RESERVED.includes(itm.name)){
                    itm.nameProblem = "reserved";
                    return;
                }

                // Checks for duplication
                if(checkForDuplication(itm, idx)){
                    itm.nameProblem = "duplicated";
                    return;
                }

                // Resets the name problem
                itm.nameProblem = undefined;
            });
        },

        /**
         * Adds a new variable to the system
         * @param name the name of the variable
         * @param value the value of the variable
         */
        addNewVariable(name: string, value: number | string): void {

            // Adds the new element
            this.variables.push({
                nameProblem: undefined,
                name,
                value: value
            });

            // Updates the other variables
            this.updateProblems();
        },

        /**
         * Removes a variable from the system
         * @param idx the index of the variable to remove
         */
        removeVariable(idx: number): void {

            // Validates index
            if (idx < 0 || idx >= this.variables.length || !Number.isInteger(idx))
                return;

            // Removes the element
            this.variables.splice(idx, 1);

            // Updates the other variables
            this.updateProblems()
        },

        // Removes all variables
        clearAllVariables(){
            this.variables = [];
            this.updateProblems();
        }
    },
})