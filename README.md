# 🚌MiniBus - Easy State Management

## Overview
MiniBus is a lightweight JavaScript state management system designed to handle state changes and event communications between components in a declarative and controlled manner. It is useful for projects that require clear ownership and control over which components can modify the state of other components.

## Features
- **Hierarchical Scoped Ownership**: Only components that have explicit permissions can modify the state of other components.
- **Immutable State Management**: State changes are immutable to ensure that the state remains predictable and easy to debug.
- **Declarative Event Handling**: Components can register events declaratively and react to state changes.

## Setup and Integration
1. **Include MiniBus.js in Your HTML File**:
   ```html
   <script src="./minibus.js"></script>
   ```
2. **Initialize MiniBus**:
   Make sure to call `MiniBus.init()` after your DOM is fully loaded:
   ```html
   <script>
       document.addEventListener('DOMContentLoaded', () => {
           MiniBus.init();
       });
   </script>
   ```

## Adding a Component
To add a new component, simply create a new DOM element with an ID and any `data-*` attributes that you want to manage via MiniBus. These attributes will represent the component's state and can be dynamically modified or watched for changes.

### Example:
```html
<div id="myComponent" data-myState="false">
    <button id="myButton" class="btn btn-primary" data-text="Click Me">Click Me</button>
    <script>
        // Register events, watch state changes, and grant permissions using MiniBus
        MiniBus.registerEvent('myButton', 'click', 'myComponent.data-myState');
        MiniBus.grantPermission('myButton', 'myComponent.data-myState');
        MiniBus.watch('myComponent.data-myState', (newValue) => {
            console.log('State changed:', newValue);
        });
    </script>
</div>
```
- **ID**: This uniquely identifies the component.
- **data-* Attributes**: These represent the state properties to be managed by MiniBus. In the example, `data-myState` is the state that will be tracked.

## Setting up MiniBus for Components
Once you have added your component, you can register events, grant permissions, and watch state changes using MiniBus.

### 1. Initialization
You need to initialize MiniBus after the DOM is loaded to detect all components and their state attributes.

```html
<script>
    document.addEventListener('DOMContentLoaded', () => {
        MiniBus.init();
    });
</script>
```

### 2. Registering Events
Use `MiniBus.registerEvent()` to register an event for a component. This allows you to modify the state based on user interaction.

```js
MiniBus.registerEvent('myButton', 'click', 'myComponent.data-myState');
```
- **`myButton`**: The component that triggers the event.
- **`click`**: The event type (e.g., `click`, `change`).
- **`myComponent.data-myState`**: The state to modify.

### 3. Granting Permissions
If a component needs to modify the state of another component, you must grant explicit permission using `MiniBus.grantPermission()`.

```js
MiniBus.grantPermission('myButton', 'myComponent.data-myState');
```
- **`myButton`**: The component that is allowed to modify the state.
- **`myComponent.data-myState`**: The state key that can be modified.

### 4. Watching State Changes
Use `MiniBus.watch()` to listen for state changes and trigger callbacks in response.

```js
MiniBus.watch('myComponent.data-myState', (value) => {
    console.log('State changed:', value);
});
```
- **`myComponent.data-myState`**: The state to watch.
- **Callback Function**: This is triggered when the state changes.

## Full Example Code
The following HTML demonstrates using MiniBus to toggle a sidebar when a button is clicked.

### Sidebar and Button Component
```html
    <!-- Sidebar Component -->
    <div id="sidebarComponent" class="w-64 p-4 mt-6 bg-base-200 hidden" data-class="hidden">
        <p>Sidebar Content</p>
        <script>
            // Corrected usage of watch
            MiniBus.watch('buttonComponent.data-click', (value) => {
                MiniBus.requestStateChange('sidebarComponent', 'sidebarComponent.data-class', value === 'true' ? '' : 'hidden');
            });
        </script>
    </div>

    <!-- Button Component -->
    <div id="buttonComponent" data-click="false">
        <button id="toggleButton" class="btn btn-primary" data-text="Toggle Sidebar">Toggle Sidebar</button>
        <script>
            // Register the button click event via MiniBus
            MiniBus.registerEvent('buttonComponent', 'click', 'buttonComponent.data-click');

            // Grant permission for buttonComponent to modify the button text (only allowed if within hierarchy)
            MiniBus.grantPermission('buttonComponent', 'toggleButton.data-text');

            // Corrected usage of watch
            MiniBus.watch('buttonComponent.data-click', (value) => {
                MiniBus.requestStateChange('buttonComponent', 'toggleButton.data-text', value === 'true' ? 'Hide Sidebar' : 'Show Sidebar');
            });
        </script>
    </div>
```
In this example:
- Clicking `toggleButton` changes the state of `buttonComponent.data-click`.
- The sidebar's visibility (`sidebarComponent.data-visible`) and the button text (`toggleButton.data-text`) are updated based on the button's state.

## Conclusion
MiniBus.js provides a simple and controlled way to manage state and event-driven behavior in your application. By ensuring that only permitted components can modify the state of others, it helps maintain a clear and predictable flow of data throughout your application.

