
This file will be added at some point and up until then be used for notes.

# Why electron over tauri?
Because electron uses Chromium on all Platforms while Tauri uses WebKit on Linux and MacOS.
And because at the time of writing this WebKit doesn't support Webserial. We would have to write some native integration code for the serial communication when previewing animations on hardware devices.

Maybe at some later point this project will start to use Tauri if they ever add an option to use chromium on all devices or if WebKit at some point starts to support Web-Serial.

# TODO-List

TODO: Add steps on how to build the webapp and the electron app

TODO: Idea: Default values for Color-Range HSV-Color picker (Would ease any variable useage)
TODO: Idea: Select some nodes and set all color range settings of h s v to a specific value
TODO: Idea: Make sure the interface is not as dark as the cpp code (Maybe have to look into logorithmic functions for that).
TODO: Make sure templates can retreive updates
TODO: Make sure templates can be selected without references (So they wont retreive updates)

TODO: Test Steps, MultiLed procedures
TODO: Create nodes for all modules

TODO: For Goggles, define a direction (Side). Such that turn off right goggle actually does the right and not the left one

TODO: Add switch to disable code optimisations for the cpp compiler (Can be used to get readable code that can be build up on)

TODO: Add auto-save feature

## Features

TODO: Added support for blockly mutators
TODO: Add file-api support for PWA's
TODO: In general overhaul the way files are accessed by the application.
    - Theoretically there are three ways:
        - Browser-Internal (Localstorage)
        - File (FileAccessApi) (No recent file support) (Not implemented)
        - File Up/Download (No recent file support)
        - File (Electron) (Requires custom logic)
    - Add a way to select a primary way (For shortcuts) and sort them better in the file tab
    - Maybe enable/disable them in the settings
    - Then also maybe disable
TODO: Add keyboard shortcuts for open/save/relaod and such
TODO: Add Info-tab or pannel to view keyboard shortcuts

# Requirements before actual release 0.1
TODO: Add Tutorial on how to use the application
TODO: Finalize application name and logo