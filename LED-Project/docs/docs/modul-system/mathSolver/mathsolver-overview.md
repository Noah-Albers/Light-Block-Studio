# Math Solver Module

One requirement of the application is that it shall be able to calculate simple Math expressions.
Further its wanted that simple parameter based design is also supported.

So for example you should be able to define a varaible `TIME_SCALER` and use it as it fits you. Maybe in a block-time-field: `TIME_SCALER * 1000`.

That is where the Math solver comes into play. Its also a self contained module which exposes its functionality through `@mathSolveer/index.ts`.

But first lets see why we decided to write the module ourselfs and not use a preexisting library:

|Library|Reason on no to use|
|-|-|
|[Math.js](https://mathjs.org/)|Very big library for this simple functionality|
|[JavaScript Expression Evaluator](https://silentmatt.com/javascript-expression-evaluator/)|Unmaintained|
|[String Math](https://www.npmjs.com/package/string-math)|Uses RegEx to "parse" their expressions, also doesn't support variables.|

Here is an example what Math Solver can do:

The `index.ts` exposes the function:

```ts
function solveExpression(expr: string, variables: { [name: string]: number }): number;
```

which takes in a simple expression and some variables:

```ts
const variables: {[name: string]: number} = {
    "ledAmount": 10,
    "offset": 1
}

const expression: string = "ledAmount / 2 + offset";

try {
    const result: number = solveExpression(expression, variables);
}catch(err){
    // ...
    console.error(err);
}
```

As you can see it will also throw an error if the given expression is not well formated (Invalid syntax) or contains variables that were not provided.

The result of the above should be `6`.

Further it also exposes another method:
```ts
function isValidVariableName(name: string): "firstChar" | "invalid" | true;
```

which can be used to test if a given string is a valid variable name.
A valid variable name looks like this (In regex syntax):
```
[a-zA-Z][0-9a-zA-Z]*
```

so it requires to:
- have at least one character.
- start with an alphabetical character
- have every other character be either an alphabetical character or a digit
