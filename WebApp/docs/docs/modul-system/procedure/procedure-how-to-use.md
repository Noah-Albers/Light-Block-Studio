

# Steps to define a procedure

Lets walk you through the step to creating your own procedure

## Step 1: Define config
Each procedure requires a config object that tells it how to operate.

For the purpose of explaining this, we will be building the loop-procedure from scratch.

Start by defining your config using:

```typescript
export type LoopProcedureOptions = {
    repeats: number,
    sub: ProcedureWithOptions<any>[]
}
```

Note that it need to be compatible with the type `ProcedureOptions`.

```typescript
export type ProcedureOptions = {
    [key: string]: string | boolean | number | ProcedureWithOptions[]
}
```

This means that:
- The Config Options must be an object
- Each value must be either a `number` (Float / Int), `boolean` (Bool), or `string` (char) or a `ProcedureWithOptions[]` (See below).

Note 1.: Strings are currently **not** supported. They are only used to pass char's. Also you should really think twice if you really need to use a char or if a normal number is enought.

`ProcedureWithOptions` means another object which holds a Procedure and Options to supply to this procedure. This can be used for sub-procedures. They are used to create loops or wrapper components. 
The `ProcedureWithOptions` type looks like this:
```typescript
type ProcedureWithOptions<Options extends ProcedureOptions> = {
    procedure: IProcedure<Options>,
    options: Options
}
```

As you can see it requires a Procedure and its supplyed config.

Now that you have defined your config for the Procedure, lets move on to generating the actual c++ code.

## Step 2: Creating code constructor

Create a class inheriting from `ICodeConstructor` and supply your Config type as the generic Argument:

```typescript
import { ICodeConstructor } from "@procedure/definitions/ProcCodeConstructor";

class LoopCodeConstructor implements ICodeConstructor<LoopProcedureOptions> {
    
}
```

The `ICodeConstructor` requires two functions to be overwritten:

### registerFunctions

```typescript
registerFunctions(cppFnManager: ICppFnManager<IExtendedCodeSupport>, calls: LoopProcedureOptions[]) {
    // ...
}
```

The `registerFunctions(...);` method is used to register custom C++ functions to the [Function Manager](../cppgen/func-manager-overview.md) as explained in it's section.

// TODO: Add reference
It is called during code creation. (Details will later be given in the CppGenerator section). For now just know that during execution of this function, the code creation is happening.

The `calls`-argument is an array with each config that your Procedure is called with.
You can now use these to register custom procedure functions to the [Function Manager](../cppgen/func-manager-overview.md). 

For our `LoopProcedure` we dont need to register a custom function. However for demonstraction purposes we'll do it anyway.


For your function we'll also define a "Config" type:

```typescript
type SomeFuncArgs = {
    led: number,
    r: number,
    g: number,
    b: number
}
```

These are the arguments that will later on be passed to the function in code (or not depending on the amount of calls).

Before we can add the function well need some things first:

1. We'll need a mapping between the Typescript Types and C++ Types:

```ts
import { CppType } from "@cppgen/functionManager";

{
    led: CppType.INT,
    r: CppType.INT,
    g: CppType.INT,
    b: CppType.INT,
}
```

2. Well need a generator function that will generate the actual code for us.

This generator will be explained below, for now just add the following code to your class:

```ts
generteMyCppFunctionCode({ r, g, b, led }: CppFnInformation<SetLedXOptions>, cs: ICodeSupport) : string {
    // ...
}
```

Now will add the function to the manager:
```typescript
import { CppType } from "@cppgen/functionManager";

let someFunc = cppFnManager.addFunction<SomeFuncArgs>({
    name: "loopFunction",
    types: {
        led: CppType.INT,
        r: CppType.INT,
        g: CppType.INT,
        b: CppType.INT,
    },
    generator: generteMyCppFunctionCode
});
```

Note that for each each procedure, you'll need to add the custom calls to the function reference you just got:

```ts
someFunc.addCall({
    r: 1, g: 2, b: 2, led: 10
})
```
as an example. Tho you might want them to be influenced by your procedure call options.

Its important that the function Reference is returned with a name. For example:

```ts
registerFunctions(cppFnManager: ICppFnManager<IExtendedCodeSupport>, calls: LoopProcedureOptions[]) {
    let someFunc = cppFnManager...;

    return {
        myFunc: someFunc
    }
}
```

This object is used later on to call the function during actual code generation.


Now finally for the code generator function:

```ts
generteMyCppFunctionCode({ r, g, b, led }: CppFnInformation<SetLedXOptions>, cs: ICodeSupport) : string {
    // ...
}
```

Note that `r`,`g`,`b` and `led` have already been unpacked and can therefor be used as variables.

Futher the function has access to a codesupport object that can be used to access various support for generating code. For more info look into the [CodeSupportUtil](TODO).

