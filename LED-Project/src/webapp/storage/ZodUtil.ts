export const min = (min: number) => (value: number) => value < min ? min : value;
export const max = (max: number) => (value: number) => value > max ? max : value;

export const int = ()=> (value: any)=>parseInt(value)