import { replaceVariables } from "@utils/StringUtils";
import { useProjectStore } from "@webapp/stores/ProjectStore";
import { useSettingsStore } from "@webapp/stores/SettingsStore";

export function createSerialPreviewCode() {

    const store = useProjectStore();
    const settings = useSettingsStore();

    // Generates the specific led api code
    const setHSV = replaceVariables(store.ledSystemHooks.sethsv, {
        idx: "idx",
        hue: "h",
        saturation: "s",
        value: "v"
    });

    return (
`${store.ledSystemHooks.includeCode}
#define LED_PIN ${settings.serialPreview.pin}
#define LED_AMT ${settings.serialPreview.ledAmount}

#define MAGIC_NUMBER 255

${store.ledSystemHooks.globalCode}

void setup(){
    ${store.ledSystemHooks.setupCode}

    // Starts serial communication
    Serial.begin(115200);
}

int readRealByte(){
    int a = Serial.read();
    int b = Serial.read();
    int c = Serial.read();

    if(a == b && b == c)
        return a;

    if(a == c)
        return a;
    if(a == b)
        return b;
    if(c == b)
        return c;

    // Invalid byte read
    return -1;
}

void loop(){
  // Interprets the command as the index to set the color at

    // Reads until a new packet starts
    while(Serial.read() != MAGIC_NUMBER);

    // Reads in the index
    int idx = readRealByte();
    if(idx == -1)return;

    // Reads in the hsv values
    int h = readRealByte();
    if(h == -1) return;
    int s = readRealByte();
    if(s == -1) return;
    int v = readRealByte();
    if(v == -1) return;

    // If the index is 254, it is regarded as a push command
    if(idx == 254){
        // Pushes the data
        ${store.ledSystemHooks.pushleds}
    }

    // Ensures index is within range
    if(idx >= LED_AMT) return;

    // Sets the color
    ${setHSV}
}`);
}