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
storage_error_failedtoload = Failed to load Project... Please check the console for more information on the error.
storage_error_failedtowrite = Failed to write Project... Please check the console for more information on the error.
import_prompt_reallywant = Do you really want to open the project? Your current project will be closed.
import_prompt_reallywant_yes = Open
import_prompt_reallywant_no = Abort
import_prompt_unrecognizednodes = Warning: There are { $amount } Nodes which have a type that we don't recognize. These are: '{ $names }'. Maybe there are Plugins you still need to enable? Do you still want to load the Project? The unrecognized nodes will be removed.
import_prompt_unrecognizednodes_yes = Continue at my own risk
import_prompt_unrecognizednodes_no = Abort
blockly_category_control = Control
blockly_category_led = Led
blockly_category_goggles = Goggles
blockly_category_debug = Developer
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
    or use the <a href="TODO" target="_blank">desktop version</a> of this application.
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
models_loop_field_repeats_title = Repeats
models_delay_field_delay_title = Delay
models_color_field_color_index_title = Index (Start)
models_color_field_color_title = Color
developer_runtests_info_success = All tests have finished successfully.
developer_runtests_info_error =
    { $errors ->
        [one] One test has
       *[other] { $errors } tests have
    } failed, please check the Browser console.
blockly_category_animations = Animations
models_fade_field_idxStart_title = Start-Index
models_fade_field_idxStart_info = Starting index for the range.
models_fade_field_idxEnd_title = End-Index
models_fade_field_idxEnd_info = The index where the range shall stop
models_fade_field_offset_title = LED-Offset
models_fade_field_offset_info = An offset for each led. Use it to create a flow throughout the stripe.
models_fade_field_cycle_title = Cycle Length in ms
models_fade_field_cycle_info = How long (in ms) one color-cycle takes to complete.
models_fade_field_runtime_title = Runtime in ms
models_fade_field_runtime_info = How long (in ms) the cycle shall play. Eg. Runtime: 1000ms and cycle length 500ms would be 1s with 2 color-cycles.
models_fade_field_color_title = Color
models_fade_field_color_info = What color should be faded
models_fade_block = Color-Cycle of %1 for %2 ms
models_rainbow_field_idxStart_title = Start-Index
models_rainbow_field_idxStart_info = Starting index for the range.
models_rainbow_field_idxEnd_title = End-Index
models_rainbow_field_idxEnd_info = The index where the range shall stop.
models_rainbow_field_offset_title = LED-Offset
models_rainbow_field_offset_info = An offset for each led. Use it to create a flow throughout the stripe.
models_rainbow_field_cycle_title = Cycle Length in ms
models_rainbow_field_cycle_info = How long (in ms) one rainbow-cycle takes to complete.
models_rainbow_field_runtime_title = Runtime in ms
models_rainbow_field_runtime_info = How long (in ms) the rainbow shall play. Eg. Runtime: 1000ms and cycle length 500ms would be 1s with 2 rainbow cycles.
models_rainbow_field_value_title = Brightness (0-255)
models_rainbow_field_value_info = Brightness of the Rainbow.
models_rainbow_block = Rainbow for %1 ms
models_ledClear_block = Turn all leds off
models_multiLedGradiant_field_idxStart_title = Start-Index
models_multiLedGradiant_field_idxStart_info = Starting index for the range.
models_multiLedGradiant_field_idxEnd_title = End-Index
models_multiLedGradiant_field_idxEnd_info = The index where the range shall stop
models_multiLedGradiant_field_delay_title = Delay
models_multiLedGradiant_field_delay_info = How many milliseconds to wait between the leds.
models_multiLedGradiant_field_color_title = Color
models_multiLedGradiant_field_color_info = What color should be set.
models_multiLedGradiant_block = Color from %1 to %2 in %3
models_multiLed_field_idxStart_title = Start-Index
models_multiLed_field_idxStart_info = Starting index for the range.
models_multiLed_field_idxEnd_title = End-Index
models_multiLed_field_idxEnd_info = The index where the range shall stop.
models_multiLed_field_delay_title = Delay
models_multiLed_field_delay_info = How many milliseconds to wait between the leds.
models_multiLed_field_color_title = Color
models_multiLed_field_color_info = What color should be set.
models_multiLed_block = Color from %1 to %2 in %3
globalsettings_general_defaultPreview = Default Preview for new Projects
globalsettings_general_defaultPreview-tooltip = Change default Preview
ledhook_preset_ledapi = Select Preset
ledhook_reservedVariables = Reserved Variables (Seperated by comma)
projectsettings_category_ledapi = LED-API
file_tab_ledapi = LED-API
file_tab_ledapi_fastled = FastLED (Default)
file_tab_ledapi_adafruit = Adafruit Neopixel
models_goggle_color_field_color_title = Color
models_goggle_color_field_color_info = In which color the goggle shall be colored
models_goggle_color_field_direction_title = Direction
models_goggle_color_field_direction_info = Direction that the animation shall play
models_goggle_color_field_direction_opt_forward = forward
models_goggle_color_field_direction_opt_backward = backward
models_goggle_color_field_delay_title = Delay
models_goggle_color_field_delay_info = How many milliseconds to wait between each led
models_goggle_color_block_title = Color %1 goggle(s) in %2
models_goggle_util_field_goggle = Which goggle to color
models_goggle_util_field_goggle_info = Select the goggle which shall be colored.
models_goggle_util_field_goggle_opt_right = the right
models_goggle_util_field_goggle_opt_left = the left
models_goggle_util_field_goggle_opt_both = both
models_goggle_util_field_goggle_title = Which goggle to color
models_goggle_color_block = Color %1 goggle(s) in %2
models_goggle_turnoff_block = Turn %1 goggle(s) off
models_fullled_field_ledreverse_title = Are the leds reversed?
models_fullled_field_ledreverse_info = If the leds should be reversed when animating
models_fullled_field_ledreverse_opt_no = No
models_fullled_field_ledreverse_opt_yes = Yes
models_fullled_field_stepsreverse_title = Are the steps reversed?
models_fullled_field_stepsreverse_info = If the step should be reversed when animating
models_fullled_field_stepsreverse_opt_no = No
models_fullled_field_stepsreverse_opt_yes = Yes
models_fullled_field_parallel_title = Type
models_fullled_field_parallel_info = If the animation is parallel or serial
models_fullled_field_parallel_opt_parallel = Parallel
models_fullled_field_parallel_opt_serial = Serial
models_fullled_field_delayled_title = Delay (Per Led)
models_fullled_field_delayled_info = Milliseconds to wait between leds
models_fullled_field_delaystep_title = Delay (Per Step)
models_fullled_field_delaystep_info = Milliseconds to wait between steps
models_fullled_field_steps_title = Steps
models_fullled_field_steps_info = How many steps there are
models_fullled_field_space_title = Space between Steps
models_fullled_field_space_info = Amount of leds to be empty between steps
models_fullled_field_idxStart_title = Start-Index
models_fullled_field_idxStart_info = Index-Offset to start the animation from
models_fullled_field_stepsize_title = Step Size
models_fullled_field_stepsize_info = How long each step is in size.
models_fullled_field_color_title = Color
models_fullled_field_color_info = What color should be set.
models_fullled_block = Color %1 steps in %2 with %3 spaces
globalsettings_error_ls-not-supported = Your browser doesn't support localstorage. Please be aware that your Settings wont be saved.
storage-desktop_save_title = Save Project
storage-desktop_save_error = Failed to save the project. Did your file-extension end in { $EXT }? This is required as a security measure. Do you want to retry?
storage-desktop_save_error_no = No
storage-desktop_save_error_yes = Yes
storage-desktop_load_error = Failed to read project file. Please make sure it exists and that is's name ends with { $EXT }.
storage-desktop_load_title = Open Project
taskbar_storage-desktop_open = Open
taskbar_storage-desktop_open_title = Open a project-file
taskbar_storage-desktop_recent = Open recent
taskbar_storage-desktop_recent_title = Open a recently saved project file
taskbar_storage-desktop_recent_item_title = Load this project
taskbar_storage-desktop_save = Save
taskbar_storage-desktop_save_title = Save the project as a file
taskbar_storage-desktop_saveas = Save as...
taskbar_storage-desktop_saveas_title = Save the project into a file you select
tab_file_new = New
tab_developer_open_devtools = Open Developer-Tools
projectsettings_qa_what-is-blueprint-title = What is the blueprint?
projectsettings_qa_what-is-blueprint-html =
    <p>The blueprint is the basic code surrounding the final generated code.</p>
    <p>You can write custom logic here and extend or change it.</p>
    <p>Using variables you can specify where the genrated code shall be put.</p>
