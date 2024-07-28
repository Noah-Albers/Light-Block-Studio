models_delay_block = wait %1 ms
models_delay_field_delay_info = How long the block will wait
models_loop_field_repeats_info = How often the blocks shall be run.
models_loop_block = Repeat %1 times
models_color_block = Color %1 in %2
models_color_field_color_color = what color should be set
models_color_field_color_index_info = Index of the led. Starting from 0 (first).
storage_error_notsupported = Localstorage is not enabled in this browser
taskbar_storage_openupload_text = Open (Upload File)
taskbar_storage_openupload_title = Upload a file into this webpage
taskbar_storage_savedownload_text = Save (Download File)
taskbar_storage_savedownload_title = Download the project file on your drive
taskbar_storage_openbrowser = Open (Browser)
taskbar_storage_deletebrowser = Delete (Browser)
taskbar_storage_savebrowser = Save (Browser)
taskbar_storage_saveasbrowser = Save as... (Browser)
storage_prompt_save_as = Save as
storage_prompt_alreadyexists = A project named { $name } already exists. Do you want to overwrite it?
storage_error_nofound_text = No projects found...
storage_error_nofound_title = No projects found
storage_prompt_reallydelete = Do you really want to delete the Project '{ $name }'?
storage_error_failedtoload = Failed to load Project...\n Please check the console for more information on the error.
import_prompt_reallywant = Do you really want to open the project? Your current project will be closed.
import_prompt_reallywant_yes = Open
import_prompt_reallywant_no = Abort
import_prompt_unrecognizednodes = Warning: There are { $amount } Nodes which have a type that we don't recognize. These are: '{ $names }'. Maybe there are Plugins you still need to enable? Do you still want to load the Project? The unrecognized nodes will be removed.
import_prompt_unrecognizednodes_yes = Continue at my own risk
import_prompt_unrecognizednodes_no = Abort
blockly_category_control = Control
blockly_category_led = Led
view_visualizer_name = Visualizer
view_code_name = Code
view_serial_name = Serial
variables_system_amount_info = Holds the amount of leds set inside the settings.
popup_codecopied = Code copied
navbar_settings = Settings
navbar_copycode = Copy Code
offblock_title = Block Settings
serial_generallerror = Error with the serial port { $error }
serial_not_supported = .title = Serial API Problem
    .title = Serial API Problem
    .subtitle = Serial API is not supported in your browser
serial_not_supported_text =
    We are sorry but your browser doesn't support or allow the <a target="_blank"
    href="https://developer.mozilla.org/en-US/docs/Web/API/Serial">Serial Web API</a>,
    which we use to communicate with the external hardware.
    <br />
    If you still want to view your animations on real hardware, please use a <a target="_blank"
        href="https://caniuse.com/web-serial">browser</a> that supports the serial api
    or use the <a href="TODO" target="_blank">electron version</a> of this application.
serial_supported = .title = Serial Preview
    .title = Serial Preview
    .subtitle = View your animation on real hardware
serial_status_connected = Connected
serial_status_closed = Close
serial_settings_ledpin = LED-Data Pin
serial_settings_ledamount = LED-Amount
serial_copyscript = Copy Script
serial_action_connect = Connect!
serial_status_connecting = Opening port
serial_codecopyerror = Failed to copy the script code, please copy it manually: { $script }
globalsettings_general_specific_config = Specify config for selected?
globalsettings_general_specific_config-tooltip = If a block is selected, only the config for this block shall be build.
globalsettings_general_language = Language
globalsettings_general_language-tooltip = Which language to use for the application
globalsettings_category_general = General
globalsettings_category_serial = Serial API
globalsettings_serial_hideUnknownVendors = Hide unknown Serial-Vendors
globalsettings_serial_hideUnknownVendors-tooltip = Used to prevent random USB-Devices from showing up when connecting to hardware. Disable if your device isn't listed
globalsettings_serial_additional_usb_vendors = Additional USB-Vendors
globalsettings_serial_usb_restore_default = Restore defaults
globalsettings_serial_usb_vendorname = Vendor Name (Info Only)
globalsettings_serial_usb_vendorid = Vendor-ID
globalsettings_serial_usb_add = Add
hooks_title = Hook ({ $hook })
hooks_edit_field = .label = Edit ({ $hook })
    .label = Edit ({ $hook })
