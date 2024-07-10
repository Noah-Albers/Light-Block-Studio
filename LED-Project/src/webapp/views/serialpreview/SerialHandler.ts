import { ProcedureWithOptions } from "@procedure/definitions/Procedure";
import { LEDArray } from "@visualizer/implementations/VisualisationController";
import { Visualizer } from "@visualizer/index";
import { useSettingsStore } from "@webapp/stores/SettingsStore";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import { useSignal } from "@webapp/utils/vue/VueSignalListener";
import { onUnmounted, ref } from "vue";

export enum ConnectionType {
    CONNECTED,
    DISCONNECTED,
    CONNECTING
}

/**
 * Vue-Plugin that exposes the serial interface to connect to
 * 
 * TODO: Comment after fully implemented
 */
export function useSerialHandler() {

    if (!("serial" in navigator)) return false;

    const connected = ref(ConnectionType.DISCONNECTED);

    // Serial port (once connected)
    let port: SerialPort | undefined = undefined;
    let writer: WritableStreamDefaultWriter<any> | undefined = undefined;

    const visualizer = new Visualizer(onVisualizerPushLeds);

    useSignal(Signals.BLOCKLY_PREVIEW_CREATE_CONFIG, onBlocklyPreviewChange);

    onUnmounted(stopSerial);

    async function stopSerial() {
        if (port === undefined) return;
        try {
            writer!.releaseLock();
        } catch (err) { }
        try {
            await port.close();
        } catch (err) { }
        port = undefined;
        writer = undefined;
        connected.value = ConnectionType.DISCONNECTED;
    }

    // Builds the list used to search the usb devices
    function getSerialSearchList(){
        const store = useSettingsStore();
        if(!store.whitelistUsbVendors.enabled)
            return undefined;

        return {
            filters: store.whitelistUsbVendors.whitelist.map(itm=>({usbVendorId: itm[1]}))
        }
    }

    async function startSerial() {
        try {
            // Ensures no prior serial port is open
            await stopSerial();
            await visualizer.abortVisualizer();

            // Request the serial port from the user
            const possiblePort = await navigator.serial.requestPort(getSerialSearchList());

            connected.value = ConnectionType.CONNECTING;

            // Open the port
            await possiblePort.open({
                baudRate: 9600
            });

            // Updates the status
            port = possiblePort;
            writer = port.writable.getWriter()
            connected.value = ConnectionType.CONNECTED;
            port.ondisconnect = stopSerial;

            // Sends a request for the config
            SignalDispatcher.emit(Signals.REQUEST_CONFIG_BUILD);


            console.log("Done");


        } catch (err) {
            const str = err + "";

            if (str.indexOf("No port selected by the user")) return;

            // TODO: Show better error
            alert("Error with the serial port" + str);
        }
    }


    // Event: The animation that shall play changed
    function onBlocklyPreviewChange(preview?: ProcedureWithOptions<any>[]) {
        if (connected.value !== ConnectionType.CONNECTED) return;

        // Simulates an initial "reset" push
        /*const obj: LEDArray = {};

        for (let i = 0; i < useSettingsStore().serialPreview.ledAmount; i++)
            obj[i] = [Math.min(10*i,255), 255, 255];*/

        //onVisualizerPushLeds(obj);

        if (preview === undefined) {
            visualizer.abortVisualizer();
            return;
        }

        // (Re)starts the visualizer
        visualizer.startVisualizer(preview);
    }


    // Event: When the visualizer pushes an update for the leds
    function onVisualizerPushLeds(array: LEDArray) {
        if (writer === undefined) return;


        const data = [];

        // Fills in the data
        for (let idx in array) {
            const rgb = array[idx];
            data.push(parseInt(idx));
            data.push(rgb[0]);
            data.push(rgb[1]);
            data.push(rgb[2]);
            console.log("AS HEX: "+(rgb[0] << 16 | rgb[1] << 8 | rgb[2]).toString(16))
        }

        // Appends the push command
        data.push(255);
        console.log("Sending ", data);

        // Generates the data to send
        writer.write(new Uint8Array(data));
    }

    return {
        status: connected,
        startSerial,
        stopSerial
    }
}