/*
==========================================
Strawberry JS (Beta Version 0.9.6)
MIT License
Copyright (c) 2022 Kenjie Terrado

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Special Credits to the amazing authors of DomReady libarary!
==========================================
*/

(() => {
    function _e3(componentObject, appInstance) {
        return appInstance._x25();
    }



    function _a140(componentObject, appInstance, blockName, callback) {
        const blockAttrNameAndValue = _x115._e72(_x60, appInstance, blockName);
        const componentElement = _x115._x116(_x88(appInstance), appInstance, componentObject._e108());
        const allB_x155s = componentElement.querySelectorAll(`[${blockAttrNameAndValue}]`);
        for (let i = 0; i < allB_x155s.length; i++) {
            const element = allB_x155s[i];
            const strawberryElement = new StrawberryElement(element);
            callback(strawberryElement);
        }
    }

    function _a12(componentObject, appInstance) {
        return {
            get: (childName) => {
                if (childName.charAt(0) !== '@')
                    childName = '@' + childName;
                let childComponentObject = null;
                const childIds = componentObject._e152();
                for (let i = 0; i < childIds.length; i++) {
                    const childId = childIds[i];
                    const childComponent = appInstance._x126().component._a26()[childId];
                    if (childComponent._a84() === childName) {
                        childComponentObject = childComponent;
                        break;
                    }
                }
                if (childComponentObject === null)
                    return null;
                return childComponentObject._e156();
            }
        };
    }


    function _x14(componentObject, appInstance, elementName, state) {
        try {
            const elementState = componentObject._a32(elementName);
            if (elementState === null) {
                throw new Error('Unregistered componenet member named "' + elementName + '"');
            }
            if (elementState === state)
                return;
            const allDisabledElements = _x1(_x115._e72(_x38, appInstance, elementName), componentObject, appInstance);
            const allElements = Array.from(allDisabledElements);
            const allEnabledElements = _x1(_x115._e72(_x47, appInstance, elementName), componentObject, appInstance);
            allEnabledElements.forEach(allEnabledElement => {
                allElements.push(allEnabledElement);
            });
            for (let i = 0; i < allElements.length; i++) {
                const element = allElements[i];
                element.disabled = (state === 'disabled');
            }
            componentObject._x33(elementName, state);
        } catch (error) {
            console.error(`strawberry.js: [DisablerService] ` + error.message);
        }
    }

    function _x131(componentObject, appInstance, elementName) {
        try {
            _x14(componentObject, appInstance, elementName, 'disabled');
        } catch (error) {
            console.error(`strawberry.js: [EnablerService] ` + error.message);
        }
    }

    function _x141(componentObject, appInstance, elementName) {
        try {
            _x14(componentObject, appInstance, elementName, 'enabled');
        } catch (error) {
            console.error(`strawberry.js: [EnablerService] ` + error.message);
        }
    }

    function _a24(componentObject, appInstance) {
        class ParentReferenceTree {
            constructor(id) {
                this.id = id;
                const grandParentId = id.substring(0, (id.length - 2));
                const registry = appInstance._x126().component._a26();
                if (!registry.hasOwnProperty(grandParentId))
                    this.$parent = null;
                if (grandParentId !== '0')
                    this.$parent = new ParentReferenceTree(grandParentId);
            }
            get() {
                return registry[parentId]._e156();
            }
        }
        const parentId = componentObject._e108().substring(0, componentObject._e108().length - 2);
        const registry = appInstance._x126().component._a26();
        if (!registry.hasOwnProperty(parentId)) {
            return null;
        }
        return new ParentReferenceTree(parentId);
    }



    function _e4(elementToBindTo, componentObject, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                const elementBindFrom = _e22();
                elementBindFrom.innerHTML = componentObject._a103();
                await _x149(elementBindFrom, componentObject, appInstance);
                const childComponentIds = componentObject._e152();
                for (let i = 0; i < childComponentIds.length; i++) {
                    const childComponentId = childComponentIds[i];
                    const childComponent = _x115._x116(elementBindFrom, appInstance, childComponentId);
                    if (childComponent !== null) {
                        await _e4(childComponent, appInstance._x126().component._a26()[childComponentId], appInstance);
                    }
                }
                _e99(elementBindFrom, elementToBindTo, appInstance, componentObject._e152());
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }

    function _x73(componentObject, appInstance, blockName) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!appInstance._x162()) {
                    throw new Error(`Invalid invoking of service when boot is not complete`);
                }
                let mode = 'component';
                let elementsToPatch = [_x115._x116(_x88(appInstance), appInstance, componentObject._e108())];
                if (blockName !== undefined && blockName !== null) {
                    mode = 'block';
                    elementsToPatch = Array.from(_x1(_x115._e72(_x60, appInstance, blockName), componentObject, appInstance));
                }
                if (elementsToPatch.length === 0 || elementsToPatch[0] === null) {
                    if (!appInstance._x136())
                        return resolve(null);
                    throw new Error(`Unable to select element to patch`);
                }
                for (let i = 0; i < elementsToPatch.length; i++) {
                    const elementBindTo = elementsToPatch[i];
                    let elementBindFrom = _e22();
                    if (mode === 'component') {
                        const template = componentObject._a103();
                        elementBindFrom.innerHTML = template;
                    } else {
                        const template = componentObject._x10(blockName);
                        elementBindFrom.innerHTML = template;
                    }
                    await _x149(elementBindFrom, componentObject, appInstance);
                    _e99(elementBindFrom, elementBindTo, appInstance, componentObject._e152());
                    /**
                     * Find all unrendered child component. This happens usually because of
                     * conditional statements such xif
                     */
                    const childComponentIds = componentObject._e152();
                    for (let k = 0; k < childComponentIds.length; k++) {
                        const childComponentId = childComponentIds[k];
                        const childComponent = _x115._x116(elementBindTo, appInstance, childComponentId);
                        if (childComponent === null)
                            continue;
                        if (childComponent.innerHTML.trim() === '') {
                            await _e4(childComponent, appInstance._x126().component._a26()[childComponentId], appInstance);
                        }
                    }
                }
                resolve(null);
            } catch (error) {
                console.error(`strawberry.js: [PatchService] ` + error.message);
            }
        });
    }
    const _a37 = 'strawberry';
    const _e128 = 'service_object';
    const _a129 = 'factory_object';
    const _a94 = 'component_object';
    const _e19 = 'component';
    const _e46 = 'repeat';
    const _e109 = 'if';
    const _a85 = 'hide';
    const _a86 = 'show';
    const _x57 = 'check';
    const _a58 = 'style';
    const _e59 = 'model';
    const _x38 = 'disable';
    const _x47 = 'enable';
    const _x95 = 'click';
    const _x87 = 'change';
    const _a96 = 'touch';
    const _x60 = 'block';
    const _x61 = '$scope';
    const _a62 = '$block';
    const _x48 = '$enable';
    const _a39 = '$disable';
    const _e49 = '$parent';
    const _e30 = '$children';
    const _x63 = '$patch';
    const _e97 = '$app';
    const _a64 = 'id';
    const _e20 = '$$index';
    const _e98 = 'set';
    const _a65 = '@';
    const _x66 = 'event';
    class _x115 {
        /**
         * Creates a component attribute with value. Example: `xcomponent="@ComponentName"`
         */
        static _x71(name, appInstance) {
            return appInstance._e145().prefix + _e19 + '="@' + name + '"';
        }
        /**
         * Creates an attribute with any key. Example: `xsomekeyhere`
         */
        static _x164(attributeName, appInstance) {
            return appInstance._e145().prefix + attributeName;
        }
        /**
         * Creates an attribute with any key, with any value. Example: `xsomekeyhere="value"`
         */
        static _e72(attributeName, appInstance, value) {
            return appInstance._e145().prefix + attributeName + '="' + value + '"';
        }
        static _e50(element, prefix, attributeName) {
            const resolvedAttrName = prefix + attributeName;
            return element.getAttribute(resolvedAttrName);
        }
        static _x116(element, appInstance, xid) {
            const resolvedXidAttr = appInstance._e145().prefix + _a64 + '="' + xid + '"';
            return element.querySelector(`[${resolvedXidAttr}]`);
        }
        static _a23(element, appInstance, attributeName) {
            const resolvedAttrName = this._x164(attributeName, appInstance);
            return element.querySelectorAll(`[${resolvedAttrName}]`);
        }
        static _e2(element, appInstance, componentObject, childComponentName) {
            if (!childComponentName.includes('@'))
                childComponentName = '@' + childComponentName;
            const resultXids = [];
            // Making sure we are only getting direct siblings
            const childIds = componentObject._e152();
            for (let i = 0; i < childIds.length; i++) {
                const childId = childIds[i];
                const xidAttr = this._e72(_a64, appInstance, childId);
                const xidElement = element.querySelector(`[${xidAttr}]`);
                const componentName = xidElement.getAttribute(appInstance._e145().prefix + _e19);
                if (componentName === childComponentName) {
                    resultXids.push(childId);
                }
            }
            return resultXids;
        }
    }


    function _a147(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allB_x155s = _x115._a23(targetElement, appInstance, _x60);
                for (let i = 0; i < allB_x155s.length; i++) {
                    const element = allB_x155s[i];
                    const blockElName = _x115._e50(element, appInstance._e145().prefix, _x60);
                    /** Retrieving and registering the template */
                    const componentTemplate = componentObject._a103();
                    const tempCompEl = _e22();
                    tempCompEl.innerHTML = componentTemplate;
                    const selector = _x115._e72(_x60, appInstance, blockElName);
                    const tempBlockEl = tempCompEl.querySelector(`[${selector}]`);
                    if (null === componentObject._a32(blockElName)) {
                        componentObject._a31(blockElName, 'registered', tempBlockEl.innerHTML);
                    }
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }




    /**
     * Retrieves all the App Element and the App Template Element
     * from the DOM. This function will throw an error when either
     * of the two does not exist.
     */
    function _e110(appInstance) {
        try {
            const selector = _x115._e72(_a37, appInstance, appInstance._x161());
            const domInstances = document.querySelectorAll(`[${selector}]`);
            if (domInstances.length === 0) {
                throw new Error(`strawberry.js: [BootError] Unable to find element ${selector}.`);
            }
            if (domInstances.length > 2) {
                throw new Error(`strawberry.js: [BootError] There are appears to be multiple instances of element ${selector}.`);
            }
            let appTargetElement;
            let appTemplateElement;
            for (let i = 0; i < domInstances.length; i++) {
                const domInstance = domInstances[i];
                if (domInstance.tagName === 'TEMPLATE') {
                    appTemplateElement = domInstance;
                    continue;
                }
                appTargetElement = domInstance;
            }
            return [appTargetElement, appTemplateElement];
        } catch (error) {
            console.error(error);
        }
    }
    /**
     *
     */
    function _a21(componentId, component, appInstance, componentTree) {
        return new Promise(async (resolve, reject) => {
            try {
                let compiledComponentHtml = '';
                // First, we'll check if component has declared template
                const componentName = _x115._e50(component, appInstance._e145().prefix, _e19);
                const componentAttribute = _x115._e72(_e19, appInstance, componentName);
                const componentSelector = `template[${componentAttribute}]`;
                const componentTemplateElements = document.querySelectorAll(componentSelector);
                if (componentTemplateElements.length === 0) {
                    throw new Error(`strawberry.js: [BootError] Unable to find Component template ${componentSelector}.`);
                }
                if (componentTemplateElements.length > 1) {
                    throw new Error(`strawberry.js: [BootError] There are appears to be multiple instances of Component template ${componentSelector}.`);
                }
                /** Creating the Component Object */
                const componentObject = new _e45();
                const componentTemplateElement = componentTemplateElements[0];
                const componentImplementation = document.implementation.createHTMLDocument();
                componentImplementation.body.innerHTML = componentTemplateElement.innerHTML;
                componentObject._a107(componentId)._x83(componentName);
                /** Registering the Component in the Library */
                appInstance._x135().component._e5(componentName, componentTemplateElement.innerHTML);
                /** Registering the Component Object */
                appInstance._x126().component._x53({
                    key: componentId,
                    component: componentObject
                });
                /** Retrieving and processing of child components **/
                const selector = _x115._x164(_e19, appInstance);
                const childComponents = componentImplementation.querySelectorAll(`[${selector}]`);
                for (let i = 0; i < childComponents.length; i++) {
                    const childComponent = childComponents[i];
                    const childComponentName = _x115._e50(childComponent, appInstance._e145().prefix, _e19);
                    const childComponentId = _x89(componentId, i.toString());
                    childComponent.setAttribute('xid', childComponentId);
                    componentObject._x137(childComponentName);
                    componentObject._a154(childComponentId);
                    if (componentTree.includes(childComponentName)) {
                        throw new Error(`strawberry.js: [BootError] Circular dependency in component "${childComponentName}" detected: ${JSON.stringify(componentTree)}`);
                    }
                    const childComponentTree = [childComponentName, ...componentTree];
                    childComponent.innerHTML = await _a21(childComponentId, childComponent, appInstance, childComponentTree);
                }
                compiledComponentHtml += componentImplementation.body.innerHTML;
                componentObject._a102(compiledComponentHtml);
                resolve(compiledComponentHtml);
            } catch (error) {
                reject(error);
            }
        });
    }

    function _a67(handler, type, name) {
        return new Promise((resolve, reject) => {
            try {
                const handlerStr = handler.toString().split('{')[0];
                const matchedFn = handlerStr.match(/(?<=\().+?(?=\))/g);
                if (matchedFn === null || /[(={})]/g.test(matchedFn[0])) {
                    resolve([]);
                }
                resolve(matchedFn[0].split(','));
            } catch (error) {
                reject(error);
            }
        });
    }

    function _a68(name, appInstance) {
        /** Check if it is a Service */
        let serviceOb = appInstance._x135().service._e77(name);
        if (serviceOb !== null)
            return 'service';
        let factorHanlder = appInstance._x135().factory._a74(name);
        if (factorHanlder !== null)
            return 'factory';
        return null;
    }

    function _x69(factoryName, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                const factoryHandler = appInstance._x135().factory._a74(factoryName);
                if (factoryHandler === null) {
                    throw new Error(`strawberry.js: [BootError] Unregistered factory callback ${factoryName}.`);
                }
                const args = await _a67(factoryHandler, 'service', factoryName);
                const injectableArguments = [];
                for (let i = 0; i < args.length; i++) {
                    const arg = args[i];
                    if (_a68(arg, appInstance) === 'service') {
                        const depService = await _a70(arg, appInstance);
                        injectableArguments.push(depService);
                        continue;
                    }
                    if (_a68(arg, appInstance) === 'factory') {
                        const depFactory = await _x69(arg, appInstance);
                        injectableArguments.push(depFactory);
                        continue;
                    }
                    injectableArguments.push(null);
                }
                const handleInstance = factoryHandler(...injectableArguments);
                if (typeof handleInstance === 'function' && handleInstance.prototype && handleInstance.prototype.constructor === handleInstance) {
                    resolve(handleInstance);
                    return;
                } else {
                    throw new Error(`strawberry.js: [BootError] Factory ${factoryName} must return typeof class reference.`);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    function _a70(serviceName, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                let handleOb = appInstance._x126().service._a159(serviceName);
                if (handleOb !== null) {
                    resolve(handleOb);
                    return;
                }
                const serviceLib = appInstance._x135().service._e77(serviceName);
                if (serviceLib === null) {
                    throw new Error(`strawberry.js: [BootError] Unregistered service callback ${serviceName}.`);
                }
                const serviceHandler = serviceLib._e121;
                const args = await _a67(serviceHandler, 'service', serviceName);
                handleOb = {};
                const injectableArguments = [];
                for (let i = 0; i < args.length; i++) {
                    const arg = args[i];
                    if (_a68(arg, appInstance) === 'service') {
                        const depService = await _a70(arg, appInstance);
                        injectableArguments.push(depService);
                        continue;
                    }
                    if (_a68(arg, appInstance) === 'factory') {
                        const depFactory = await _x69(arg, appInstance);
                        injectableArguments.push(depFactory);
                        continue;
                    }
                    injectableArguments.push(null);
                }
                handleOb = serviceHandler(...injectableArguments);
                appInstance._x126().service._e104(serviceName, handleOb);
                resolve(handleOb);
            } catch (error) {
                reject(error);
            }
        });
    }
    /** This is where callback functions to components are being executed */
    function _x40(componentObject, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                if (componentObject._e156() !== null) {
                    resolve(null);
                    return;
                }
                const componentName = componentObject._a84();
                const componentLibrary = appInstance._x135().component;
                const componentHandler = componentLibrary._x35(componentName);
                if (componentHandler === null) {
                    throw new Error(`strawberry.js: [BootError] Unregistered component callback ${componentName}.`);
                }
                const allArguments = await _a67(componentHandler, 'component', componentName);
                const scopeObject = {};
                const allChildComponentNames = componentObject._e132().map(childName => childName.substring(1, childName.length));
                const injectableArguments = [];
                for (let i = 0; i < allArguments.length; i++) {
                    const argument = allArguments[i];
                    if (argument === _x61) {
                        injectableArguments.push(scopeObject);
                        componentObject._x117(scopeObject);
                        continue;
                    }
                    if (argument.charAt(0) === '$') {
                        switch (argument) {
                            case _a62:
                                injectableArguments.push((blockName, callback) => {
                                    return _a140(componentObject, appInstance, blockName, callback);
                                });
                                break;
                            case _x48:
                                injectableArguments.push((elementName) => {
                                    return _x141(componentObject, appInstance, elementName);
                                });
                                break;
                            case _a39:
                                injectableArguments.push((elementName) => {
                                    return _x131(componentObject, appInstance, elementName);
                                });
                                break;
                            case _x63:
                                injectableArguments.push((elementName) => {
                                    return _x73(componentObject, appInstance, elementName !== null && elementName !== void 0 ? elementName : null);
                                });
                                break;
                            case _e49:
                                injectableArguments.push(_a24(componentObject, appInstance));
                                break;
                            case _e97:
                                injectableArguments.push(_e3(componentObject, appInstance));
                                break;
                            case _e30:
                                injectableArguments.push(_a12(componentObject, appInstance));
                                break;
                            default:
                                break;
                        }
                        continue;
                    }
                    /** Service injection */
                    const service = appInstance._x135().service._e77(argument);
                    if (service !== null) {
                        injectableArguments.push(await _a70(argument, appInstance));
                        continue;
                    }
                    /** Factory injection */
                    const factory = appInstance._x135().factory._a74(argument);
                    if (factory !== null) {
                        injectableArguments.push(await _x69(argument, appInstance));
                        continue;
                    }
                    /** Component Injection */
                    if (!allChildComponentNames.includes(argument)) {
                        throw new Error(`strawberry.js: [BootError] @${argument} is not a child component of ${componentName}`);
                    }
                    /** Get all children with that child component names */
                    const componentElementImplementation = _x115._x116(appInstance._e125(), appInstance, componentObject._e108());
                    const childXids = _x115._e2(componentElementImplementation, appInstance, componentObject, argument);
                    const wrapper = {};
                    for (let n = 0; n < childXids.length; n++) {
                        const childXid = childXids[n];
                        const childComponentObject = appInstance._x126().component._a26()[childXid];
                        await _x40(childComponentObject, appInstance);
                        wrapper[childXid] = childComponentObject;
                    }
                    const componentProxy = new Proxy(wrapper, {
                        get: function get(target, name) {
                            return function wrapper() {
                                const args = Array.prototype.slice.call(arguments);
                                const returns = [];
                                for (const xid in target) {
                                    const componentInstance = target[xid];
                                    const handler = componentInstance._e156();
                                    if (typeof handler === 'string' ||
                                        typeof handler === 'number' ||
                                        typeof handler === 'boolean') {
                                        returns.push(handler);
                                        continue;
                                    }
                                    if (typeof handler === 'object') {
                                        if (handler.hasOwnProperty(name)) {
                                            const handlerInstance = handler[name];
                                            if (handlerInstance instanceof Function) {
                                                returns.push(handlerInstance(...args));
                                            } else {
                                                returns.push(handlerInstance);
                                            }
                                            continue;
                                        } else {
                                            console.warn(`strawberry.js [ComponentError] Calling undefined member property or method "${name.toString()}" from component "${componentInstance._a84()}"`);
                                        }
                                    }
                                }
                                return returns[0];
                            };
                        }
                    });
                    // Proxy of the component object to be injected
                    injectableArguments.push(componentProxy);
                }
                const handler = componentHandler(...injectableArguments);
                componentObject._x157(handler);
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }



    function _x138(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allCheckedElements = _x115._a23(targetElement, appInstance, _x57);
                for (let i = 0; i < allCheckedElements.length; i++) {
                    const element = allCheckedElements[i];
                    if (_e113(element, appInstance))
                        continue;
                    const argument = _x115._e50(element, appInstance._e145().prefix, _x57);
                    const evalauted = new Resolver()._a75(componentObject._e118(), argument);
                    if (typeof evalauted === 'boolean') {
                        evalauted ? element.setAttribute('checked', '') : element.removeAttribute('checked');
                    }
                    _x155(element, appInstance);
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }

    function _a111(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allDisabledElements = _x115._a23(targetElement, appInstance, _x38);
                for (let i = 0; i < allDisabledElements.length; i++) {
                    const element = allDisabledElements[i];
                    const elementName = _x115._e50(element, appInstance._e145().prefix, _x38);
                    if (null === componentObject._a32(elementName)) {
                        componentObject._a31(elementName, 'disabled', '');
                    }
                    element.disabled = (componentObject._a32(elementName) === 'disabled');
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }
    // Everything that has to do with properly supporting our document ready event. Brought over from the most awesome jQuery.
    const userAgent = navigator.userAgent.toLowerCase();
    // Figure out what browser is being used
    const browser = {
        version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
        safari: /webkit/.test(userAgent),
        opera: /opera/.test(userAgent),
        msie: (/msie/.test(userAgent)) && (!/opera/.test(userAgent)),
        mozilla: (/mozilla/.test(userAgent)) && (!/(compatible|webkit)/.test(userAgent))
    };
    let readyBound = false;
    let isReady = false;
    let readyList = [];
    // Handle when the DOM is ready
    function domReady() {
        // Make sure that the DOM is not already loaded
        if (!isReady) {
            // Remember that the DOM is ready
            isReady = true;
            if (readyList) {
                for (var fn = 0; fn < readyList.length; fn++) {
                    readyList[fn].call(window, []);
                }
                readyList = [];
            }
        }
    };
    // From Simon Willison. A safe way to fire onload w/o screwing up everyone else.
    function addLoadEvent(func) {
        var oldonload = window.onload;
        if (typeof window.onload != 'function') {
            window.onload = func;
        } else {
            window.onload = function() {
                // @ts-ignore
                if (oldonload)
                    oldonload();
                func();
            };
        }
    };
    // does the heavy work of working through the browsers idiosyncracies (let's call them that) to hook onload.
    function bindReady() {
        if (readyBound) {
            return;
        }
        readyBound = true;
        // Mozilla, Opera (see further below for it) and webkit nightlies currently support this event
        if (document.addEventListener && !browser.opera) {
            // Use the handy event callback
            document.addEventListener("DOMContentLoaded", domReady, false);
        }
        // If IE is used and is not in a frame
        // Continually check to see if the document is ready
        if (browser.msie && window == top)
            (function() {
                if (isReady)
                    return;
                try {
                    // If IE is used, use the trick by Diego Perini
                    // http://javascript.nwbox.com/IEContentLoaded/
                    // @ts-ignore
                    document.documentElement.doScroll("left");
                } catch (error) {
                    setTimeout(arguments.callee, 0);
                    return;
                }
                // and execute any waiting functions
                domReady();
            })();
        if (browser.opera) {
            document.addEventListener("DOMContentLoaded", function() {
                if (isReady)
                    return;
                for (var i = 0; i < document.styleSheets.length; i++)
                    if (document.styleSheets[i].disabled) {
                        setTimeout(arguments.callee, 0);
                        return;
                    }
                // and execute any waiting functions
                domReady();
            }, false);
        }
        if (browser.safari) {
            var numStyles;
            (function() {
                if (isReady)
                    return;
                // @ts-ignore
                if (document.readyState != "loaded" && document.readyState != "complete") {
                    setTimeout(arguments.callee, 0);
                    return;
                }
                if (numStyles === undefined) {
                    var links = document.getElementsByTagName("link");
                    for (var i = 0; i < links.length; i++) {
                        if (links[i].getAttribute('rel') == 'stylesheet') {
                            numStyles++;
                        }
                    }
                    var styles = document.getElementsByTagName("style");
                    numStyles += styles.length;
                }
                if (document.styleSheets.length != numStyles) {
                    setTimeout(arguments.callee, 0);
                    return;
                }
                // and execute any waiting functions
                domReady();
            })();
        }
        // A fallback to window.onload, that will always work
        addLoadEvent(domReady);
    };
    // This is the public function that people can use to hook up ready.
    const DOMHelper = {
        ready: function(callback) {
            // Attach the listeners
            bindReady();
            // If the DOM is already ready, then execute the function immediately
            if (isReady)
                return callback.call(window, []);
            // Otherwis, add  the function to the wait list
            readyList.push(function() {
                return callback.call(window, []);
            });
        }
    };
    bindReady();

    function _x41(component, childComponentIds, appInstance) {
        for (let i = 0; i < childComponentIds.length; i++) {
            const childComponentId = childComponentIds[i];
            _x115._x116(component, appInstance, childComponentId).innerHTML = '';
        }
    }

    function _e22() {
        return document.implementation.createHTMLDocument().body;
    }

    function _e112(bindFrom, bindTo) {
        if (bindFrom === null)
            return;
        while (bindFrom.childNodes.length > 0) {
            bindTo.appendChild(bindFrom.childNodes[0]);
        }
    }

    function _e99(bindFromEl, bindToEl, appInstance, childComponentIds) {
        const temporaryChildren = {};
        for (let i = 0; i < childComponentIds.length; i++) {
            const childComponentId = childComponentIds[i];
            const childTemporaryElement = _e22();
            const childActualComponent = _x115._x116(bindToEl, appInstance, childComponentId);
            if (childActualComponent !== null) {
                _e112(childActualComponent, childTemporaryElement);
                temporaryChildren[childComponentId] = childTemporaryElement;
            }
        }
        bindToEl.innerHTML = '';
        _e112(bindFromEl, bindToEl);
        for (const childComponentId in temporaryChildren) {
            const childActualComponent = _x115._x116(bindToEl, appInstance, childComponentId);
            if (childActualComponent === null)
                continue;
            _e112(temporaryChildren[childComponentId], childActualComponent);
        }
    }

    function _a130(element, comment) {
        if (null !== element) {
            element.innerHTML = '';
            element.outerHTML = '<!-- strawberry.js: ' + element.outerHTML + ' | ' + comment + ' -->';
        }
    }

    function _x155(element, appInstance) {
        const lockAttrName = _x115._x164(_e98, appInstance);
        element.setAttribute(lockAttrName, _a65);
    }

    function _e113(element, appInstance) {
        const lockAttrName = _x115._x164(_e98, appInstance);
        return (element.getAttribute(lockAttrName) !== null);
    }

    function _x42(element, eventName, appInstance) {
        const lockAttrName = _x115._x164(_x66, appInstance);
        let result = false;
        const eventsAdded = element.getAttribute(lockAttrName);
        if (eventsAdded === null)
            return false;
        const allEvents = eventsAdded.split(',');
        for (var i = 0; i < allEvents.length; i++) {
            if (eventName === allEvents[i]) {
                result = true;
            }
        }
        return result;
    }

    function _a100(element, eventName, appInstance) {
        const lockAttrName = _x115._x164(_x66, appInstance);
        const eventsAdded = element.getAttribute(lockAttrName);
        if (eventsAdded === null) {
            element.setAttribute(lockAttrName, eventName);
            return;
        }
        let allEvents = eventsAdded.split(',');
        for (var i = 0; i < allEvents.length; i++) {
            if (eventName !== allEvents[i]) {
                allEvents.push(eventName);
            }
        }
        element.setAttribute(lockAttrName, allEvents.join(','));
    }

    function _x88(appInstance) {
        const xAppElements = _x115._a23(document.body, appInstance, _a37);
        let appElement;
        for (let i = 0; i < xAppElements.length; i++) {
            const element = xAppElements[i];
            if (element.tagName !== 'TEMPLATE') {
                appElement = element;
            }
        }
        return appElement;
    }

    function _x1(attributeWithValue, componentObject, appInstance) {
        const componentChildIds = componentObject._e152();
        let selector = '';
        for (let i = 0; i < componentChildIds.length; i++) {
            const childId = componentChildIds[i];
            const childXidAttrName = _x115._e72(_a64, appInstance, childId);
            selector += ':not([' + childXidAttrName + '])';
        }
        selector += ` > [${attributeWithValue}]`;
        if (componentChildIds.length === 0) {
            const xidAttrName = _x115._e72(_a64, appInstance, componentObject._e108());
            selector = `[${xidAttrName}] [${attributeWithValue}]`;
        }
        const componentElement = _x115._x116(_x88(appInstance), appInstance, componentObject._e108());
        return componentElement.querySelectorAll(selector);
    }

    function _e6(componentObject, appInstance) {
        const temporaryElement = _e22();
        const componentElement = _x115._x116(_x88(appInstance), appInstance, componentObject._e108());
        if (componentElement === null)
            return null;
        temporaryElement.innerHTML = componentElement.innerHTML;
        const componentChildIds = componentObject._e152();
        for (let i = 0; i < componentChildIds.length; i++) {
            const componentChildId = componentChildIds[i];
            const childComponentElement = _x115._x116(temporaryElement, appInstance, componentChildId);
            if (childComponentElement !== null) {
                childComponentElement.innerHTML = '';
            }
        }
        return temporaryElement.innerHTML;
    }

    function _a114(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allEnabledElements = _x115._a23(targetElement, appInstance, _x47);
                for (let i = 0; i < allEnabledElements.length; i++) {
                    const element = allEnabledElements[i];
                    const elementName = _x115._e50(element, appInstance._e145().prefix, _x47);
                    if (null === componentObject._a32(elementName)) {
                        componentObject._a31(elementName, 'enabled', '');
                    }
                    element.disabled = (componentObject._a32(elementName) === 'disabled');
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }



    function _a148(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                /**
                 * This function adds event listener to elements which is bound to a function
                 * within the component scope
                 */
                const addEvent = function(scopeObject, eventElement, fnExpression, eventType) {
                    if (new Resolver()._a119(fnExpression) !== 'function')
                        return;
                    eventElement.addEventListener(eventType, () => {
                        new Resolver()._a75(scopeObject, fnExpression, eventElement);
                    });
                };
                const events = [{
                        type: 'click',
                        attr: _x95
                    },
                    {
                        type: 'change',
                        attr: _x87
                    },
                    {
                        type: 'keyup',
                        attr: _a96
                    }
                ];
                for (let i = 0; i < events.length; i++) {
                    const event = events[i];
                    const allEventElements = _x115._a23(targetElement, appInstance, event.attr);
                    for (let k = 0; k < allEventElements.length; k++) {
                        const element = allEventElements[k];
                        const fnExpression = _x115._e50(element, appInstance._e145().prefix, event.attr);
                        if (_x42(element, event.type, appInstance))
                            continue;
                        addEvent(componentObject._e118(), element, fnExpression, event.type);
                        _a100(element, event.type, appInstance);
                    }
                }
                resolve(null);
            } catch (error) {
                reject(null);
            }
        });
    }
    const _x89 = (existingComponentId, currentId) => {
        return existingComponentId + '.' + currentId;
    };
    const _x101 = (Ids) => {
        const sortedIds = [];
        let largest = 1;
        Ids.forEach(Id => {
            if (Id.length > largest)
                largest = Id.length;
        });
        let i = largest;
        while (i > 0) {
            Ids.forEach(Id => {
                if (Id.length === i)
                    sortedIds.push(Id);
            });
            i--;
        }
        return sortedIds;
    };



    function _x43(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                /** Retrieving all elements with ifs conditional */
                const ifsElements = _x115._a23(targetElement, appInstance, _e109);
                for (let i = 0; i < ifsElements.length; i++) {
                    const ifsElement = ifsElements[i];
                    if (!_e113(ifsElement, appInstance)) {
                        const ifsArgument = _x115._e50(ifsElement, appInstance._e145().prefix, _e109);
                        const resolvedIfsValue = new Resolver()._a75(componentObject._e118(), ifsArgument);
                        if (typeof resolvedIfsValue === 'boolean' && !resolvedIfsValue) {
                            _a130(ifsElement, 'false');
                        }
                        _x155(ifsElement, appInstance);
                    }
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }


    function _x139(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                /**
                 * This function attemps to add an undefined model as part of the scope.
                 * For example, if you assign `xmodel="user.firstName"`, but firstName
                 * is not defined in $scope.user, then this function will add firstName
                 * as member property of $scope.user automatically
                 */
                const _a91 = (scopeObject, modelExpression, modelValue) => {
                    const parentObj = new Resolver()._e34(scopeObject, modelExpression);
                    const childObjExpression = new Resolver()._x76(modelExpression);
                    if (undefined !== parentObj)
                        parentObj[childObjExpression] = modelValue;
                };
                const _x92 = (modelElement, modelState) => {
                    (typeof modelState == 'boolean' && modelState) ?
                    modelElement.setAttribute('checked', ''):
                        modelElement.removeAttribute('checked');
                };
                const allModelElements = _x115._a23(targetElement, appInstance, _e59);
                for (let i = 0; i < allModelElements.length; i++) {
                    const element = allModelElements[i];
                    if (element === null)
                        continue;
                    const argument = _x115._e50(element, appInstance._e145().prefix, _e59);
                    const evaluated = new Resolver()._a75(componentObject._e118(), argument);
                    let isValueStringType = true;
                    if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                        if ((element instanceof HTMLInputElement)) {
                            const elementType = element.type;
                            if (elementType === 'radio' || elementType === 'checkbox') {
                                isValueStringType = false;
                                (evaluated === undefined) ?
                                _a91(componentObject._e118(), argument, false):
                                    _x92(element, evaluated);
                            }
                            if (elementType === 'text' || elementType === 'password' || element.type === 'email') {
                                (evaluated === undefined) ?
                                _a91(componentObject._e118(), argument, element.value):
                                    element.value = evaluated;
                            }
                            if (elementType === 'date') {
                                /** When evaluated is undefined, we will assign Date today */
                                let inputDate = new Date(Date.now());
                                if (evaluated !== undefined) {
                                    if (!(evaluated instanceof Date)) {
                                        throw new Error(`strawberry.js: [RenderError] Models assigned to Date and/or Time elements must be instance of Date object`);
                                    }
                                    inputDate = evaluated;
                                } else {
                                    _a91(componentObject._e118(), argument, inputDate);
                                }
                                const numMonth = (inputDate.getMonth() + 1);
                                const month = (numMonth < 10) ? '0' + numMonth : numMonth;
                                const elementValue = inputDate.getFullYear() + '-' + month + '-' + inputDate.getDate();
                                element.value = elementValue;
                            }
                            if (elementType === 'time') {
                                /** When evaluated is undefined, we will assign Date today */
                                let inputDate = new Date(Date.now());
                                if (evaluated !== undefined) {
                                    if (!(evaluated instanceof Date)) {
                                        throw new Error(`strawberry.js: [RenderError] Models assigned to Date and/or Time elements must be instance of Date object`);
                                    }
                                    inputDate = evaluated;
                                } else {
                                    _a91(componentObject._e118(), argument, inputDate);
                                }
                                const hours = (inputDate.getHours() < 10) ? '0' + inputDate.getHours() : inputDate.getHours();
                                const minutes = (inputDate.getMinutes() < 10) ? '0' + inputDate.getMinutes() : inputDate.getMinutes();
                                const elementValue = hours + ':' + minutes;
                                element.value = elementValue;
                            }
                        }
                        if ((element instanceof HTMLSelectElement)) {
                            (evaluated === undefined) ?
                            _a91(componentObject._e118(), argument, element.value):
                                element.value = evaluated;
                        }
                        element.addEventListener('change', (event) => {
                            const target = event.target;
                            if (target instanceof HTMLInputElement) {
                                if (target.type === 'date') {
                                    const newevaluated = new Resolver()._a75(componentObject._e118(), argument);
                                    const [syear, smonth, sdate] = target.value.split('-');
                                    const year = parseInt(syear);
                                    const month = parseInt(smonth) - 1;
                                    const date = parseInt(sdate);
                                    if (!(newevaluated instanceof Date)) {
                                        throw new Error(`strawberry.js: [RenderError] Models assigned to Date and/or Time elements must be instance of Date object`);
                                    }
                                    newevaluated.setFullYear(year);
                                    newevaluated.setMonth(month);
                                    newevaluated.setDate(date);
                                    _a91(componentObject._e118(), argument, newevaluated);
                                    return;
                                }
                                if (target.type === 'time') {
                                    const newevaluated = new Resolver()._a75(componentObject._e118(), argument);
                                    const [shour, sminute] = target.value.split(':');
                                    const hour = parseInt(shour);
                                    const minute = parseInt(sminute);
                                    if (!(newevaluated instanceof Date)) {
                                        throw new Error(`strawberry.js: [RenderError] Models assigned to Date and/or Time elements must be instance of Date object`);
                                    }
                                    newevaluated.setHours(hour);
                                    newevaluated.setMinutes(minute);
                                    _a91(componentObject._e118(), argument, newevaluated);
                                    return;
                                }
                                _a91(componentObject._e118(), argument, (isValueStringType) ? target.value : target.checked);
                            }
                            if (target instanceof HTMLSelectElement) {
                                _a91(componentObject._e118(), argument, target.value);
                            }
                        });
                    }
                    if (element.tagName === 'TEXTAREA' && (element instanceof HTMLTextAreaElement)) {
                        (evaluated === undefined) ?
                        _a91(componentObject._e118(), argument, element.value):
                            element.value = evaluated;
                        element.addEventListener('change', () => {
                            _a91(componentObject._e118(), argument, element.value);
                        });
                    }
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }

    function _x90(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const regularExpression = /(?<=\{{).+?(?=\}})/g;
                let template = targetElement.innerHTML;
                targetElement.innerHTML = '';
                /** Match all regex in the innerHTML string of the element **/
                const allMatchedData = template.match(regularExpression);
                /** When there are matches */
                if (allMatchedData !== null) {
                    for (var i = 0; i < allMatchedData.length; i++) {
                        let resolvedExpression = new Resolver()._a75(componentObject._e118(), allMatchedData[i].trim());
                        if (resolvedExpression === undefined) {
                            resolvedExpression = '';
                        }
                        template = template.replace('{{' + allMatchedData[i] + '}}', resolvedExpression);
                    }
                }
                targetElement.innerHTML = template;
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }




    function _x149(targetElement, componentObject, appInstance, skipEvents = false) {
        return new Promise(async (resolve, reject) => {
            try {
                await _e150(targetElement, componentObject, appInstance);
                await _x43(targetElement, componentObject, appInstance);
                await _x90(targetElement, componentObject, appInstance);
                await _x138(targetElement, componentObject, appInstance);
                await _e151(targetElement, componentObject, appInstance);
                await _x139(targetElement, componentObject, appInstance);
                await _a111(targetElement, componentObject, appInstance);
                await _a114(targetElement, componentObject, appInstance);
                await _a147(targetElement, componentObject, appInstance);
                if (!skipEvents) {
                    await _a148(targetElement, componentObject, appInstance);
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }




    /** Converts repeat expression into two entites: refObjName and aliasObjName  */
    function _x13(expression) {
        if (expression.includes('until '))
            return [_e20, expression.split('until')[1].trim()];
        return [
            expression.split(' as ')[0].trim(),
            expression.split(' as ')[1].trim()
        ];
    }

    function _e150(targetElement, componentObject, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                /** Retrieving all repeatable elements */
                const repeatableElements = _x115._a23(targetElement, appInstance, _e46);
                const scopeObject = componentObject._e118();
                /** Looping through repeatable elements */
                for (let i = 0; i < repeatableElements.length; i++) {
                    let repeatableElement = repeatableElements[i];
                    let htmlTemplate = repeatableElement.innerHTML;
                    repeatableElement.innerHTML = '';
                    let expression = _x115._e50(repeatableElement, appInstance._e145().prefix, _e46);
                    let [refObjName, aliasObjName] = _x13(expression);
                    if (refObjName === _e20) {
                        // This creates a new object that we can loop through
                        let repetitions = (new Resolver()._a75(scopeObject, aliasObjName));
                        // How many repitions are to be made
                        let repeatTimes = 0;
                        if (repetitions instanceof Array)
                            repeatTimes = repetitions.length;
                        if (Number.isInteger(repetitions))
                            repeatTimes = repetitions;
                        scopeObject.$$index = {};
                        let k = 0;
                        while (k < repeatTimes)
                            scopeObject.$$index['props' + (k++)] = new Object;
                    }
                    const repeatableObject = new Resolver()._a75(scopeObject, refObjName);
                    if (undefined !== repeatableObject && null !== repeatableObject) {
                        let j = 0;
                        for (const [key, value] of Object.entries(repeatableObject)) {
                            // Creating an invidual component for each repititions
                            let childTempComponent = new _e45();
                            childTempComponent._x117({
                                $parent: scopeObject,
                                $index: j++,
                                [aliasObjName]: repeatableObject[key]
                            });
                            const childRepeatElement = _e22();
                            childRepeatElement.innerHTML = htmlTemplate;
                            await _x149(childRepeatElement, childTempComponent, appInstance, true);
                            _e112(childRepeatElement, repeatableElement);
                        }
                    }
                    //console.log(expression)
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }



    function _e151(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allStyleElements = _x115._a23(targetElement, appInstance, _a58);
                for (let i = 0; i < allStyleElements.length; i++) {
                    const element = allStyleElements[i];
                    if (_e113(element, appInstance))
                        continue;
                    const argument = _x115._e50(element, appInstance._e145().prefix, _a58);
                    let evaulated = new Resolver()._a75(componentObject._e118(), argument);
                    if (evaulated !== null && evaulated !== '' && evaulated !== undefined) {
                        element.classList.add(evaulated);
                    }
                    _x155(element, appInstance);
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }
    class _x81 {
        constructor() {
            this._a54 = {};
        }
        _x53({
            key,
            component
        }) {
            this._a54[key] = component;
        }
        _a26() {
            return this._a54;
        }
    }
    class _a93 {
        constructor() {
            this._e28 = {};
        }
        _e5(componentName, template) {
            this._e8(componentName);
            if (this._e28[componentName]._e9 === null) {
                this._e28[componentName]._e9 = template;
            }
        }
        _x7(componentName, handler) {
            this._e8(componentName);
            if (this._e28[componentName]._a44 === null) {
                this._e28[componentName]._a44 = handler;
            }
        }
        _e27(componentName) {
            if (!this._e28.hasOwnProperty(componentName))
                return null;
            return this._e28[componentName]._e9;
        }
        _x35(componentName) {
            if (!this._e28.hasOwnProperty(componentName))
                return null;
            return this._e28[componentName]._a44;
        }
        _e8(componentName) {
            if (!this._e28.hasOwnProperty(componentName)) {
                this._e28[componentName] = {
                    _e9: null,
                    _a44: null
                };
            }
        }
    }
    class _e45 {
        constructor() {
            this._x146 = 'unset';
            this._e127 = 'unset';
            this._x36 = [];
            this._e55 = [];
            this._e82 = null;
            this._a18 = '';
            this._e106 = null;
            this._a17 = {};
        }
        _a107(id) {
            this._x146 = id;
            return this;
        }
        _x83(name) {
            this._e127 = name;
            return this;
        }
        _e108() {
            return this._x146;
        }
        _a84() {
            return this._e127;
        }
        _x137(name) {
            if (!this._x36.includes(name)) {
                this._x36.push(name);
            }
        }
        _a154(id) {
            if (!this._e55.includes(id)) {
                this._e55.push(id);
            }
        }
        _e132() {
            return this._x36;
        }
        _e152() {
            return this._e55;
        }
        _x157(handler) {
            if (this._e82 === null) {
                this._e82 = handler;
            }
        }
        _e156() {
            return this._e82;
        }
        _x117(scopeObject) {
            if (this._e106 === null) {
                this._e106 = scopeObject;
            }
        }
        _e118() {
            return this._e106;
        }
        _a31(name, state, template) {
            if (this._a17.hasOwnProperty(name))
                return null;
            if (state === null)
                return null;
            this._a17[name] = {
                _a56: state,
                _e29: template
            };
        }
        _a32(name) {
            if (!this._a17.hasOwnProperty(name))
                return null;
            return this._a17[name]._a56;
        }
        _x10(name) {
            if (!this._a17.hasOwnProperty(name))
                return null;
            return this._a17[name]._e29;
        }
        _x33(name, state) {
            if (!this._a17.hasOwnProperty(name))
                return;
            this._a17[name]._a56 = state;
        }
        _a102(html) {
            this._a18 = html;
        }
        _a103() {
            return this._a18;
        }
    }
    class _a11 {
        constructor(name) {
            this.implementation = document.implementation.createHTMLDocument(name);
        }
    }
    class StrawberryElement {
        constructor(element, treeCount = null) {
            this.$element = element;
            this.state = null;
            if (treeCount == null) {
                treeCount = 1;
            }
            if (treeCount < 4 && element.parentElement !== null) {
                this.$parent = new StrawberryElement(element.parentElement, treeCount++);
            }
        }
        get() {
            return this.$element;
        }
        getState() {
            return this.state;
        }
        setState(state) {
            if (state === null)
                return;
            this.state = state;
        }
        referenceScope(scopeObject) {
            this.$element.scopeOf = scopeObject;
        }
        addClass(className) {
            this.$element.classList.add(className);
        }
        listClass() {
            return this.$element.className.split(' ');
        }
        removeClass(className) {
            this.$element.classList.remove(className);
        }
        toggleClass(className) {
            let classes = this.listClass();
            for (var i = 0; i < classes.length; i++) {
                let clas = classes[i];
                if (clas === className) {
                    this.removeClass(className);
                } else {
                    this.addClass(className);
                }
            }
        }
    }
    class TypeofFactory {}
    class _x133 {
        constructor() {
            this._factoryRegistry = {};
        }
        _e15(name, handler) {
            if (handler === null)
                return;
            this._factoryRegistry[name] = {
                _factoryHandler: handler,
            };
        }
        _a74(name) {
            if (!this._factoryRegistry.hasOwnProperty(name))
                return null;
            return this._factoryRegistry[name]._factoryHandler;
        }
    }
    /**
     * @class Resolver
     * Resolves all given expression
     */

    class Resolver {
        /**
         * @method _a75
         * Resolves an expression based on a given object
         * @param object baseObj
         * @param string expression
         *
         * @returns the value of the resolved expression
         */
        _a75(baseObj, expression, element = null) {
            // We first determine what type of expression we will need to resolve.
            // This will be based on the structure of the operation
            let resolveType = this._a119(expression);
            // This is where the actual resolve process takes place
            return this.resolve(baseObj, expression, resolveType, element);
        }
        /**
         * @method _a119
         * Determines the type of an expression
         * @param string expression
         * @returns type of expression
         *
         * @NOTE: the expression should always have to be a string!
         */
        _a119(expression) {
            if (/^'.*'$/.test(expression))
                return 'string';
            if (!isNaN(expression))
                return 'number';
            if (expression.includes('('))
                return 'function';
            if (expression.includes('=='))
                return 'boolOperation';
            if (expression.includes('is '))
                return 'boolOperation';
            if (expression.includes('+') || expression.includes('-') || expression.includes('/') || expression.includes('*') || expression.includes('%')) {
                return 'operation';
            }
            if (expression == 'false' || expression == 'true' || expression == 'null') {
                return 'boolean';
            }
            return 'object';
        }
        resolve(scopeObj, expression, resolveType, element = null) {
            switch (resolveType) {
                // CASE: STRING
                case 'string':
                    return expression.slice(1, -1);
                    break;
                case 'boolean':
                    if (expression == 'true')
                        return true;
                    if (expression == 'false')
                        return false;
                    if (expression == 'null')
                        return null;
                    break;
                    // CASE: OBJECT
                case 'object':
                    return this._a158(scopeObj, expression);
                    break;
                    // CASE: FUNCTION
                case 'function':
                    /**
                     * @function _x120
                     * Invokes/calls a given function based on the function expression
                     *
                     * @param object refObject - The object where the function to invoke is a member of
                     * @param object argScope - The object where we can reference the argument expression
                     * of the function to invoke
                     * @param string functionExpression - The function expression, for example
                     * myFunction(arg)
                     */
                    let _x120 = (refObject, argScope, functionExpression) => {
                        /**
                         * @TODO Need to check cases where this returns undefined
                         * One example,this returns undefined in cases when the
                         * repeats are nested together
                         */
                        if (refObject === undefined)
                            return '';
                        // Parses function structure
                        let splitfunctionExpression = functionExpression.match(/\(([^)]+)\)/);
                        let funcStruct = functionExpression.split('(');
                        let funcName = funcStruct[0];
                        // If function has an argument
                        if (splitfunctionExpression !== null) {
                            // Function argument holder
                            var argObj = new Array;
                            let splitFunctionArguments = splitfunctionExpression[1].split(',');
                            for (var i = 0; i < splitFunctionArguments.length; i++) {
                                argObj.push(this._a75(argScope, splitFunctionArguments[i]));
                            }
                            if (element !== null) {
                                argObj.push(new StrawberryElement(element));
                            }
                            // Checks if the given is a function
                            if (!(refObject[funcName] instanceof Function)) {
                                return '';
                            }
                            return refObject[funcName](...argObj);
                        }
                        // When there is no argument added to the function, and
                        // if there is an element passed to the Resolver
                        // that means that we need to add the element as one of the
                        // arguments of the referenced function to call
                        if (element !== null) {
                            // Function argument holder
                            var argObj = new Array;
                            argObj.push(new StrawberryElement(element));
                            return refObject[funcName](...argObj);
                        }
                        if (!(refObject[funcName] instanceof Function)) {
                            return '';
                        }
                        // If it has no argument, and no Element object is required to
                        // be passed as argument to the referenced function to call
                        return refObject[funcName]();
                    };
                    let funcStruct = expression.split('(');
                    // Checks to see if structure of a function resembles an object
                    let expressionTest = funcStruct[0].split('.');
                    // If the said function is a method of an object
                    if (expressionTest.length > 1) {
                        let refObject = this._a75(scopeObj, this._x51(funcStruct[0]));
                        let funcExpression = expression.split('.').slice(((expressionTest.length) - 1)).join('.');
                        return _x120(refObject, scopeObj, funcExpression);
                    }
                    if (!scopeObj.hasOwnProperty(funcStruct[0])) {
                        // if (strawberry.debug) {
                        //     console.warn('strawberry.js: Unable to resolve $scope.'+expression);
                        // }
                        return '';
                    }
                    return _x120(scopeObj, scopeObj, expression);
                    break;
                    // CASE: BOOLEAN OPERATION
                case 'boolOperation':
                    let isTheSame = (left, right) => {
                        return (left === right);
                    };
                    let isNotTheSame = (left, right) => {
                        return (left !== right);
                    };
                    if (expression.includes('!==')) {
                        let comparables = expression.split('!==');
                        return isNotTheSame(this._a75(scopeObj, comparables[0].trim()), this._a75(scopeObj, comparables[1].trim()));
                    } else if (expression.includes('==')) {
                        let comparables = expression.split('==');
                        return isTheSame(this._a75(scopeObj, comparables[0].trim()), this._a75(scopeObj, comparables[1].trim()));
                    } else if (expression.includes('is not ')) {
                        let comparables = expression.split('is not');
                        return isNotTheSame(this._a75(scopeObj, comparables[0].trim()), this._a75(scopeObj, comparables[1].trim()));
                    } else if (expression.includes('is ')) {
                        let comparables = expression.split('is');
                        return isTheSame(this._a75(scopeObj, comparables[0].trim()), this._a75(scopeObj, comparables[1].trim()));
                    } else {}
                    break;
                case 'number':
                    return Number(expression);
                    break;
                case 'operation':
                    let finalExpression = expression;
                    let operations = ['+', '-', '*', '/', '%'];
                    for (var i = 0; i < operations.length; i++) {
                        if (expression.includes(operations[i])) {
                            let exp = expression.split(operations[i]);
                            let left = this._a75(scopeObj, exp[0].trim());
                            var right = this._a75(scopeObj, exp[1].trim());
                            finalExpression = left + operations[i] + right;
                        }
                    }
                    return eval(finalExpression);
                    break;
            }
        }
        _a158(scopeObj, objectExpression) {
            if (objectExpression === '$scope') {
                return scopeObj;
            }
            return objectExpression.split(".").reduce(function(o, x) {
                if (o === undefined) {
                    return;
                }
                if (o[x] === undefined) {
                    return;
                }
                return o[x];
            }, scopeObj);
        }
        _x51(expression) {
            let expressionPieces = expression.split('.');
            if (expressionPieces.length < 2)
                return '$scope';
            expressionPieces.pop();
            return expressionPieces.join('.');
        }
        _x76(expression) {
            let expressionPieces = expression.split('.');
            return expressionPieces[expressionPieces.length - 1];
        }
        _e34(baseObj, objExpression) {
            let parentObjExpression = this._x51(objExpression);
            return this._a75(baseObj, parentObjExpression);
        }
    } {};
    class _x134 {
        constructor() {
            this._x105 = {};
        }
        _a16(name, handler) {
            if (handler === null)
                return;
            this._x105[name] = {
                _e121: handler
            };
        }
        _e77(name) {
            if (!this._x105.hasOwnProperty(name))
                return null;
            return this._x105[name];
        }
    }
    class _a122 {
        constructor() {
            this._x105 = {};
        }
        _e104(serviceName, handleOb) {
            if (this._x105.hasOwnProperty(serviceName))
                return null;
            this._x105[serviceName] = handleOb;
        }
        _a159(serviceName) {
            if (!this._x105.hasOwnProperty(serviceName))
                return null;
            return this._x105[serviceName];
        }
    }
    class StrawberryService {}




    class _x78 {
        constructor() {
            this._a52 = [];
        }
        onReady(callBack) {
            this._a52.push(callBack);
            return (this._a52.length) - 1;
        }
    }
    /**
     * The Strawberry app instance created using the
     * `strawberry.create` function
     */
    class _a142 {
        constructor({
            id,
            name,
            config
        }) {
            this._e168 = id;
            this._e166 = name;
            this._e167 = new _a11(name);
            this._e153 = {
                component: new _x81(),
                service: new _a122()
            };
            this._a160 = {
                component: new _a93(),
                service: new _x134(),
                factory: new _x133()
            };
            this._a143 = new _x78();
            this._x123 = false;
            this._a80 = false;
            if (config === undefined) {
                this._x163 = {
                    prefix: 'x'
                };
                return;
            }
            this._x163 = config;
        }
        _a144(config) {
            this._x163 = config;
        }
        _e145() {
            return this._x163;
        }
        _x161() {
            return this._e166;
        }
        _x165() {
            return this._e168;
        }
        _a124(htmlContent) {
            this._e167.implementation.body.innerHTML = htmlContent;
        }
        _e125() {
            return this._e167.implementation.body;
        }
        _x126() {
            return this._e153;
        }
        _x135() {
            return this._a160;
        }
        _x162() {
            return this._x123;
        }
        _x136() {
            return this._a80;
        }
        _a79() {
            this._x123 = true;
            this._a143._a52.forEach(async (callback) => {
                await Promise.resolve(callback());
            });
            this._a80 = true;
        }
        _x25() {
            return this._a143;
        }
    }




    const BootableApps = [];
    let instanceId = 0;
    const strawberry = window['strawberry'] = {
        create: (appName, config) => {
            const appInstance = new _a142({
                id: instanceId++,
                name: appName
            });
            if (config !== undefined)
                appInstance._a144(config);
            BootableApps.push(appInstance);
            return {
                component: (name, handler) => {
                    appInstance._x135().component._x7('@' + name, handler);
                },
                factory: (name, reference) => {
                    appInstance._x135().factory._e15(name, reference);
                },
                service: (name, handler) => {
                    appInstance._x135().service._a16(name, handler);
                }
            };
        }
    };
    DOMHelper.ready(() => {
        BootableApps.forEach(async (appInstance) => {
            try {
                const [appElement, templateElement] = _e110(appInstance);
                /** We'll add the App Template HTML content to the appInstance object */
                appInstance._a124(templateElement.innerHTML);
                /** Compiling all components in the App Template, and their dependencies.*/
                let componentEls = appInstance._e125().querySelectorAll('[xcomponent]');
                let componentId = 0;
                for (let i = 0; i < componentEls.length; i++) {
                    /** Component Element */
                    const componentEl = componentEls[i];
                    const componentName = _x115._e50(componentEl, appInstance._e145().prefix, _e19);
                    /** Component IDs would have to be embedded to the xid attribute */
                    const xid = appInstance._x165().toString() + '.' + (componentId++).toString();
                    componentEl.setAttribute('xid', xid);
                    /**
                     * Retrieving component templates, as well as the templates of their dependencies,
                     * and the dependencies of their dependencies.
                     */
                    componentEl.innerHTML = await _a21(xid, componentEl, appInstance, [componentName]);
                }
                const componentObjects = appInstance._x126().component._a26();
                const componentIdsList = [];
                for (const componentId in componentObjects) {
                    componentIdsList.push(componentId);
                    await _x40(componentObjects[componentId], appInstance);
                }
                for (const componentId in componentObjects) {
                    const componentTemporaryElement = _e22();
                    componentTemporaryElement.innerHTML = componentObjects[componentId]._a103();
                    _x41(componentTemporaryElement, componentObjects[componentId]._e152(), appInstance);
                    componentObjects[componentId]._a102(componentTemporaryElement.innerHTML);
                }
                /** Rendering phase */
                for (const componentId in componentObjects) {
                    const targetElement = _x115._x116(appInstance._e125(), appInstance, componentId);
                    /**
                     * This happens for the following circumstances:
                     * - When the component is added inside an xif element
                     */
                    if (targetElement === null)
                        continue;
                    const temporaryElement = _e22();
                    temporaryElement.innerHTML = targetElement.innerHTML;
                    _x41(temporaryElement, componentObjects[componentId]._e152(), appInstance);
                    await _x149(temporaryElement, componentObjects[componentId], appInstance);
                    _e99(temporaryElement, targetElement, appInstance, componentObjects[componentId]._e152());
                }
                _e112(appInstance._e125(), appElement);
                appInstance._a79();
            } catch (error) {
                console.error(error);
            }
        });
    });
})();