
This file will be added at some point and up until then be used for notes.

# Why electron over tauri?
Because electron uses Chromium on all Platforms while Tauri uses WebKit on Linux and MacOS.
And because at the time of writing this WebKit doesn't support Webserial, we would have to write some native integration code for the serial communication when previewing animations on hardware devices.

Maybe at some later point this project will start to use Tauri if they ever add an option to use chromium on all devices or if WebKit at some point starts to support Web-Serial.

TODO: Add steps on how to build the webapp and the electron app

TODO: Fix bug that none-onblock field don't get copied (Can probably hook into event or smth.)