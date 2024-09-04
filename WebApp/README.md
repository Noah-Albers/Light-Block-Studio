
This file will be added at some point and up until then be used for notes.

# Why electron over tauri?
Because electron uses Chromium on all Platforms while Tauri uses WebKit on Linux and MacOS.
And because at the time of writing this WebKit doesn't support Webserial, we would have to write some native integration code for the serial communication when previewing animations on hardware devices.

Maybe at some later point this project will start to use Tauri if they ever add an option to use chromium on all devices or if WebKit at some point starts to support Web-Serial.

# TODO-List

TODO: Add steps on how to build the webapp and the electron app

TODO: Fix bug that none-onblock field don't get copied (Can probably hook into event or smth.)

TODO: Idea: Default values for Color-Range HSV-Color picker (Would ease any variable useage)
TODO: Idea: Select some nodes and set all color range settings of h s v to a specific value
TODO: Idea: Make sure the interface is not as dark as the cpp code (Maybe have to look into logorithmic functions for that).
TODO: Make sure templates can retreive updates
TODO: Make sure templates can be selected without references (So they wont retreive updates)

TODO: Test Steps, MultiLed procedures
TODO: Create nodes for all modules

TODO: For Goggles, define a direction (Side). Such that turn off right goggle actually does the right and not the left one

TODO: Add switch to disable code optimisations for the cpp compiler (Can be used to get readable code that can be build up on)