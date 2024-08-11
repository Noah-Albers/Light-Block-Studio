
// Ensures no element of the config is NaN
export function ensureNonNaNs(cfg: object){
    for(let key of Object.keys(cfg))
        if(isNaN(cfg[key as keyof typeof cfg]))
            (cfg[key as keyof typeof cfg] as any) = 0;
}