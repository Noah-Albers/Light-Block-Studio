import { CppFnManager, CppFnInformation, CppType, IVariableSupplier } from "@cppgen/functionManager/index";
import { arraysEqual, stringsEqual } from "@test/TestUtils";

type AddFunction = {
    a: number,
    b: number
}

function createFuncToAddNumbers(gen: CppFnManager<undefined>, name: string){

    function generateCode(vs: IVariableSupplier, {a, b}: CppFnInformation<AddFunction>){
        return `
            // This is just an example code
            led[${a} + ${b}] = 0xfff;
        `;
    }

    return gen.addFunction<AddFunction>({
        name,
        types: {
            a: CppType.FLOAT,
            b: CppType.FLOAT,
        },
        generator: generateCode
    });
}

type TestCase = {
    adds: AddFunction[],
    add2s: AddFunction[],
    code: string,
    codeCalls: string[]
}

// Test cases
const TEST_CASES: TestCase[] = [
    {
        adds: [{a: 2, b:2}, {a: 2, b:2}],
        add2s: [{a: 2, b:2}, {a: 2, b:2}],
        code: `
void add() {
    // This is just an example code
    led[2 + 2] = 0xfff;
}
void add_1() {
    // This is just an example code
    led[2 + 2] = 0xfff;
}
        `,
        codeCalls: ["add();","add();", "add_1();","add_1();"]
    },
    {
        adds: [{a: 3, b:2}, {a: 2, b:2}],
        add2s: [{a: 2, b:2}, {a: 2, b:2}],
        code: `
void add(float a) {
    // This is just an example code
    led[a + 2] = 0xfff;
}
void add_1() {
    // This is just an example code
    led[2 + 2] = 0xfff;
}
        `,
        codeCalls: ["add(3);", "add(2);", "add_1();", "add_1();"]
    },
    {
        adds: [{a: 3, b:2}, {a: 3, b:2}],
        add2s: [{a: 2, b:2}, {a: 2, b:2}],
        code: `
void add() {
    // This is just an example code
    led[3 + 2] = 0xfff;
}
void add_1() {
    // This is just an example code
    led[2 + 2] = 0xfff;
}
        `,
        codeCalls: ["add();","add();","add_1();","add_1();"]
    },
    {
        adds: [{a: 3, b:2}, {a: 3, b:2}],
        add2s: [{a: 3, b:2}, {a: 2, b:2}],
        code: `
void add() {
    // This is just an example code
    led[3 + 2] = 0xfff;
}
void add_1(float a) {
    // This is just an example code
    led[a + 2] = 0xfff;
}
        `,
        codeCalls: ["add();","add();", "add_1(3);", "add_1(2);"]
    },
    {
        adds: [{a: 3, b:2}, {a: 3, b:2}],
        add2s: [{a: 3, b:2}, {a: 3, b:2}],
        code: `
void add() {
    // This is just an example code
    led[3 + 2] = 0xfff;
}
void add_1() {
    // This is just an example code
    led[3 + 2] = 0xfff;
}
        `,
        codeCalls: ["add();","add();","add_1();","add_1();"]
    },
    {
        adds: [{a: 2, b:3}, {a: 3, b:2}],
        add2s: [{a: 2, b:3}, {a: 3, b:2}],
        code: `
void add(float a, float b) {
    // This is just an example code
    led[a + b] = 0xfff;
}
void add_1(float a_1, float b_1) {
    // This is just an example code
    led[a_1 + b_1] = 0xfff;
}
        `,
        codeCalls: ["add(2, 3);", "add(3, 2);", "add_1(2, 3);", "add_1(3, 2);"]
    }
]


export function runTest_cppfnmanager_codegenerator(){ TEST_CASES.forEach(test=>{

    let gen = new CppFnManager();

    let fnAdd = createFuncToAddNumbers(gen, "add");
    let fnAdd2 = createFuncToAddNumbers(gen, "add");


    // Adds all calls
    test.adds.forEach(arg=>fnAdd.addCall(arg));
    test.add2s.forEach(arg=>fnAdd2.addCall(arg));

    let result = gen.generate(undefined);

    // Validates the generated code
    stringsEqual(test.code.trim(), result.code.trim());

    // Tests the calls
    arraysEqual(test.codeCalls, [
        ...test.adds.map(call=>result.callGenerator.getCallFor(fnAdd, call)),
        ...test.add2s.map(call=>result.callGenerator.getCallFor(fnAdd2, call))
    ]);

})};