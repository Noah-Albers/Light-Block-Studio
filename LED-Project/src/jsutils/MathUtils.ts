
/**
 * Simple function that clamps the value between a min and max
 */
export function clamp(value: number, min: number = 0, max: number = 1){
    return Math.min(Math.max(value, min), max);
}

/**
 * Rounds the number to three digits after the decimal point
 */
export function round3Digits(value: number){
    return Math.round(value * 1000) / 1000;
}