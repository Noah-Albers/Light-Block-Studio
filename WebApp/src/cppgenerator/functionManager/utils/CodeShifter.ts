/**
 * Takes in some
 * @param code source-code and sets the spaces before the code to
 * @param spaces
 * 
 * @example
 * 
 * ```
 *    void test(){
 *       lul();
 *    }
 * ```
 * 
 * with spaces = 6
 * 
 * would be set to
 * 
 * ```
 *       void test(){
 *          lul();
 *       }
 * ```
 * 
 */
export function setSpaces(code: string, spaces: number){

    // Removes trailing and starting stuff
    code = code.trimEnd();
    while(code.startsWith("\n"))
        code = code.substring(1);

    // Splits into the single lines
    let lines = code.split("\n");

    // Gets the minimum amount of spaces that every line has and that can be removed
    let spacesAtFront : number = lines.filter(line=>line.trim().length > 0).map(line=>line.length - line.trimStart().length).reduce((a,b)=>Math.min(a,b), Infinity);

    // Error prevention
    if(spacesAtFront === Infinity) return code;

    // Appends the spaces that are actually wanted
    let append = new Array(spaces + 1).join(" ");

    // Reassembles the code without the spaces
    return lines.map(ln=>{
        if(ln.length < spacesAtFront) return "";
        return append+ln.substring(spacesAtFront)
    }).join("\n");
}
