import { LEDMap } from "@visualizer/implementations/VisualisationController";
import { useSettingsStore } from "@webapp/stores/SettingsStore";

/**
 * This file is not responsible for the communication over the usb wire but only
 * for correctly sending the led data over the write.
 * 
 * 
 * Also: This system may not be perfect in it's current form, but it works good enough for static and none-static animations
 * so who cares, i guess
 */

//#region Connection start/stop/reset

// Handler that sends data over the wire
type DataHandler = (data: Uint8Array) => void;

// Function that sends actual data over the wire
let sendData: DataHandler | undefined;

// Starts the connection. Handler is the function that actually sends data over the write
function startConnection(handler: DataHandler) {
    sendData = handler
}

// Stops the connection
function stopConnection() {
    sendData = undefined;
}

// Event: The external led animation changed and shall restart
function onReset(){
    
    // Simulates an initial "reset" push
    const emptyData: LEDMap = new Map();

    for (let i = 0; i < useSettingsStore().serialPreview.ledAmount; i++)
        emptyData.set(i,[0,0,0]);

    //onLEDPush(emptyData);
}

//#endregion

//#region Protocol

type Pxl = {
    r: number,
    g: number,
    b: number,
    tsm: number // To-Send-Amount (How many times this update must still be send)
}

const masterPixelControl = new Map<number, Pxl>();
// Holds groups of indexes that belong to each other
let pixelGroups: number[][];

// Updates the master control map with the new pixel data
// and creates the groups used to send the data alternatingly
function updateMasterPixelControl(array: LEDMap){
    // Iterates over all items and updates the master
    for(let itm of array){
        const idx = itm[0];

        // Updates the master control
        masterPixelControl.set(idx, {
            tsm: 5,
            r: itm[1][0],
            g: itm[1][1],
            b: itm[1][2],
        });
    }

    // If the master is not empty, insert a push call as well
    if(masterPixelControl.size > 0)
        masterPixelControl.set(254, {r:0,b:0,g:0,tsm:5});

    // Creates the groups
    pixelGroups = [];
    let currentGroup: number[] = [];
    pixelGroups.push(currentGroup);

    for(let itm of masterPixelControl){
        // Ensures group size limit
        if(currentGroup.length > 10){
            currentGroup = [];
            pixelGroups.push(currentGroup);
        }

        // Adds the index
        currentGroup.push(itm[0]);
    }
}

//#region Old debugging code (May use again someday)

/*function debugMaster(){
    console.log("Master Update", [...masterPixelControl].map(x=>debugPxl(x[0],x[1])).join(", "));
}

function debugPxl(idx: number, pxl: Pxl){
    return `[${idx}] = ${pxl.r}/${pxl.g}/${pxl.b} (${pxl.tsm} TSM)`;
}

function debugGroup2String(grp: number[]){
    return grp.map(idx=>{
        const res = masterPixelControl.get(idx);
        if(res === undefined) return "{UndefPixel}";
        return debugPxl(idx, res);
    }).join(", ");
}

function debugGroups(){
    console.log("Pixel-Groups");
    pixelGroups.map(debugGroup2String).map(x=>`[${x}]`).forEach(grp=>{
        console.log("\t",grp);
    });
}*/

//#endregion

// Event: When the simulation pushes led's onto the wire
function onLEDPush(array: LEDMap) {
    if (sendData === undefined) return;

    // Updates the master
    updateMasterPixelControl(array);

    if(masterPixelControl.size <= 0) return;

    // Starts the transmission
    notifyTimer();
}

//#endregion

//#region Transmision-Timer

let timerId: NodeJS.Timeout | undefined;
let timerGroupIdx: number=0;

function onTimerFire(){

    if(pixelGroups.length <= 0 || masterPixelControl.size <= 0){
        clearInterval(timerId);
        timerId = undefined;
        return;
    }

    if(timerGroupIdx >= pixelGroups.length){
        timerGroupIdx = 0;
    }

    // Gets the next group
    const grp = pixelGroups[timerGroupIdx];

    // Creates the data array
    const data = new Uint8Array((1 + 3*4) * grp.length);
    let dataIdx = 0;

    const writeByte = (n: number) => {
        if (n === 255) n = 254;
        data[dataIdx] = n;
        data[dataIdx+1] = n;
        data[dataIdx+2] = n;
        dataIdx+=3;
    }
    const writePacket = (idx: number, r: number, g: number, b: number) => {
        data[dataIdx++] = 255;
        writeByte(idx);
        writeByte(r);
        writeByte(g);
        writeByte(b);
    }
    const writePush = () => {
        writePacket(254,0,0,0);
    }

    grp.forEach((itmIdx, grpIdx)=>{
        const itm = masterPixelControl.get(itmIdx)!;
        
        // Appends the data
        writePacket(itmIdx, itm.r, itm.g, itm.b);
        
        if(itm.tsm-- <= 0){
            // Removes the index from the group
            pixelGroups[timerGroupIdx] = pixelGroups[timerGroupIdx].filter((_,idx)=>idx!=grpIdx);
            // Removes the item from the master pixel control
            masterPixelControl.delete(itmIdx);
        }
    })

    ++timerGroupIdx;

    console.log("Sending data ",data);

    // Sends the data
    sendData!(data);
}

// Informs the timer that new data has arrived
function notifyTimer(){
    if(masterPixelControl.size <= 0) return;
    if(timerId !== undefined) return;

    // Restarts the sending process
    timerId = setInterval(onTimerFire, 20);
}

//#endregion

export default {
    onLEDPush,
    startConnection,
    stopConnection,
    onReset
}