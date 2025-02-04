const MiniBus = (() => {
            let state = {};
            const watchers = {};
            const permissions = {};

            return {
                init() {
                    document.querySelectorAll('[id]').forEach(element => {
                        [...element.attributes]
                            .filter(attr => attr.name.startsWith('data-'))
                            .forEach(attr => {
                                const stateKey = `${element.id}.${attr.name}`;
                                state[stateKey] = attr.value;
                            });
                    });
                    console.log('Initial State:', JSON.stringify(state, null, 2));
                },

                // Grant permission for a component to modify another component's state if it's within the hierarchy
                grantPermission(ownerId, stateKey) {
                    const ownerElement = document.getElementById(ownerId);
                    const [targetElementId] = stateKey.split('.');
                    const targetElement = document.getElementById(targetElementId);

                    if (this._isChildOf(targetElement, ownerElement)) {
                        if (!permissions[stateKey]) {
                            permissions[stateKey] = [];
                        }
                        permissions[stateKey].push(ownerId);
                    } else {
                        console.error(`Permission denied: ${ownerId} cannot modify ${stateKey} as it is not within its hierarchy.`);
                    }
                },

                // Request a state change - only permitted components can modify
                requestStateChange(ownerId, stateKey, newValue) {
                    if (permissions[stateKey]?.includes(ownerId) || stateKey.startsWith(ownerId)) {
                        const [elementId, attribute] = stateKey.split('.');
                        if (state[stateKey] !== newValue) {
                            state = { ...state, [stateKey]: newValue }; // Immutable state change
                            console.log('State Change:', stateKey, '->', newValue);
                            console.log('Updated State:', JSON.stringify(state, null, 2));
                            this._applyStateChange(elementId, attribute, newValue);
                            if (watchers[stateKey]) {
                                watchers[stateKey].forEach(callback => callback(newValue));
                            }
                        }
                    } else {
                        console.error(`Component ${ownerId} is not allowed to modify ${stateKey}`);
                    }
                },

                // Apply state change to the DOM
                _applyStateChange(elementId, attribute, newValue) {
                    const element = document.getElementById(elementId);
                    if (!element) return;

                    switch (attribute) {
                        case 'data-text':
                            element.textContent = newValue;
                            break;
                        case 'data-class':
                            element.className = '';
                            newValue.split(' ').forEach(cls => {
                                if (cls.trim()) element.classList.add(cls);
                            });
                            break;
                        default:
                            element.setAttribute(attribute, newValue);
                    }
                },

                // Watch for changes to a specific state key
                watch(stateKey, callback) {
                    if (!watchers[stateKey]) watchers[stateKey] = [];
                    watchers[stateKey].push(callback);
                },

                // Register event to modify state declaratively
                registerEvent(componentId, eventType, stateKeyToChange) {
                    const element = document.getElementById(componentId);
                    if (!element) {
                        console.error(`Element with ID "${componentId}" not found.`);
                        return;
                    }

                    element.addEventListener(eventType, () => {
                        const currentValue = state[stateKeyToChange] || 'false';
                        const newValue = currentValue === 'true' ? 'false' : 'true';
                        this.requestStateChange(componentId, stateKeyToChange, newValue);
                    });
                },

                // Utility function to check if an element is a descendant of another element
                _isChildOf(child, parent) {
                    let node = child;
                    while (node !== null) {
                        if (node === parent) return true;
                        node = node.parentNode;
                    }
                    return false;
                }
            };
        })();