hooks_preview = Preview ({ $hook })
projectsettings_blueprint = .label = Blueprint
    .label = Blueprint
projectsettings_global_endLedPush = Add Led Push on Loop end
projectsettings_global_endLedPush-tooltip = If a final pushLed's call shall be ended at the end of the loop code
projectsettings_global_trimEmptyLines = Trim empty lines
projectsettings_global_trimEmptyLines-tooltip = If set, multiple empty lines will be trimmed down to a single one, improving code readability
projectsettings_global_pin = Pin
projectsettings_global_pin-tooltip = Which PIN the WS2812 (Neopixel) Stripe is connected to
projectsettings_global_amount = Pixel-Amount
projectsettings_global_amount-tooltip = How many pixels are connected to the LED-Stripe
projectsettings_category_general = General
projectsettings_category_hooks = Hooks
projectsettings_category_blueprint = Blueprint
projectssettings-title = Project Settings
globalsettings-title = Global Settings
templates_prompt_load = Do you really want to load the template? All your previous work will be lost.
template_name = { $template } from { $author }
templates_title = Templates
tab_file = File
tab_view = View
tab_view_switch = Switch
variables_view_name = Name
variables_view_value = Value
variables_view_field_variable = .label = Variable
    .label = Variable
variables_view_field_value = .label = Value
    .label = Value
variables_view_field_delete = .title = Delete the variable
    .title = Delete the variable
variables_error_invalidValue = '{ $name }' has an invalid value.
variables_error_duplicated = '{ $name }' is duplicated.
variables_error_firstChar = Variable names can't start with '{ $name }'.
variables_error_invalid = '{ $name }' is an invalid name.
variables_error_reserved = '{ $name }' is a reserved variable.
visualizer_button_switchPreview = Switch Preview
visualizer_previewselector_open = Select a visualisation preview
visualizer_previewselector_upload-tooltip = Upload a custom preview!
visualizer_previewselector_upload = Upload
visualizer_previewselector_save-tooltip = Save and continue!
visualizer_previewselector_save = Save
visualizer_previewselector_customPreview = Custom #{ $index }
visualizer_previewselector_icon_buildin = BuildIn
visualizer_previewselector_icon_delete = Delete
visualizer_previewselector_upload_import_error =
    { $count ->
        [one] { $files } is invalid (Must be an .svg file)
       *[other] { $files } are invalid (Must be svg files)
    }
visualizer_previewselector_upload_confirm = Do you really want to delete #{ $key }?
colorpicker_actions_swapColors = Swap Colors
colorpicker_actions_swapHue = Swap Hue
colorpicker_actions_swapSaturation = Swap Saturation
colorpicker_actions_swapValue = Swap Value
colorpicker_actions_randomize = Randomize
colorpicker_property_name_hue = Hue
colorpicker_property_name_saturation = Saturation
colorpicker_property_name_value = Value
blockly_rootblock_setup = Run on setup
blockly_rootblock_loop = Run on loop
globalsettings_general_isDeveloper = Enable Developer mode
globalsettings_general_isDeveloper-tooltip = This shows some extra options which are usefull when developing the application.
tab_developer = Developer
globalsettings_general_language-info = Language changes only become effective after a restart.
tab_developer_runTests = Run tests
developer_runtests_info = Test have been run, please check the Browser console
models_loop_field_repeats_title = Repeats
models_delay_field_delay_title = Delay
models_color_field_color_index_title = Index (Start)
models_color_field_color_title = Color
