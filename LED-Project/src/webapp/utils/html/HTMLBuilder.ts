
/**
 * Create an HTML element with the given tag name, attributes, and children.
 * @param {string} tag - The HTML tag name of the element.
 * @param {Record<string, string>} attrs - An optional object containing attributes to set on the element.
 * @param {(Node | string)[]} children - An optional array of child elements or strings to append to the created element.
 * @returns {HTMLElement} The created HTML element.
 */
export function C(tag: string, attrs: Record<string, string> = {}, children: (Node | string)[] = []): HTMLElement {
    const element = document.createElement(tag);

    // Set attributes
    for (const [key, value] of Object.entries(attrs)) {
        element.setAttribute(key, value);
    }

    // Append children
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });

    return element;
}