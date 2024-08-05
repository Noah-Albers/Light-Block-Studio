The Visualizer ist the Module which takes care of animating / simulating given procedures.

It exposes (besides the definitions) the `Visualizer` class (Which inherits `IVisualizer`) through `@visualizer/index.ts`.

This class takes care of starting and aborting an animation / simulation.

But why is neither animation or simulation the correct term?
Because the visualizer doesn't care what you do with the led data. It is fine with displaying it on a webpage or sending it via for example webusb to a live device (Which might be planned for later).

So how does it work?

# Using the Visualizer

Start by creating a callback function:
```ts
function onData(leds: LEDArray) : void {
    // ...
}
```

this function must be of the following type:

```ts
// Type of your function
type LEDPushCallback = (leds: LEDArray)=>void;

// For reference
type LEDArray = {
    // Index: R,G,B value
    [ledIndex: number]: [number,number,number]
};
```

When the animation / simulation of a procedure calls the `pushUpdate` function, the currently set leds are passed as an object to this function.
It holds the index of the led as a key value (Also only numbers) and the r,g,b values as an array with three elements.
Further this means that this object doesn't need to be filled with every led and neither needs to only have updated leds.

For example it is fully reasonable to assume that the following two data object could be given after each other:

```ts

// First one
const data1: LedArray = {
    0: [100,0,0],
    4: [200,0,0],
    5: [200,0,0],
}

// Second one (After a little time for example)
const data1: LedArray = {
    0: [100,0,0],
    3: [100,0,0],
    4: [100,0,0],
    5: [200,0,0],
}
```

As you can see neither of the examples is complete or has only updated leds. Please be aware of that.

But with this example you can also see why the term simulation and animation are both not nessesarily correct.

But how to you actually use it?

## Creating the visualizer

Just create a visualizer like this:

```ts
const vis: IVisualizer = new Visualizer(onData);
```

and pass you callback function.

Note that `vis` is explicitly made from the type `IVisualizer`. This way intellisense hides some internal data from you (Which is also marked as such but oh well).

Now you can just go ahead and start the visualizer using the function:

```ts
startVisualizer(setup: ProcedureWithOptions<any>[], loop: ProcedureWithOptions<any>[], abort: AbortSignal): Promise<void>;
```

and by providing the following three things:

- `setup` procedures with their configs/options to run once
- `loop` procedures with their configs/options to run continuesly
- `abort` signal which is used to tell the visualizer to abort and finish it's visualisation

If you dont know how `AbortSignal`'s work, here is a [link](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) to the Mozilla web docs for the AbortSignal. Further you might also want to read about the [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) too.

Anyway here is how you use it:

```ts
const vis: Visualizer = //...

const setup: ProcedureWithOptions<any>[] = //...
const loop: ProcedureWithOptions<any>[] = //...

const Aborter = new AbortController();

// Now just start the visualizer
const waitForVisualizerToStop = vis.startVisualizer(setup, loop, Aborter.signal);
```

As you can see the method returned a `Promise`. This one will only resolve and never reject. But it will only resolve when the visualizer has been aborted (Told to stop as the loop animation will otherwise play continuesly).

So to do that you'll use the method:

```ts
abortVisualizer() : Promise<void>;
```

which again returns the same `Promise` that will resolve once the animation is finished.

so lets abort our visualizer after about ten seconds:

*Assuming that await is possible within the current context:*

```ts
//...

// Wait some time
await sleep(10 * 1000);

// Await the abort of the visualizer
await vis.abortVisualizer();

console.log("Im done visualizing, yay");
```

so now you can just restart the visualizer if you want to.

So now that you know how to use the `Visualizer`, lets move on: