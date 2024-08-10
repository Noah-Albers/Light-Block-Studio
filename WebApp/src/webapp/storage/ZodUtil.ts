export const min = (min: number) => (value: number) => value < min ? min : value;
export const max = (max: number) => (value: number) => value > max ? max : value;

export const int = ()=> (value: any)=>{
    let parsed = parseInt(value);
    if(isNaN(parsed))
        return 0;
    return parsed;
}