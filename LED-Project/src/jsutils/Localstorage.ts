
export function isLocalstorageSupported(){
    return typeof(Storage) !== "undefined" && typeof(localStorage) !== "undefined";
}