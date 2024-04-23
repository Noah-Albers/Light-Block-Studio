# FunctionManager Module

The FunctionManager module is responsible for generating C++ functions with different numbers of arguments based on how often and with what arguments they are called.

## Example

Consider the following C++ function:

```cpp
void simpleAnimation(int ledAmount, int durationSeconds){
    
    for(int i=0; i<ledAmount; i++)
        setLed(i, ON);

    sleep(durationSeconds);

    for(int i=0; i<ledAmount; i++)
        setLed(i, OFF);

}
```

If the function is called with different arguments:

```cpp
simpleAnimation(5, 2);
simpleAnimation(2, 10);
```

the function would be generated as shown above.

However, if the calls are as follows:

```cpp
simpleAnimation(1,1);
simpleAnimation(1,2);
```

the function could be generated like this:

```cpp
void simpleAnimation(int durationSeconds){
    
    for(int i=0; i<1; i++)
        setLed(i, ON);

    sleep(durationSeconds);

    for(int i=0; i<1; i++)
        setLed(i, OFF);

}
```

resulting in simplified calls:

```cpp
simpleAnimation(1);
simpleAnimation(2);
```

This is the functionality provided by the FunctionManager for the C++ generator.

Lets take a look on how to use the function manager in the next section.