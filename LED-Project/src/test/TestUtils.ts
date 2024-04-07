export function stringsEqual(exp: string, res: string){
    if(exp !== res)
        throw new Error(`Strings are different. Excepted: \n'${exp}'\nbut got\n'${res}'`);
}

export function arraysEqual(exp: any[], res: any[]){
    if(exp.length !== res.length)
        throw new Error(`Arrays are different. Lengths don't match: Expected${exp.length} got but ${res.length}`);

    for(let i=0;i<exp.length; i++){
        if(exp[i] !== res[i])
            throw new Error(`Arrays are different.\nExpected: ${JSON.stringify(exp)}\nbut got\n${JSON.stringify(res)}\nItem ${i} doesn't match. Expected: \n'${exp[i]}'\n but got '${res[i]}'`);
    }
}

export function isObject(raw: any) {
    return typeof raw === "object" && !Array.isArray(raw);
}