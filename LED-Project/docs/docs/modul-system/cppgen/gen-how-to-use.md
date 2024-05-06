The `@cppgen/generator` exposes an `index.ts` file with most of what you'll need to use the module.

The following illustrates how to generate c++ code with the generator and some procedures.

After creating an instance of CppGenerator:

```ts
const cppGen = new CppGenerator();
```

you'll need a few things.

`setup` and `loop` procedures. These are each an array of `ProcedureWithOptions<any>` which can be obtained from the blockly-models (Shown later on) or provided in other ways.

Here lets say there is an led procedure (Just an example which doesn't exist) to set a given led and a delay procedure (Which may exist later on).

```ts
function getSetLed(idx, rgb){
    return {
        procedure: LED_PROC,
        options: { idx, rgb }
    }
}

// Set the first three leds as first = red, second = green, third = blue
const setup = [
    getSetLed(0,0xff0000),
    getSetLed(1,0x00ff00),
    getSetLed(2,0x0000ff),
]

// Blinks the first (0) led red and off with a delay of 1000 milliseconds between
const loop = [
    getSetLed(0,0xff0000),
    { procedure: DELAY, options: { wait: 1000 /* millis */ } },
    getSetLed(0,0x000000),
    { procedure: DELAY, options: { wait: 1000 /* millis */ } },
]
```

Further you will now need to specify the settings used to generate the code:

Start with the template to insert the generated code into.
The generated code will be placed inside.

```ts
    const template = `
        #define CONFIG_VALUE_1 $$config_value$$
        #define CONFIG_VALUE_2 $$config_value_undefined$$
        
        $$global$$
        
        void setup(){
            $$setup$$
        }
        
        void loop(){
            $$loop$$
        }
    `;
```

The generated code will be placed into the three placeholders called `setup`, `loop` and `globals`.

Further you can define string-variables which will be inserted into your code:

```ts
const variables = {
    "CONFIG_VALUE_1": "10",
    "CONFIG_VALUE_2": "20"
}
```

Note that the variables `setup`, `loop` and `globals` are reserved for the generated code and will be overwritten.

To insert variables into your template, use this format: `$$varName$$` as seen in the above example.

Now that you have all that you need, its time to plug all variables together into the generator and to generate your code:

```ts

const settings: GenerationSettings = {
    template: template,
    variables: variables
}

const cppGen = new CppGenerator();

const result: string = cppGen.generate(setup, loop, settings);
```

this will result in a single string (If everything worked, which is should) with all the code. The above example might generated:

(Note: Enhanced with comments for clairity):

```cpp

// Note: Variables got inserted into the code
#define CONFIG_VALUE_1 10
#define CONFIG_VALUE_2 20

// Note: Function generated to set a single rgb led.
void setLed(int idx, int rgb){ /* ... */ }


// Note: Setup code got injected
void setup(){
    setLed(0,0xff0000);
    setLed(1,0x00ff00);
    setLed(2,0x0000ff);
}

// Note: Loop code got injected
void loop(){
    setLed(0,0xff0000);
    delay(1000);
    setLed(0,0);
    delay(1000);
}
```

Well now you know how to use the cpp-generator, lets move on.