projectsettings_qa_what-are-variables-title = How do i use variables?
projectsettings_qa_what-are-variables-html =
    <p>
        You can simple insert the text $$VariableName$$ into any part of the code and that part will<br>
        be replaced with the corresponding variable you specified.
    </p>
    <p>But be careful. Reserved variable names will always be overwritten with generated code.</p>
projectsettings_qa_reserved-variables-title = Which reserved variables exist?
projectsettings_qa_reserved-variables-html =
    <p><span>$$ledInclude$$</span> is replaced with the #include Statement used by the led-library you selected.</p>
    <br>
    
    <p>If you for example selected Fast-LED, this might be something like: #include &lt;FastLED.h&gt;</p>
    <br>
    <p><span>$$pin$$</span> is replaced with the led pin you specified in the project settings.</p>
    <br>
    <p><span>$$amt$$</span> is replaced with the led amount you specified in the project settings.</p>
    <br>
    <p><span>$$ledGlobal$$</span> is replaced with any global-scoped code that the led-library might need.</p>
    <br>
    <p><span>$$globals$$</span> is replaced with any global-scoped code that the generated application code might need.</p>
    <br>
    <p><span>$$ledSetup$$</span> is replaced with any setup code that the led-library might need.</p>
    <br>
    <p><span>$$setup$$</span> is replaced with any generated setup code that the application generated.<br></p>
    <br>
    <p><span>$$loop$$</span> is replaced with any generated loop code that the application generated.</p>
