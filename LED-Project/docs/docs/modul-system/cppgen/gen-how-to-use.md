// TODO: Explain procedure module first



The `@cppgen/generator` exposes an `index.ts` file with most of what you'll need to use the module.

The following illustrates how to generate c++ code with the generator and some procedures.

# Step 1: Define Function Options and Generator

Define the options that can be passed to the function along with the generator function. For example:

```typescript
type SetLedXOptions = {
    led: number, // Positive integer
    r: number,   // Integer between 0 and 255
    g: number,   // Integer between 0 and 255
    b: number    // Integer between 0 and 255
}

function generateSetLedX({ r, g, b, led }: CppFnInformation<SetLedXOptions>, vs: IVariableSupplier): string {
    let calc = vs.register("calcResult");
    return `
        int ${calc} = ${r} << 16 & ${g} << 8 & ${b};
        setLed(${led}, ${calc});
    `;
}
```

`generateSetLedX` is the function that will later be used to generate the code for the c++ function.

The `SetLedXoptions` type defines which arguments will later be passed to the c++ function.


## Variable-Supplier
The `vs: IVariableSupplier` is used to define custom c++ variables. Using it prevents naming conflicts, so it is highly adviced to do so.

Note that it is used to register a tmp variable for generating the color.

## CppFnInformation.
Because the Generator allows for arguments to be supplied as static none-variable values, which can be directly printed into the c++ code, `r`,`g`,`b` and `led` might or might not contain a variable value.

They all look like this:
```typescript
// r, g, b, led
= {
    available: boolean,
    value: Value | string,
}
```

`available` defines if the actual value of the parameter (`r`, `g`, `b`, `led`) is available inside the `value` property or if a variable (string) is used.

If you dont care about that, you can just print the raw ts-variable into you code and the generator will handle the rest, as seen above.

# Step 2: Register the Function

Register the function to the C++ generator using `addFunction`. This includes specifying the function name, typescript generator function, and type mappings:

```typescript
let ref2SetLedX = cppGen.addFunction<SetLedXOptions>({
    name: "setLedX",
    generator: generateSetLedX,
    types: {
        led: CppType.INT,
        r: CppType.INT,
        g: CppType.INT,
        b: CppType.INT,
    }
});
```

The `name` element will later be used to name the function in c++ code (Tho it is possible that the function won't be called that do to name collisions).

The `generator` is you previously defined generator to actually create the c++ code.

And finally the `types` is an object which mapps the Typescript variables into cpp types. These are used to print the actual value as, for example, an int or float.

This returns a reference to the cpp registered function, called a `ICppFnHandle`. This reference is later on used to generate the actual calls.

# Step 3: Register Function Calls

Register all calls to the function using the reference obtained from step 2:

```typescript
let call_1: SetLedXOptions = { led: 0, r: 200, b: 0, g: 0 };
let call_2: SetLedXOptions = { led: 1, r: 0, b: 100, g: 0 };

ref2SetLedX.addCall(call_1);
ref2SetLedX.addCall(call_2);
```

These calls will be used to later on remove redundant parameters from the c++ function, making it faster to run as the c++ precompiler can potencially calculate numeric values ahead of time and also cluttering the code less with extra variables.

# Step 4: Generate C++ Function Code

Generate the code for the C++ functions using the `generate` method of `ICppFnManager`:

```typescript
let result = cppGen.generate(...);
const code = result.code;
```

The three dots `...` are a value that can optionally be passed to the generator and which will be forwarded to the c++ generator functions.

In the above example a variable supplier `vs: IVariableSupplier` was used. But to ensure modularity also anything else can be used.

There is even intelli-sense support do to passed down generic references.

# Step 5: Generate Function Calls

Generate calls to the C++ function using the `getCallFor` method of `ICppFnCallGenerator`:

```typescript
let calls = [
    result.callGenerator.getCallFor(ref2SetLedX, call_1),
    result.callGenerator.getCallFor(ref2SetLedX, call_2)
].join("\n");
```

Now you have successfully used the C++ function generator to create and call C++ functions.

Your result should look something like this:

```ts
const code = result.code;
```
should contain:

```cpp
// This is a typescript string
void setLedX(int led, int r, int g, int b){
   int calcResult = r << 16 & 0 << 8 & b;
   setLed(led, calcResult);
}
```

and
```ts
const calls = [...];
```
should contains:

```cpp
// This is a typescript string
setLedX(0,200,0);
setLedX(1,0,100);
```

Note that the parameter `g` has been removed because it was the same across all calls.