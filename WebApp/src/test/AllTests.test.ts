import { runTest_cppgenerator_codegenerator } from "./cppgenerator/CppGenerator.test";
import { runTest_cppfnmanager_codegenerator } from "./cppgenerator/functionManager/CppFnManager.test";
import { runTest_mathSolver } from "./mathSolver/MathSolver.test";
import { runTest_registered_procedures } from "./procedures/Procedures.test";

export const ALL_TESTS = [
    runTest_mathSolver,
    runTest_cppfnmanager_codegenerator,
    runTest_cppgenerator_codegenerator,
    runTest_registered_procedures
]

/**
 * Runs all tests and
 * @returns how many error occurred
 */
export function runAllTests(){

    const logInfo = (msg: string)=>console.log("%c"+msg, "color: #C9B79C"); 

    // Prints the title
    console.log("%cTest Runner!", "font-size: 60px; color: #71816D"); 
    logInfo("Starting testruns...");

    let successful = 0;
    let errors = [];
    
    let startMs = Date.now()

    for(let test of ALL_TESTS){
        try{
            test();
            ++successful;
        }catch(err){
            errors.push({
                name: test.name,
                error: err as Error
            });
        }
    }

    let endMs = Date.now();

    logInfo("================Result================");
    logInfo(`Ran ${ALL_TESTS.length} tests in ${endMs-startMs}ms.`);

    logInfo(`${successful}/${ALL_TESTS.length} ran successfully.`);
    if(errors.length > 0){
        logInfo(`Failed ${errors.length} tasks:`);
        errors.forEach(err=>{
            logInfo(`   ${err.name} failed with error`);
            console.log(err.error);
        });
    }

    logInfo("================Result================");

    return errors.length;
}