
// Special characters that are allowed in variable names
const SPECIAL_CHARS = "_$%";

/**
 * Checks if the given character is allowed to start a variable name.
 * @param char The character to be checked.
 * @returns True if the character is allowed to start a variable name, otherwise false.
 */
export function isValidVariableFirstChar(char: string): boolean {
    // Ensure the character is defined
    if (char === undefined)
        return false;

    // Check alphabetic characters
    if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z'))
        return true;

    // Check if the character is in the list of special characters
    return SPECIAL_CHARS.includes(char);
}


/**
 * Checks if the given character is allowed to start or be contained within a variable name.
 * @param char The character to be checked.
 * @returns True if the character is allowed in a variable name, otherwise false.
 */
export function isValidVariableChar(char: string): boolean {
    // A valid character can be alphabetic, numeric, or one of the special characters
    return (
        (char >= 'a' && char <= 'z') ||
        (char >= 'A' && char <= 'Z') ||
        (char >= '0' && char <= '9') ||
        SPECIAL_CHARS.includes(char)
    );
}