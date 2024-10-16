
export type GridSettings = {
    // How many pixel on the x and y axis are generated
    width: number,
    height: number,

    // Pixel space between the pixels
    spaceBetweenX: number,
    spaceBetweenY: number,

    // Pixel size of each pixel
    rectSizeX: number,
    rectSizeY: number,

    // If the pixels generate alternating per row or in one direction
    mode: "alternating" | "normal",

    // If the pixels are generated as an led matrix or a single stripe
    type: "stripe" | "matrix",

    // Id to start from (Usually 0)
    startId: number,

    // Rotation of the grid
    rotation: 0 | 90 | -90 | 180,

    // How many leds shall have to same id. For example with this at three 3, the first few would generate as
    // 0 0 0 1 1 1 2 2 2 ... and such
    idLength: number,

    // Note: Only used when type = "stripe"
    // How much space (in pixels) is between the stripes
    stripePadding: number
}

function generate({
    width, height, mode, rectSizeX, rectSizeY, spaceBetweenX, spaceBetweenY,
    type, stripePadding, startId, rotation, idLength
}: GridSettings) {

    // Most comments below assume a rotation of 0

    // Outline size
    const outlineSize = 2;

    // Spacing on the y axis
    let borderSpaceY = type === "stripe" ? outlineSize : 0;
    if (type !== "stripe")
        stripePadding = 0;

    const pxlWidth = width * (spaceBetweenX + rectSizeX) + outlineSize;
    const pxlHeight = height * (spaceBetweenY + rectSizeY + borderSpaceY + stripePadding) - borderSpaceY - stripePadding + outlineSize;

    const areAxisSwapped = rotation === -90 || rotation == 90
    const gttx = areAxisSwapped ? (pxlHeight - pxlWidth) / 2 : 0;
    const rW = areAxisSwapped ? pxlHeight : pxlWidth;
    const rH = areAxisSwapped ? pxlWidth : pxlHeight;

    // If the arrow at the ending is on the right side
    const isEndingRight = mode === "normal" || height % 2 == 1;

    const sizeArrowY = 7.8;
    const sizeArrowX = 10.5;

    //#region Generate rects
    function generateRects() {
        const rects: string[] = [];

        for (let y = 0; y < height; y++)
            for (let x = 0; x < width; x++) {
                // Generates the led index (Checks for alternating mode)
                const idx = Math.floor(
                    (width * y + (mode === "alternating" && y == 1 ? width - x - 1 : x) + startId) / idLength
                );

                rects.push(
                    `
                    <rect
                        x="${outlineSize + x * (rectSizeX + spaceBetweenX)}"
                        y="${outlineSize + y * (rectSizeY + spaceBetweenY + borderSpaceY + stripePadding)}"
                        width="${rectSizeX}"
                        height="${rectSizeY}"
                        ry=".1"
                        stroke="#fff"
                        stroke-width=".32"
                        led="${idx}" />`.replace(/\s+/g, " ")
                )
            }

        return rects;
    }

    //#endregion

    //#region Generate background

    function generateBackground() {

        // If type matrix, simply generate a big rect
        if (type === "matrix")
            return [(
                `<rect x="0" y="0" width="${pxlWidth
                }" height="${pxlHeight}" fill="#2b2b2b" stroke="#999" stroke-width=".5" />`
            )]

        const background: string[] = [];

        for (let y = 0; y < height; y++)
            background.push(
                `<rect x="0" y="${(spaceBetweenY + rectSizeY + borderSpaceY + stripePadding) * y
                }" width="${width * (spaceBetweenX + rectSizeX) + borderSpaceY
                }" height="${(spaceBetweenY + rectSizeY) + borderSpaceY
                }" fill="#2b2b2b" stroke="#999" stroke-width=".5" />`
            )

        return background;
    }

    //#endregion

    //#region Triangles

    function generateTriangles() {
        const paths: string[] = [];
        const pathForward = "M 10.9435,6.8104 V 4.2004 A 0.0548,0.0548 0 0 0 10.85,4.1617 L 9.6,5.4117 A 0.132,0.132 0 0 0 9.6,5.5987 L 10.85,6.8487 A 0.0548,0.0548 0 0 0 10.9435,6.81 Z";
        const pathBackward = "m 9.5,4 v 2.61 a 0.0548,0.0548 0 0 0 0.0935,0.0387 l 1.25,-1.25 a 0.132,0.132 0 0 0 0,-0.187 l -1.25,-1.25 A 0.0548,0.0548 0 0 0 9.5,4.0004 Z"

        const isAlternating = mode === "alternating";

        for (let y = 0; y < height; y++)
            for (let x = 0; x < width - 1; x++) {
                const isRight = y % 2 === 0 || !isAlternating;

                paths.push(`<path ${""
                    }d="${isRight ? pathBackward : pathForward
                    }" transform="translate(${outlineSize + x * (rectSizeX + spaceBetweenX) - 1.9
                    } ${outlineSize + y * (rectSizeY + spaceBetweenY + borderSpaceY + stripePadding) - 1.8
                    })" fill="${isRight ? "#20b225" : "#bf0707"
                    }" stroke-width="0" />`)

            }

        return paths;
    }
    //#endregion

    //#region Start/End Arrow

    function generateArrows() {

        const createArrow = (translateX: number, translateY: number, isRotated: boolean, clr: string) => (
            `<path
     d="M 7.1691,0.4325 C 7.1386,0.4325 7.1078,0.4437 7.0845,0.4671 L 6.0975,1.4551 C 6.0508,1.5018 6.0508,1.5771 6.0975,1.6241 L 7.4875,3.0141 H 0.5375 C 0.4714,3.0141 0.4185,3.0672 0.4185,3.1331 V 4.7131 C 0.4185,4.7792 0.4716,4.8321 0.5375,4.8321 H 7.4875 L 6.0975,6.2221 C 6.0508,6.2688 6.0508,6.3441 6.0975,6.3911 L 7.0845,7.3791 C 7.1312,7.4258 7.2065,7.4258 7.2535,7.3791 L 10.0535,4.5791 C 10.1002,4.5324 10.0535,4.4761 10.0535,4.4101 V 3.4221 C 10.0535,3.356 10.1002,3.3001 10.0535,3.2531 L 7.2535,0.4531 C 7.2301,0.4297 7.2,0.4185 7.1695,0.4185 Z"
     fill="${clr}"
     stroke="#999999"
     stroke-width="0.837"
     transform="translate(${translateX} ${translateY})${isRotated ? ` rotate(180 ${sizeArrowX / 2} ${sizeArrowY / 2})` : ""
            }"
     />`
        )

        return (
            createArrow(-sizeArrowX, outlineSize - .4, false, "#20b225") +
            createArrow(isEndingRight ? pxlWidth : -sizeArrowX, pxlHeight - outlineSize - sizeArrowY / 2 - 3.9, !isEndingRight, "#bf0707")
        )
    }

    //#endregion

    const offsetTranslateX = areAxisSwapped ? 0 : sizeArrowX;
    const offsetTranslateY = areAxisSwapped ? sizeArrowX : 0;

    const groupTransform = rotation === 0 ? `transform="translate(${offsetTranslateX} ${offsetTranslateY})"` : `transform="translate(${gttx + 1 + offsetTranslateX} ${-gttx + 1 + offsetTranslateY}) rotate(${rotation},${pxlWidth / 2},${pxlHeight / 2
        })"`


    return (
        `
<svg version="1.1" viewBox="0 0 ${rW + 2 + offsetTranslateX * 2} ${rH + 2 + offsetTranslateY * 2}"
    xmlns="http://www.w3.org/2000/svg">

<!-- Background -->
<g ${groupTransform}>${generateBackground().join("\n")}</g>
<!-- Leds -->
<g ${groupTransform}>${generateRects().join("\n")}</g>
<!-- Direction indicators -->
<g ${groupTransform}>${generateTriangles().join("\n")}</g>
<!--Start/End Arrow!-->
<g ${groupTransform}>${generateArrows()}</g>

</svg>`
    );

}

export default {
    generate
}