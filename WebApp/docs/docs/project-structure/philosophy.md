# Philosophy

## KISS as often as possible
Use the `Keep it simple, stupid` principle as often as possible. This prevents overengineered systems and ensures a generally easier-to-work-with environment. However, if needed, there are features that may require deviating from this principle.

## YIGNI as often as possible
Similar to `KISS`, this principle ensures that as little code as necessary makes it into the final product. Focusing on the essentials, although challenging at times, is generally beneficial.

## Separate concerns (Modular system)
Break down big problems into separate modules or libraries whenever possible. However, if a solution is not available as a separate package, it's acceptable to build it yourself. Ensure that these modules are separated from the main application's code. The application itself should be divided into small, independent islands that support one main application. This approach keeps external modules clean and independent, making them easier to refine and extend.
Further guidelines:
- Minimize communication between modules.
- Use an `index.ts` file to export module functionality whenever possible.

This will be touched on more later.

## Use definitions whenever possible
Whenever feasible, define everything before implementing it. Even if there will always be only one class or instance, define it as a TypeScript `interface` in a `.d.ts` file first.

## Finish implementing things before moving on
Complete tasks before moving on to the next one. While seemingly obvious, this principle is often overlooked and has caused issues in previous projects. Documenting it here serves as a reminder.
