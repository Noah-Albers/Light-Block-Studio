
/**
 * Takes in a string and validates it to be a css hex-color string with 6 digits.
 * Format example: #ff00aa or #ABddD0
 */
function isHexColor(color: string){
    return color.match(/^#[a-f0-9]{6}$/i) !== null;
}

/**
 * Converts a given hex color string as validated by isHexColor
 * to it's normalized Hue saturation value (0-1) value
 * 
 * or false if the given string is not a valid hex color
 */
export function HEX2HSV(color: string) : {h: number, s: number, v: number} | false {

    const rgb = HEX2RGB(color);

    if(rgb === false) return false;

    return RGB2HSV(rgb.r, rgb.g, rgb.b);
}

/**
 * Converts a given hex color string as validated by isHexColor
 * to it's 0-255 bit RGB value
 * 
 * or false if the given string is not a valid hex color
 */
export function HEX2RGB(color: string) : {
    r: number,
    g: number,
    b: number
} | false {

    if(!isHexColor(color)) return false;

    return {
        r: parseInt(color.substring(1,3), 16),
        g: parseInt(color.substring(3,5), 16),
        b: parseInt(color.substring(5,7), 16)
    }
}

/**
 * Converts an RGB-Color (0-255) into an HSV (0.00-1.00) color.
 * 
 * Modified version of https://stackoverflow.com/a/8023734
 */
export function RGB2HSV(r: number, g: number, b: number) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    diffc = (c: number) => (v - c) / 6 / diff + 1 / 2;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);
        h = 0;

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h,
        s,
        v
    };
}


/**
 * Converts a HSV-Color into a RGB-Color
 * 
 * Modified version of: https://stackoverflow.com/a/17243070
 * @param {number} h Hue-Part (From 0.00 to 1.00)
 * @param {number} s Saturation-Part (From 0.00 to 1.00)
 * @param {number} v Value-Part (From 0.00 to 1.00)
 * @returns an object with keys of r, g and b and their respective values from 0 to 255
 */
export function HSV2RGB(h: number, s: number, v: number) : {
    r: number,
    g: number,
    b: number
} {
    // Variable declaration
    var r, g, b, i, f, p, q, t;

    // Variable assignment
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    // Calculation
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
        default: r = g = b = 0;
    }

    // Return as RGB-Colors
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}




/**
 * Converts a HSV-Color into a RGB-Color in the hex format: #RRGGBB.
 * @param {number} h Hue-Part (From 0.00 to 1.00)
 * @param {number} s Saturation-Part (From 0.00 to 1.00)
 * @param {number} v Value-Part (From 0.00 to 1.00)
 * @returns the hex-color in the following format: #RRGGBB
 */
export function HSV2HEX(h: number,s: number,v: number, withoutSharp: boolean=false){

    /**
     * Takes in a decimal value, converts it to hex and pads the string with a zero if it has only a length of 1
     */
    function decToHexTwoDigits(dec: number){
        var val = dec.toString(16);
        
        return (val.length <= 1 ? "0" : "") + val
    }

    var {r,g,b} = HSV2RGB(h,s,v);  
    return `${withoutSharp ? "" : "#"}${decToHexTwoDigits(r)}${decToHexTwoDigits(g)}${decToHexTwoDigits(b)}`;
}