# Generator Module

This module is primarily an adaptation of the function generator module to the procedures of the application.

The generated code will be divided into three section: a `setup` section intended to run only once, a `loop` section intended to run continuously and a section to store `globals`, eg. Function definitions or variables (Altho they are currently not used).

The module takes in procedures for the `setup` and `loop` sections and generates the corresponding code.

Additional generation settings allow for the following configurations:

- A template to insert the generated code into.
- String variables that will also be inserted into the template.
    - The variables `globals`, `setup`, and `loop` are reserved names and will be used to insert the generated code. Therefore, they are not valid variable names.
    - `$$Varname$$` syntax is used to insert variables.

## Example

Consider the template:

```cpp
#include <SomeLedLib.h>

#define CONFIG_VALUE_1 $$config_value$$
#define CONFIG_VALUE_2 $$config_value_undefined$$

$$global$$

void setup(){
    $$setup$$
}

void loop(){
    $$loop$$
}
```

With the proper configuration, the generated code might look like this:

```cpp
#include <SomeLedLib.h>

#define CONFIG_VALUE_1 5
#define CONFIG_VALUE_2 9

void simpleAnimation(int ledAmount, int durationSeconds){
    
    for(int i=0; i<ledAmount; i++)
        setLed(i, ON);

    sleep(durationSeconds);

    for(int i=0; i<ledAmount; i++)
        setLed(i, OFF);

}

void setup(){
    // Startup animation
    simpleAnimation(1,10);
}

void loop(){
    // Loop animation
    simpleAnimation(1,0);
    sleep(4);
    simpleAnimation(5,10);
    sleep(4);
}
```

Next, let's explore how this is done in code.