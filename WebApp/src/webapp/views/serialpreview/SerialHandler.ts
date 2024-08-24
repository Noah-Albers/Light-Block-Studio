import { $t } from "@localisation/Fluent";
import { ProcedureWithOptions } from "@procedure/definitions/Procedure";
import { Visualizer } from "@visualizer/index";
import { useSettingsStore } from "@webapp/stores/SettingsStore";
import { SignalDispatcher } from "@webapp/utils/signals/SignalDispatcher";
import { Signals } from "@webapp/utils/signals/Signals";
import { useSignal } from "@webapp/utils/vue/VueSignalListener";
import { onUnmounted, ref } from "vue";
import LEDTransmisionProtocol from "./LEDTransmisionProtocol";

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
    const visualizer = new Visualizer(LEDTransmisionProtocol.onLEDPush);

    // Hooks into the preview create config signal to restart any animations
    useSignal(Signals.BLOCKLY_PREVIEW_CREATE_CONFIG, onBlocklyPreviewChange);

    // Hooks the unmounted event to abort any serial communication
    onUnmounted(stopSerial);

    // Kills all and any serial communication
    // and performs cleanup
    async function stopSerial() {
        if (port === undefined) return;
        LEDTransmisionProtocol.stopConnection();
        try {
            writer!.releaseLock();
        } catch (err) { }
        try {
            await port.close();
        } catch (err) { }
        visualizer.abortVisualizer();
        port = undefined;
        writer = undefined;
        connected.value = ConnectionType.DISCONNECTED;
    }

    // Builds the list used to search the usb devices
    function getSerialSearchList() {
        const store = useSettingsStore();
        if (!store.whitelistUsbVendors.enabled)
            return undefined;

        return {
            filters: store.whitelistUsbVendors.whitelist.map(itm => ({ usbVendorId: itm[1] }))
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

            // Starts the transmision protocol
            LEDTransmisionProtocol.startConnection(onProtocolSendData);

            connected.value = ConnectionType.CONNECTED;
            port.ondisconnect = stopSerial;

            // Sends a request for the config
            SignalDispatcher.emit(Signals.REQUEST_CONFIG_BUILD);

        } catch (err) {
            const str = err + "";

            if (str.indexOf("No port selected by the user")) return;

            // TODO: Show better error
            alert($t('serial_generallerror', { error: str }))

            stopSerial();
        }
    }

    // When the led-transmision protocol sends data
    function onProtocolSendData(data: Uint8Array){
        if (writer === undefined) return;
        if (data.length <= 0) return;

        console.log("OnWire", data);

        // Sends the data
        writer.write(data);
    }

    // Event: The animation that shall play changed
    function onBlocklyPreviewChange(preview?: ProcedureWithOptions<any>[]) {
        if (connected.value !== ConnectionType.CONNECTED) return;

        LEDTransmisionProtocol.onReset();

        if (preview === undefined) {
            visualizer.abortVisualizer();
            return;
        }

        // (Re)starts the visualizer
        visualizer.startVisualizer(preview);
    }

    return {
        status: connected,
        startSerial,
        stopSerial
    }
}