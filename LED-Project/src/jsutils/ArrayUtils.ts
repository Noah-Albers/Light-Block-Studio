// TODO: Write tests

/**
 * Groups elements of an array by a specified key.
 * @param array The array to be grouped.
 * @param getKey A function that extracts the key from each item in the array. Note that key must be a string or number
 * @returns An object where keys are the values returned by getKey and values are arrays of items with the same key.
 *
 * @example
 * // Example usage:
 * const data = [
 *     { id: 1, name: 'John' },
 *     { id: 2, name: 'Jane' },
 *     { id: 3, name: 'John' },
 *     { id: 4, name: 'Doe' },
 *     { id: 5, name: 'Jane' }
 * ];
 *
 * // Grouping the data by the 'name' property.
 * const groupedByName = groupBy(data, item => item.name);
 * console.log(groupedByName);
 *
 * // Example Output:
 * // {
 * //     'John': [ { id: 1, name: 'John' }, { id: 3, name: 'John' } ],
 * //     'Jane': [ { id: 2, name: 'Jane' }, { id: 5, name: 'Jane' } ],
 * //     'Doe': [ { id: 4, name: 'Doe' } ]
 * // }
 */
export function groupBy<T>(array: T[], getKey: (item: T) => string | number): { [key: string]: T[] } {
    // Initialize an empty object to store the grouped items.
    const groupedObj: { [key: string]: T[] } = {};
    
    // Iterate through each item in the array.
    array.forEach(item => {
        // Get the key for the current item using the getKey function.
        const key = getKey(item);
        
        // Check if the key already exists in the grouped object.
        if (groupedObj[key]) {
            // If the key exists, push the current item to the array associated with that key.
            groupedObj[key].push(item);
        } else {
            // If the key does not exist, create a new array with the current item and assign it to the key.
            groupedObj[key] = [item];
        }
    });
    
    // Return the object containing the grouped items.
    return groupedObj;
}

/**
 * Finds the most frequently occurring key in an array of items.
 * @param array The array of items.
 * @param getKey A function that extracts the key from each item.
 * @returns The key that occurs the most frequently.
 *
 * @throws Error if the array is empty.
 *
 * @example
 * // Example usage:
 * import { mostFrequent } from './your-module-name';
 * const data = [
 *     { id: 1, name: 'John' },
 *     { id: 2, name: 'Jane' },
 *     { id: 3, name: 'John' },
 *     { id: 4, name: 'Doe' },
 *     { id: 5, name: 'Jane' }
 * ];
 *
 * // Finding the most frequent 'name'.
 * const mostFrequentName = mostFrequent(data, item => item.name);
 * console.log(mostFrequentName); // Output: 'John'
 *
 * // Finding the most frequent 'id'.
 * const mostFrequentId = mostFrequent(data, item => item.id);
 * console.log(mostFrequentId); // Output: 1
 */
export function mostFrequent<T, K>(array: T[], getKey: (item: T) => K): K {
    if (array.length === 0)
        throw new Error("Array is empty");

    // Create a Map to store the count of each key.
    const keyCounts = new Map<K, number>();

    // Iterate through each item in the array.
    array.forEach(item => {
        // Get the key for the current item using the getKey function.
        const key = getKey(item);

        // Increment the count for the current key in the Map.
        keyCounts.set(key, (keyCounts.get(key) || 0) + 1);
    });

    // Initialize variables to track the most frequent key and its count.
    let maxKey: K | null = null;
    let maxCount = -1;

    // Iterate through the Map to find the key with the highest count.
    keyCounts.forEach((count, key) => {
        if (count > maxCount) {
            maxKey = key;
            maxCount = count;
        }
    });

    // Return the most frequent key.
    return maxKey!;
}