tab_help = Help
tab_help_report_bug = Report a bug
pwa_notice = I can be installed as a Progressive Web App
pwa_information = A Progressive Web App (PWA) is effortlessly installed directly through your browser, providing a simple and secure way to add the app to your device. This allows you to access the app even when you're offline, ensuring a seamless experience anytime, anywhere.
pwa_install = Install!
pwa_close_temp = Close, dont reming me again!
pwa_close_final = Reming me again later!
tab_help_install_pwa = Install as PWA!
tab_help_install_pwa_not_supported = Not supported in your browser
taskbar_storage_fileapi_open_txt = Open
taskbar_storage_fileapi_open_title = Open a project file
taskbar_storage_fileapi_save_txt = Save
taskbar_storage_fileapi_save_title = Save the project to a file
taskbar_storage_fileapi_save_as_txt = Save as ...
taskbar_storage_fileapi_save_as_title = Save the project to a file
tab_file_settings = Settings
tab_edit_copycode = Copy Code
tab_edit_copycode_title = Generate and copy the source code of the current program
tab_edit_config = Rebuild Config
tab_edit_config_title = Rebuild the config used to show the animation and generated code.
tab_edit = Edit
miniinfo_saved_project = Saved Project
keyinfo_title_shortcut = Shortcut
keyinfo_title_action = Action
keyinfo_key_ctrl = CTRL
keyinfo_key_shift = SHIFT
keyinfo_info_saveas_title = Save as ...
keyinfo_info_saveas_desc = Saves the project in a new file.
keyinfo_info_save_title = Save
keyinfo_info_save_desc = Saves the project. If no file exists, a new one will be choosen by the user.
keyinfo_info_open_title = Open
keyinfo_info_open_desc = Open a project file.
keyinfo_info_rlconfig_title = Reload Config
keyinfo_info_rlconfig_desc = Reloads/Rebuilds the config which is used to display the preview or generate the code. Usually this is one automagically behind the scenes tho. Also config doesn't mean project settings. It means the actual config generated by the blocks you lay out in the workspace.
keyinfo_info_cpcode_title = Copy Code
keyinfo_info_cpcode_desc = Copies the generated code into your clipboard.
keyinfo_info_cycleview_title = Cycle View
keyinfo_info_cycleview_desc = Cycles through the views on the sidebar.
tab_help_about = About
tab_help_shortcuts = View Shortcuts
