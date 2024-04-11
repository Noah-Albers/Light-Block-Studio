export function assertStringsEqual(exp: string, res: string){
    if(exp !== res)
        throw new Error(`Strings are different. Excepted: \n'${exp}'\nbut got\n'${res}'`);
}

export function assertArraysEqual(exp: any[], res: any[]){
    if(exp.length !== res.length)
        throw new Error(`Arrays are different. Lengths don't match: Expected${exp.length} got but ${res.length}`);

    for(let i=0;i<exp.length; i++){
        if(exp[i] !== res[i])
            throw new Error(`Arrays are different.\nExpected: ${JSON.stringify(exp)}\nbut got\n${JSON.stringify(res)}\nItem ${i} doesn't match. Expected: \n'${exp[i]}'\n but got '${res[i]}'`);
    }
}

export function assertNumbersEqual(exp: number, result: any): void {
    if (typeof result !== 'number')
        throw new Error(`Expected a number, but received ${typeof result}`);

    if (exp !== result)
        throw new Error(`Expected ${exp}, but received ${result}`);
}

export function assertException(msg: string, run: ()=>void){
    try{
        run();

        throw new Error(`Expected Error with '${msg}', but no error was thrown`)
    }catch(err){
        assertStringsEqual(msg, `${err}`);
    }
}

export function isObject(raw: any) {
    return typeof raw === "object" && !Array.isArray(raw);
}