type DebouncedFunction<F extends (...args: any[]) => any> = (
    ...args: Parameters<F>
) => void;

/**
 * Creates a debounced function that delays the invocation of the provided function 
 * until after a specified number of milliseconds have passed since the last time 
 * the debounced function was invoked.
 * 
 * @param func - The function to debounce.
 * @param waitMs - The number of milliseconds to delay.
 * @returns A debounced version of the provided function.
 */
export function debounce<F extends (...args: any[]) => any>(
    func: F,
    waitMs: number
): DebouncedFunction<F> {
    // Timeout variable
    let timeoutId: NodeJS.Timeout;

    // The debounced function that will be returned
    return function (...args: Parameters<F>): void {
        // Clear the previous timeout if it exists
        if (timeoutId !== undefined)
            clearTimeout(timeoutId);

        // Calls the original function after the set timeout
        timeoutId = setTimeout(() => func(...args), waitMs);
    };
}