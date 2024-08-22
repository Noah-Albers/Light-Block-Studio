// Simple function that replaces variables inside a string with their values
export function replaceVariables(base: string, replacements: { [key: string]: number | string }) {
    for (let rep in replacements)
        base = base.replaceAll(`$$${rep}$$`, replacements[rep].toString());

    return base;
}