Also for more information on how to generate code for a custom c+ function, see the [How to Function Manager](../cppgen/func-manager-how-to-use.md) section.


Now for the other function


### constructCode

The `constructCode(...);` function is called when the actual code of the module should be generated:

```typescript
constructCode(options: LoopProcedureOptions, genTools: IExtendedCodeSupport, associatedFunctions: CC_CppFnHandles<{}>, dirtyState: boolean): CodeResult {
    // ...
}
```

It takes in the `config` (Options) which you specified for the module.
Some code generation tools `genTools` to call predefined microcontroller functions like `millis()` or `delay()` and to call registered functions that you registered from `registerFunctions(...)`;

Further the dirty-State indicated if there are led's in the cache that have not been pushed to the stripe. If so and you want to start a delay, you might want to push them to the stripe first.

Returned is a `CodeResult`, it look like this:

```ts
export type CodeResult = {
    code: string,
    dirtyState: boolean
}
```

The code is the actual code, pasted into the setup or loop module and the dirtyState will be passd onto the next module.

If you want to call your registered functions, use the supplyed `genTools` and your predefined `associatedFunctions` object. For example, lets say we registered the functions from above.

Now we can call it like this:

```ts
constructCode(options: LoopProcedureOptions, genTools: IExtendedCodeSupport, associatedFunctions: CC_CppFnHandles<{}>, dirtyState: boolean): CodeResult {
    const fnCall = genTools.callFunction(associatedFunctions.myFunc, options);

    return {
        code: fnCall,
        dirtyState
    }
}
```

Which will just call the functions and do nothing else.
You oftn want this behavious as a procedure is possibly called multiple times. And if it does a lot of things that are configurable, a c++ function is the best options to "compress" this function.

Therefor the (SimpleFunctionCodeConstructor)[TODO] class exists which directly maps a procedure to execly one functions and is easier to use for that functionaliy. See it's section for a detailed explaination.


Now that you know how to code constructor works, lets move on to the diagnostics section:

## Step 3: Create diagnostics

The diagnostics object provides information about a procedure. Currently two specific things:

* How long it will run
* Which leds it will access.

You'll also need a class for that. So go ahead and create one that inherits from `IDiagnostics`, also provide it your config.

For example:

```ts
class LoopDiagnostics<LoopProcedureOptions> {
    // ...
}
```

It will overwrite two methods:

### evaluateRuntime

The `evaluateRuntime(...);` method is, as the name suggests, here to evaluate the runtime of the procedure.
It look like this:

```ts
evaluateRuntime(opts: LoopProcedureOptions) : number | undefined;
```

As you can see it is provided the loop options and expects a number or undefined to be returned.

The returned unit is Milliseconds. So if you expect your module to run 10 seconds, return 10000.

If you don't know your runtim or have no way of calculating it, just return undefined. Tho do note that this is a very bad style because it eliminates an important quality of life feature from you procedure and therefor every module above it.

So lets look how the implementation could look for a loop module:

```ts
evaluateRuntime(opts: LoopProcedureOptions) : number | undefined {
    // An array of the runtime of every submodule
    const result = opts.sub.map({procedure, options} => procedure.getDiagnostics().evaluateRuntime(options));

    // Checks if runtime is undefined
    if(result.some(runtime=>runtime === undefined))
        return undefined;

    // Accumulates it
    return result.reduce((a,b)=>a+b, 0) * opts.repeats;
}
```

As you can see it can become a bit messy with procedures that have sub procedures. Howevery we could leverage that fact to make our calculation easier.

If you for example just have a module that plays an animation, it might just look like this:

```ts
evaluateRuntime(opts: LedConfig) : number | undefined {
    return opts.length;
}
```

Easy right?

Now for the next method:

### findAllAccessedLeds

This does as it says, it creates a set of all leds accessed using this procedure. It looks like this:

```ts
/**
 * @returns an set which holds all led indexes that are accessed at some part of the procedure.
 */
findAllAccessedLeds(opts: LoopProcedureOptions) : Set<number>;
```

Tho as this code is really a bit messy and you have already seen th general concept above, i'll reframe from repeating myself here.

Lets move on from the diagnostics to the led node, the heartpiece of simulating the animation:

# Step 4: Create led node

Because procedures shall be able to simulate what they are doing in the app itself, it means that you will have to write your procedures code twice. Once as code generation for your CodeConstructor and now in javascript again to simulate what that code is actually doing.

But because we are using javascript, we can leverage it's powerful features like async/await programming.

I say simulate because its not actually set in stone that your code will later be displayed on the webpage. It could also be used to for example directly send the signal to an led microcontroller and therefor preview the data directly on hardware.

The led node is like the elements in the previous steps a seperate class and this time responsible for simulating what the procedure does.

The interface to implement this time is `ILEDNode` and you want to pass it your config again too:

```ts

class LoopProcLEDNode implements ILEDNode<LoopProcedureOptions> {
    // ...
}
```

Tho this time you only need to implement a single functions:

### startNode

This is all there is, you can just write your simulated code here and that is it.

The general method looks like this:

```ts
async startNode(options: LoopProcedureOptions, ctrl: IVisualisationController): Promise<void> {
    // ...
}
```

As you can see it will return a promise (Meaning we can use await here). This is used to let delays work mostly like they work on realy hardware.

Now excluding your config you also have an `IVisualisationController` at your disposable.

This is used to send data to be displayed in the simulation.

It contains a few methods:

* `sleep(ms: number) : Promise<void>;`
This method is used to simulate a delay or sleep in milliseconds. Here is how it's called:

```ts
// ...

console.log("Message 1");
await ctrl.sleep(1000);
console.log("Message 2");

// ...
```

would print the first message, wait a second, and then print the second message.


* `millis() : number;`

Returns how many milliseconds have elapsed since the "virtual" microcontroller has been started.

* `setLed(idx: number, r: number, g: number, b: number): void;`

Used to set an led at the given `idx` (Start from 0) to a given RGB value. `r`, `g` and `b` are values between `0 - 255`

Note: The led wont be shown just yet. It must be pushed using the next method first. This is done so multiple rapid changes dont require multiple updates. If the index if below or above the maximum amount of led's registered, it likely wont be a big problem. However we can't make any promises.

Example usage:
```ts
// ...

for(let i=0;i<10;i++){
    let value = Math.round(i/10 * 0xff);

    ctrl.setLed(i, value,value,value);
}

// ...
```

This would cache the data for the led 0-9 by setting their value to a gray scale that increases from black to white from 0 - 9

* `pushLed() : void;`

This is the method that pushes the cached data to the strip.

# Step 5: Create Procedure

Now that you have assembled all prerequirements: a `Config` a `CodeConstructor`, `Diagonstics` and an `LEDNode` you can create yet another class. This one is for the Procedure and needs to implement `IProcedure`, again with your config:

```ts
class LoopProcedure implements IProcedure<LoopProcedureOptions> {
}
```

Here you will need to overwrite the following methods:

* 1. Simple supply methods
```ts
getLEDNode(): ILEDNode<LoopProcedureOptions>;

getCodeConstructor(): ICodeConstructor<LoopProcedureOptions, any>;

getDiagnostics(): IDiagnostics<LoopProcedureOptions>;
```

are simple supply only methods that require your `LEDNode`, `CodeConstructor` and the `Diagnostics`-Objects. Tho it is recommended to store them as private global variables in your class and not to recreate them on the fly. These are no cached methods:


```ts
private codeConstr = new LoopProcCodeConstructor();
private diagnostics = new LoopProcDiagnostics();
private ledNode = new LoopProcLEDNode();

getLEDNode(): ILEDNode<LoopProcedureOptions> {
    return this.ledNode;
}

getCodeConstructor(): ICodeConstructor<LoopProcedureOptions, any> {
    return this.codeConstr;
}

getDiagnostics(): IDiagnostics<LoopProcedureOptions> {
    return this.diagnostics;
}
```

should therefor suffice.

* 2. Finding subprocedures.

Because of the way how the software operates, it needs a way to formally find subprocedures in our procedure. This is required for our loop module to allow the procedures that we loop over to work properly:

```ts
findSubprocedures(opts: LoopProcedureOptions): ProcedureWithOptions<any>[] {
        return opts.sub;
}
```

Note: Even if our procedure doesn't have any subprocedures, it will still need to return an empty array in this method.

* 3. the name property

Further it is required to provide a `name` property for our procedure. This name property is used to uniquely identify this procedure, so procede with caution:

```ts
public readonly name = "noah_albers_loop";
```

For example you can add your full name before it.

* 4. Example config
Last but certenly not least the procedure needs an example config to initialize any new procedure instances:

```
getExampleConfig(): LoopProcedureOptions {
    return {
        repeats: 1,
        sub: []
    }   
}
```

# Step 6: Register Procedure

Now all that is left to do is to register your procedure.

Therefor go into `src/registry/registers/RegisterProcedures.ts` and add your procedure:

```ts
// Used to register all procedures
export function registerProcedures() {
    return {
        // ...

        loop: new LoopProcedure()

        // ...
    }
}
```

the name doesn't need to be the same as the one specified using the name property. But it will be used to call / referenc the procedure in code.


Not that that is done you have added your very own procedure and can now use it.

Now you may want to add a node model (Block) for the procedure. How that is done is explained in one of the later modules, but you may want to [skip](TODO) for to it.

TODO: Show how to use the simple procedure
TODO: Show how to use the simple function code constructor

TODO: Add references to simple function cc
TODO: Add references to simple procedure