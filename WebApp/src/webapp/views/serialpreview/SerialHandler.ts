import { $t } from "@localisation/Fluent";
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
 */
export function useSerialHandler() {

    // Ensures serial is available in this environment
    if (!("serial" in navigator)) return false;

    const connected = ref(ConnectionType.DISCONNECTED);

    // Serial port (once connected)
    let port: SerialPort | undefined = undefined;
    let writer: WritableStreamDefaultWriter<any> | undefined = undefined;

    // Uses the visualizer to hook send data to the hardware
    const visualizer = new Visualizer(onVisualizerPushLeds);

    // Hooks into the preview create config signal to restart any animations
    useSignal(Signals.BLOCKLY_PREVIEW_CREATE_CONFIG, onBlocklyPreviewChange);

    // Hooks the unmounted event to abort any serial communication
    onUnmounted(stopSerial);

    // Kills all and any serial communication
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

    // Function to start a serial connection
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
                baudRate: 115200
            });

            // Updates the status
            port = possiblePort;
            writer = port.writable.getWriter();

            connected.value = ConnectionType.CONNECTED;
            port.ondisconnect = stopSerial;

            // Sends a request for the config
            SignalDispatcher.emit(Signals.REQUEST_CONFIG_BUILD);

        } catch (err) {
            const str = err + "";

            if (str.indexOf("No port selected by the user")) return;

            // TODO: Show better error
            alert($t('serial_generallerror', { error: str }))
        }
    }


    // Event: The animation that shall play changed
    function onBlocklyPreviewChange(preview?: ProcedureWithOptions<any>[]) {
        if (connected.value !== ConnectionType.CONNECTED) return;

        // Simulates an initial "reset" push
        const obj: LEDArray = {};

        for (let i = 0; i < useSettingsStore().serialPreview.ledAmount; i++)
            obj[i] = [0, 0, 0];

        onVisualizerPushLeds(obj);

        if (preview === undefined) {
            visualizer.abortVisualizer();
            return;
        }

        // (Re)starts the visualizer
        visualizer.startVisualizer(preview);
    }


    // Event: When the visualizer pushes an update for the leds
    function onVisualizerPushLeds(array: LEDArray) {
        console.log("New data retreived");
        if (writer === undefined) return;
        console.log("Writer:",writer);

        const data = [];

        // Fills in the data
        for (let idx in array) {
            const rgb = array[idx];
            data.push(parseInt(idx));
            data.push(rgb[0]);
            data.push(rgb[1]);
            data.push(rgb[2]);
        }

        // TODO: Implement system where the push only runs if dirty data has been send
        
        // Appends the push command
        data.push(255);

        console.log(data);

        // Generates the data to send
        writer.write(new Uint8Array(data));
    }

    return {
        status: connected,
        startSerial,
        stopSerial
    }
}