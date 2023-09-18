/*
==========================================
Strawberry JS (Beta Version 1.0.1)
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
    function _a3(componentObject, appInstance) {
        return appInstance._x24();
    }



    function _a136(componentObject, appInstance, blockName, callback) {
        const blockAttrNameAndValue = _a112._x70(_x58, appInstance, blockName);
        const componentElement = _a112._a113(_a85(appInstance), appInstance, componentObject._x105());
        const allB_x151s = componentElement.querySelectorAll(`[${blockAttrNameAndValue}]`);
        for (let i = 0; i < allB_x151s.length; i++) {
            const element = allB_x151s[i];
            const strawberryElement = new StrawberryElement(element);
            callback(strawberryElement);
        }
    }


    function _a13(componentObject, appInstance, elementName, state) {
        try {
            const elementState = componentObject._x30(elementName);
            if (elementState === null) {
                throw new Error('Unregistered componenet member named "' + elementName + '"');
            }
            if (elementState === state)
                return;
            const allDisabledElements = _x1(_a112._x70(_x36, appInstance, elementName), componentObject, appInstance);
            const allElements = Array.from(allDisabledElements);
            const allEnabledElements = _x1(_a112._x70(_a45, appInstance, elementName), componentObject, appInstance);
            allEnabledElements.forEach(allEnabledElement => {
                allElements.push(allEnabledElement);
            });
            for (let i = 0; i < allElements.length; i++) {
                const element = allElements[i];
                element.disabled = (state === 'disabled');
            }
            componentObject._x31(elementName, state);
        } catch (error) {
            console.error(`strawberry.js: [DisablerService] ` + error.message);
        }
    }

    function _a128(componentObject, appInstance, elementName) {
        try {
            _a13(componentObject, appInstance, elementName, 'disabled');
        } catch (error) {
            console.error(`strawberry.js: [EnablerService] ` + error.message);
        }
    }

    function _e137(componentObject, appInstance, elementName) {
        try {
            _a13(componentObject, appInstance, elementName, 'enabled');
        } catch (error) {
            console.error(`strawberry.js: [EnablerService] ` + error.message);
        }
    }

    function _a23(componentObject, appInstance) {
        class ParentReferenceTree {
            constructor(id) {
                this.id = id;
                const grandParentId = id.substring(0, (id.length - 2));
                const registry = appInstance._x123().component._x25();
                if (!registry.hasOwnProperty(grandParentId))
                    this.$parent = null;
                if (grandParentId !== '0')
                    this.$parent = new ParentReferenceTree(grandParentId);
            }
            get() {
                return registry[parentId]._e152();
            }
        }
        const parentId = componentObject._x105().substring(0, componentObject._x105().length - 2);
        const registry = appInstance._x123().component._x25();
        if (!registry.hasOwnProperty(parentId)) {
            return null;
        }
        return new ParentReferenceTree(parentId);
    }



    function _x4(elementToBindTo, componentObject, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                const elementBindFrom = _a21();
                elementBindFrom.innerHTML = componentObject._a100();
                await _x145(elementBindFrom, componentObject, appInstance);
                const childComponentIds = componentObject._x148();
                for (let i = 0; i < childComponentIds.length; i++) {
                    const childComponentId = childComponentIds[i];
                    const childComponent = _a112._a113(elementBindFrom, appInstance, childComponentId);
                    if (childComponent !== null) {
                        await _x4(childComponent, appInstance._x123().component._x25()[childComponentId], appInstance);
                    }
                }
                _e96(elementBindFrom, elementToBindTo, appInstance, componentObject._x148());
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }

    function _x71(componentObject, appInstance, blockName) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!appInstance._x158()) {
                    throw new Error(`Invalid invoking of service when boot is not complete`);
                }
                let mode = 'component';
                let elementsToPatch = [_a112._a113(_a85(appInstance), appInstance, componentObject._x105())];
                if (blockName !== undefined && blockName !== null) {
                    mode = 'block';
                    elementsToPatch = Array.from(_x1(_a112._x70(_x58, appInstance, blockName), componentObject, appInstance));
                }
                if (elementsToPatch.length === 0 || elementsToPatch[0] === null) {
                    throw new Error(`Unable to select element to patch`);
                }
                for (let i = 0; i < elementsToPatch.length; i++) {
                    const elementBindTo = elementsToPatch[i];
                    let elementBindFrom = _a21();
                    if (mode === 'component') {
                        const template = componentObject._a100();
                        elementBindFrom.innerHTML = template;
                    } else {
                        const template = componentObject._e10(blockName);
                        elementBindFrom.innerHTML = template;
                    }
                    await _x145(elementBindFrom, componentObject, appInstance);
                    _e96(elementBindFrom, elementBindTo, appInstance, componentObject._x148());
                    /**
                     * Find all unrendered child component. This happens usually because of
                     * conditional statements such xif
                     */
                    const childComponentIds = componentObject._x148();
                    for (let k = 0; k < childComponentIds.length; k++) {
                        const childComponentId = childComponentIds[k];
                        const childComponent = _a112._a113(elementBindTo, appInstance, childComponentId);
                        if (childComponent === null)
                            continue;
                        if (childComponent.innerHTML.trim() === '') {
                            await _x4(childComponent, appInstance._x123().component._x25()[childComponentId], appInstance);
                        }
                    }
                }
                resolve(null);
            } catch (error) {
                console.error(`strawberry.js: [PatchService] ` + error.message);
            }
        });
    }
    const _e35 = 'strawberry';
    const _a125 = 'service_object';
    const _e126 = 'factory_object';
    const _e91 = 'component_object';
    const _e18 = 'component';
    const _e44 = 'repeat';
    const _x106 = 'if';
    const _a82 = 'hide';
    const _a83 = 'show';
    const _x55 = 'check';
    const _a56 = 'style';
    const _e57 = 'model';
    const _x36 = 'disable';
    const _a45 = 'enable';
    const _a92 = 'click';
    const _e84 = 'change';
    const _e93 = 'touch';
    const _x58 = 'block';
    const _x59 = '$scope';
    const _x60 = '$block';
    const _a46 = '$enable';
    const _a37 = '$disable';
    const _a47 = '$parent';
    const _a61 = '$patch';
    const _x94 = '$app';
    const _e62 = 'id';
    const _a19 = '$$index';
    const _e95 = 'set';
    const _e63 = '@';
    const _a64 = 'event';
    class _a112 {
        /**
         * Creates a component attribute with value. Example: `xcomponent="@ComponentName"`
         */
        static _x69(name, appInstance) {
            return appInstance._a141().prefix + _e18 + '="@' + name + '"';
        }
        /**
         * Creates an attribute with any key. Example: `xsomekeyhere`
         */
        static _a160(attributeName, appInstance) {
            return appInstance._a141().prefix + attributeName;
        }
        /**
         * Creates an attribute with any key, with any value. Example: `xsomekeyhere="value"`
         */
        static _x70(attributeName, appInstance, value) {
            return appInstance._a141().prefix + attributeName + '="' + value + '"';
        }
        static _a48(element, prefix, attributeName) {
            const resolvedAttrName = prefix + attributeName;
            return element.getAttribute(resolvedAttrName);
        }
        static _a113(element, appInstance, xid) {
            const resolvedXidAttr = appInstance._a141().prefix + _e62 + '="' + xid + '"';
            return element.querySelector(`[${resolvedXidAttr}]`);
        }
        static _x22(element, appInstance, attributeName) {
            const resolvedAttrName = this._a160(attributeName, appInstance);
            return element.querySelectorAll(`[${resolvedAttrName}]`);
        }
        static _x2(element, appInstance, componentObject, childComponentName) {
            if (!childComponentName.includes('@'))
                childComponentName = '@' + childComponentName;
            const resultXids = [];
            // Making sure we are only getting direct siblings
            const childIds = componentObject._x148();
            for (let i = 0; i < childIds.length; i++) {
                const childId = childIds[i];
                const xidAttr = this._x70(_e62, appInstance, childId);
                const xidElement = element.querySelector(`[${xidAttr}]`);
                const componentName = xidElement.getAttribute(appInstance._a141().prefix + _e18);
                if (componentName === childComponentName) {
                    resultXids.push(childId);
                }
            }
            return resultXids;
        }
    }


    function _x143(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allB_x151s = _a112._x22(targetElement, appInstance, _x58);
                for (let i = 0; i < allB_x151s.length; i++) {
                    const element = allB_x151s[i];
                    const blockElName = _a112._a48(element, appInstance._a141().prefix, _x58);
                    /** Retrieving and registering the template */
                    const componentTemplate = componentObject._a100();
                    const tempCompEl = _a21();
                    tempCompEl.innerHTML = componentTemplate;
                    const selector = _a112._x70(_x58, appInstance, blockElName);
                    const tempBlockEl = tempCompEl.querySelector(`[${selector}]`);
                    if (null === componentObject._x30(blockElName)) {
                        componentObject._e29(blockElName, 'registered', tempBlockEl.innerHTML);
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
    function _x107(appInstance) {
        try {
            const selector = _a112._x70(_e35, appInstance, appInstance._a157());
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
    function _a20(componentId, component, appInstance, componentTree) {
        return new Promise(async (resolve, reject) => {
            try {
                let compiledComponentHtml = '';
                // First, we'll check if component has declared template
                const componentName = _a112._a48(component, appInstance._a141().prefix, _e18);
                const componentAttribute = _a112._x70(_e18, appInstance, componentName);
                const componentSelector = `template[${componentAttribute}]`;
                const componentTemplateElements = document.querySelectorAll(componentSelector);
                if (componentTemplateElements.length === 0) {
                    throw new Error(`strawberry.js: [BootError] Unable to find Component template ${componentSelector}.`);
                }
                if (componentTemplateElements.length > 1) {
                    throw new Error(`strawberry.js: [BootError] There are appears to be multiple instances of Component template ${componentSelector}.`);
                }
                /** Creating the Component Object */
                const componentObject = new _a43();
                const componentTemplateElement = componentTemplateElements[0];
                const componentImplementation = document.implementation.createHTMLDocument();
                componentImplementation.body.innerHTML = componentTemplateElement.innerHTML;
                componentObject._e104(componentId)._a80(componentName);
                /** Registering the Component in the Library */
                appInstance._a132().component._a5(componentName, componentTemplateElement.innerHTML);
                /** Registering the Component Object */
                appInstance._x123().component._e51({
                    key: componentId,
                    component: componentObject
                });
                /** Retrieving and processing of child components **/
                const selector = _a112._a160(_e18, appInstance);
                const childComponents = componentImplementation.querySelectorAll(`[${selector}]`);
                for (let i = 0; i < childComponents.length; i++) {
                    const childComponent = childComponents[i];
                    const childComponentName = _a112._a48(childComponent, appInstance._a141().prefix, _e18);
                    const childComponentId = _x86(componentId, i.toString());
                    childComponent.setAttribute('xid', childComponentId);
                    componentObject._x133(childComponentName);
                    componentObject._e150(childComponentId);
                    if (componentTree.includes(childComponentName)) {
                        throw new Error(`strawberry.js: [BootError] Circular dependency in component "${childComponentName}" detected: ${JSON.stringify(componentTree)}`);
                    }
                    const childComponentTree = [childComponentName, ...componentTree];
                    childComponent.innerHTML = await _a20(childComponentId, childComponent, appInstance, childComponentTree);
                }
                compiledComponentHtml += componentImplementation.body.innerHTML;
                componentObject._x99(compiledComponentHtml);
                resolve(compiledComponentHtml);
            } catch (error) {
                reject(error);
            }
        });
    }

    function _a65(handler, type, name) {
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

    function _e66(name, appInstance) {
        /** Check if it is a Service */
        let serviceOb = appInstance._a132().service._e75(name);
        if (serviceOb !== null)
            return 'service';
        let factorHanlder = appInstance._a132().factory._a72(name);
        if (factorHanlder !== null)
            return 'factory';
        return null;
    }

    function _a67(factoryName, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                const factoryHandler = appInstance._a132().factory._a72(factoryName);
                if (factoryHandler === null) {
                    throw new Error(`strawberry.js: [BootError] Unregistered factory callback ${factoryName}.`);
                }
                const args = await _a65(factoryHandler, 'service', factoryName);
                const injectableArguments = [];
                for (let i = 0; i < args.length; i++) {
                    const arg = args[i];
                    if (_e66(arg, appInstance) === 'service') {
                        const depService = await _x68(arg, appInstance);
                        injectableArguments.push(depService);
                        continue;
                    }
                    if (_e66(arg, appInstance) === 'factory') {
                        const depFactory = await _a67(arg, appInstance);
                        injectableArguments.push(depFactory);
                        continue;
                    }
                    injectableArguments.push(null);
                }
                const handleInstance = factoryHandler(...injectableArguments);
                if (typeof handleInstance === 'function' && handleInstance.prototype && handleInstance.prototype.constructor === handleInstance) {
                    resolve(new handleInstance);
                    return;
                } else {
                    throw new Error(`strawberry.js: [BootError] Factory ${factoryName} must return typeof class reference.`);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    function _x68(serviceName, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                let handleOb = appInstance._x123().service._e155(serviceName);
                if (handleOb !== null) {
                    resolve(handleOb);
                    return;
                }
                const serviceLib = appInstance._a132().service._e75(serviceName);
                if (serviceLib === null) {
                    throw new Error(`strawberry.js: [BootError] Unregistered service callback ${serviceName}.`);
                }
                const serviceHandler = serviceLib._a118;
                const args = await _a65(serviceHandler, 'service', serviceName);
                handleOb = {};
                const injectableArguments = [];
                for (let i = 0; i < args.length; i++) {
                    const arg = args[i];
                    if (_e66(arg, appInstance) === 'service') {
                        const depService = await _x68(arg, appInstance);
                        injectableArguments.push(depService);
                        continue;
                    }
                    if (_e66(arg, appInstance) === 'factory') {
                        const depFactory = await _a67(arg, appInstance);
                        injectableArguments.push(depFactory);
                        continue;
                    }
                    injectableArguments.push(null);
                }
                handleOb = serviceHandler(...injectableArguments);
                appInstance._x123().service._e101(serviceName, handleOb);
                resolve(handleOb);
            } catch (error) {
                reject(error);
            }
        });
    }
    /** This is where callback functions to components are being executed */
    function _a38(componentObject, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                if (componentObject._e152() !== null) {
                    resolve(null);
                    return;
                }
                const componentName = componentObject._x81();
                const componentLibrary = appInstance._a132().component;
                const componentHandler = componentLibrary._x33(componentName);
                if (componentHandler === null) {
                    throw new Error(`strawberry.js: [BootError] Unregistered component callback ${componentName}.`);
                }
                const allArguments = await _a65(componentHandler, 'component', componentName);
                const scopeObject = {};
                const allChildComponentNames = componentObject._a129().map(childName => childName.substring(1, childName.length));
                const injectableArguments = [];
                for (let i = 0; i < allArguments.length; i++) {
                    const argument = allArguments[i];
                    if (argument === _x59) {
                        injectableArguments.push(scopeObject);
                        componentObject._a114(scopeObject);
                        continue;
                    }
                    if (argument.charAt(0) === '$') {
                        switch (argument) {
                            case _x60:
                                injectableArguments.push((blockName, callback) => {
                                    return _a136(componentObject, appInstance, blockName, callback);
                                });
                                break;
                            case _a46:
                                injectableArguments.push((elementName) => {
                                    return _e137(componentObject, appInstance, elementName);
                                });
                                break;
                            case _a37:
                                injectableArguments.push((elementName) => {
                                    return _a128(componentObject, appInstance, elementName);
                                });
                                break;
                            case _a61:
                                injectableArguments.push((elementName) => {
                                    return _x71(componentObject, appInstance, elementName !== null && elementName !== void 0 ? elementName : null);
                                });
                                break;
                            case _a47:
                                injectableArguments.push(_a23(componentObject, appInstance));
                                break;
                            case _x94:
                                injectableArguments.push(_a3(componentObject, appInstance));
                                break;
                            default:
                                break;
                        }
                        continue;
                    }
                    /** Service injection */
                    const service = appInstance._a132().service._e75(argument);
                    if (service !== null) {
                        injectableArguments.push(await _x68(argument, appInstance));
                        continue;
                    }
                    /** Factory injection */
                    const factory = appInstance._a132().factory._a72(argument);
                    if (factory !== null) {
                        injectableArguments.push(await _a67(argument, appInstance));
                        continue;
                    }
                    /** Component Injection */
                    if (!allChildComponentNames.includes(argument)) {
                        throw new Error(`strawberry.js: [BootError] @${argument} is not a child component of ${componentName}`);
                    }
                    /** Get all children with that child component names */
                    const componentElementImplementation = _a112._a113(appInstance._x122(), appInstance, componentObject._x105());
                    const childXids = _a112._x2(componentElementImplementation, appInstance, componentObject, argument);
                    const wrapper = {};
                    for (let n = 0; n < childXids.length; n++) {
                        const childXid = childXids[n];
                        const childComponentObject = appInstance._x123().component._x25()[childXid];
                        await _a38(childComponentObject, appInstance);
                        wrapper[childXid] = childComponentObject;
                    }
                    const componentProxy = new Proxy(wrapper, {
                        get: function get(target, name) {
                            return function wrapper() {
                                const args = Array.prototype.slice.call(arguments);
                                const returns = [];
                                for (const xid in target) {
                                    const componentInstance = target[xid];
                                    const handler = componentInstance._e152();
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
                                            console.warn(`strawberry.js [ComponentError] Calling undefined member property or method "${name.toString()}" from component "${componentInstance._x81()}"`);
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
                componentObject._e153(handler);
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }



    function _x134(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allCheckedElements = _a112._x22(targetElement, appInstance, _x55);
                for (let i = 0; i < allCheckedElements.length; i++) {
                    const element = allCheckedElements[i];
                    if (_x110(element, appInstance))
                        continue;
                    const argument = _a112._a48(element, appInstance._a141().prefix, _x55);
                    const evalauted = new Resolver()._a73(componentObject._e115(), argument);
                    if (typeof evalauted === 'boolean') {
                        evalauted ? element.setAttribute('checked', '') : element.removeAttribute('checked');
                    }
                    _x151(element, appInstance);
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }

    function _e108(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allDisabledElements = _a112._x22(targetElement, appInstance, _x36);
                for (let i = 0; i < allDisabledElements.length; i++) {
                    const element = allDisabledElements[i];
                    const elementName = _a112._a48(element, appInstance._a141().prefix, _x36);
                    if (null === componentObject._x30(elementName)) {
                        componentObject._e29(elementName, 'disabled', '');
                    }
                    element.disabled = (componentObject._x30(elementName) === 'disabled');
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

    function _a39(component, childComponentIds, appInstance) {
        for (let i = 0; i < childComponentIds.length; i++) {
            const childComponentId = childComponentIds[i];
            _a112._a113(component, appInstance, childComponentId).innerHTML = '';
        }
    }

    function _a21() {
        return document.implementation.createHTMLDocument().body;
    }

    function _e109(bindFrom, bindTo) {
        if (bindFrom === null)
            return;
        while (bindFrom.childNodes.length > 0) {
            bindTo.appendChild(bindFrom.childNodes[0]);
        }
    }

    function _e96(bindFromEl, bindToEl, appInstance, childComponentIds) {
        const temporaryChildren = {};
        for (let i = 0; i < childComponentIds.length; i++) {
            const childComponentId = childComponentIds[i];
            const childTemporaryElement = _a21();
            const childActualComponent = _a112._a113(bindToEl, appInstance, childComponentId);
            if (childActualComponent !== null) {
                _e109(childActualComponent, childTemporaryElement);
                temporaryChildren[childComponentId] = childTemporaryElement;
            }
        }
        bindToEl.innerHTML = '';
        _e109(bindFromEl, bindToEl);
        for (const childComponentId in temporaryChildren) {
            const childActualComponent = _a112._a113(bindToEl, appInstance, childComponentId);
            if (childActualComponent === null)
                continue;
            _e109(temporaryChildren[childComponentId], childActualComponent);
        }
    }

    function _e127(element, comment) {
        if (null !== element) {
            element.innerHTML = '';
            element.outerHTML = '<!-- strawberry.js: ' + element.outerHTML + ' | ' + comment + ' -->';
        }
    }

    function _x151(element, appInstance) {
        const lockAttrName = _a112._a160(_e95, appInstance);
        element.setAttribute(lockAttrName, _e63);
    }

    function _x110(element, appInstance) {
        const lockAttrName = _a112._a160(_e95, appInstance);
        return (element.getAttribute(lockAttrName) !== null);
    }

    function _x40(element, eventName, appInstance) {
        const lockAttrName = _a112._a160(_a64, appInstance);
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

    function _a97(element, eventName, appInstance) {
        const lockAttrName = _a112._a160(_a64, appInstance);
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

    function _a85(appInstance) {
        const xAppElements = _a112._x22(document.body, appInstance, _e35);
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
        const componentChildIds = componentObject._x148();
        let selector = '';
        for (let i = 0; i < componentChildIds.length; i++) {
            const childId = componentChildIds[i];
            const childXidAttrName = _a112._x70(_e62, appInstance, childId);
            selector += ':not([' + childXidAttrName + '])';
        }
        selector += ` > [${attributeWithValue}]`;
        if (componentChildIds.length === 0) {
            const xidAttrName = _a112._x70(_e62, appInstance, componentObject._x105());
            selector = `[${xidAttrName}] [${attributeWithValue}]`;
        }
        const componentElement = _a112._a113(_a85(appInstance), appInstance, componentObject._x105());
        return componentElement.querySelectorAll(selector);
    }

    function _e6(componentObject, appInstance) {
        const temporaryElement = _a21();
        const componentElement = _a112._a113(_a85(appInstance), appInstance, componentObject._x105());
        if (componentElement === null)
            return null;
        temporaryElement.innerHTML = componentElement.innerHTML;
        const componentChildIds = componentObject._x148();
        for (let i = 0; i < componentChildIds.length; i++) {
            const componentChildId = componentChildIds[i];
            const childComponentElement = _a112._a113(temporaryElement, appInstance, componentChildId);
            if (childComponentElement !== null) {
                childComponentElement.innerHTML = '';
            }
        }
        return temporaryElement.innerHTML;
    }

    function _x111(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allEnabledElements = _a112._x22(targetElement, appInstance, _a45);
                for (let i = 0; i < allEnabledElements.length; i++) {
                    const element = allEnabledElements[i];
                    const elementName = _a112._a48(element, appInstance._a141().prefix, _a45);
                    if (null === componentObject._x30(elementName)) {
                        componentObject._e29(elementName, 'enabled', '');
                    }
                    element.disabled = (componentObject._x30(elementName) === 'disabled');
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }



    function _a144(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                /**
                 * This function adds event listener to elements which is bound to a function
                 * within the component scope
                 */
                const addEvent = function(scopeObject, eventElement, fnExpression, eventType) {
                    if (new Resolver()._a116(fnExpression) !== 'function')
                        return;
                    eventElement.addEventListener(eventType, () => {
                        new Resolver()._a73(scopeObject, fnExpression, eventElement);
                    });
                };
                const events = [{
                        type: 'click',
                        attr: _a92
                    },
                    {
                        type: 'change',
                        attr: _e84
                    },
                    {
                        type: 'keyup',
                        attr: _e93
                    }
                ];
                for (let i = 0; i < events.length; i++) {
                    const event = events[i];
                    const allEventElements = _a112._x22(targetElement, appInstance, event.attr);
                    for (let k = 0; k < allEventElements.length; k++) {
                        const element = allEventElements[k];
                        const fnExpression = _a112._a48(element, appInstance._a141().prefix, event.attr);
                        if (_x40(element, event.type, appInstance))
                            continue;
                        addEvent(componentObject._e115(), element, fnExpression, event.type);
                        _a97(element, event.type, appInstance);
                    }
                }
                resolve(null);
            } catch (error) {
                reject(null);
            }
        });
    }
    const _x86 = (existingComponentId, currentId) => {
        return existingComponentId + '.' + currentId;
    };
    const _x98 = (Ids) => {
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



    function _a41(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                /** Retrieving all elements with ifs conditional */
                const ifsElements = _a112._x22(targetElement, appInstance, _x106);
                for (let i = 0; i < ifsElements.length; i++) {
                    const ifsElement = ifsElements[i];
                    if (!_x110(ifsElement, appInstance)) {
                        const ifsArgument = _a112._a48(ifsElement, appInstance._a141().prefix, _x106);
                        const resolvedIfsValue = new Resolver()._a73(componentObject._e115(), ifsArgument);
                        if (typeof resolvedIfsValue === 'boolean' && !resolvedIfsValue) {
                            _e127(ifsElement, 'false');
                        }
                        _x151(ifsElement, appInstance);
                    }
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }


    function _e135(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                /**
                 * This function attemps to add an undefined model as part of the scope.
                 * For example, if you assign `xmodel="user.firstName"`, but firstName
                 * is not defined in $scope.user, then this function will add firstName
                 * as member property of $scope.user automatically
                 */
                const _e88 = (scopeObject, modelExpression, modelValue) => {
                    const parentObj = new Resolver()._x32(scopeObject, modelExpression);
                    const childObjExpression = new Resolver()._x74(modelExpression);
                    if (undefined !== parentObj)
                        parentObj[childObjExpression] = modelValue;
                };
                const _e89 = (modelElement, modelState) => {
                    (typeof modelState == 'boolean' && modelState) ?
                    modelElement.setAttribute('checked', ''):
                        modelElement.removeAttribute('checked');
                };
                const allModelElements = _a112._x22(targetElement, appInstance, _e57);
                for (let i = 0; i < allModelElements.length; i++) {
                    const element = allModelElements[i];
                    if (element === null)
                        continue;
                    const argument = _a112._a48(element, appInstance._a141().prefix, _e57);
                    const evaluated = new Resolver()._a73(componentObject._e115(), argument);
                    let isValueStringType = true;
                    if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                        if ((element instanceof HTMLInputElement)) {
                            const elementType = element.type;
                            if (elementType === 'radio' || elementType === 'checkbox') {
                                isValueStringType = false;
                                (evaluated === undefined) ?
                                _e88(componentObject._e115(), argument, false):
                                    _e89(element, evaluated);
                            }
                            if (elementType === 'text') {
                                (evaluated === undefined) ?
                                _e88(componentObject._e115(), argument, element.value):
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
                                    _e88(componentObject._e115(), argument, inputDate);
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
                                    _e88(componentObject._e115(), argument, inputDate);
                                }
                                const hours = (inputDate.getHours() < 10) ? '0' + inputDate.getHours() : inputDate.getHours();
                                const minutes = (inputDate.getMinutes() < 10) ? '0' + inputDate.getMinutes() : inputDate.getMinutes();
                                const elementValue = hours + ':' + minutes;
                                element.value = elementValue;
                            }
                        }
                        if ((element instanceof HTMLSelectElement)) {
                            (evaluated === undefined) ?
                            _e88(componentObject._e115(), argument, element.value):
                                element.value = evaluated;
                        }
                        element.addEventListener('change', (event) => {
                            const target = event.target;
                            if (target instanceof HTMLInputElement) {
                                if (target.type === 'date') {
                                    const newevaluated = new Resolver()._a73(componentObject._e115(), argument);
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
                                    _e88(componentObject._e115(), argument, newevaluated);
                                    return;
                                }
                                if (target.type === 'time') {
                                    const newevaluated = new Resolver()._a73(componentObject._e115(), argument);
                                    const [shour, sminute] = target.value.split(':');
                                    const hour = parseInt(shour);
                                    const minute = parseInt(sminute);
                                    if (!(newevaluated instanceof Date)) {
                                        throw new Error(`strawberry.js: [RenderError] Models assigned to Date and/or Time elements must be instance of Date object`);
                                    }
                                    newevaluated.setHours(hour);
                                    newevaluated.setMinutes(minute);
                                    _e88(componentObject._e115(), argument, newevaluated);
                                    return;
                                }
                                _e88(componentObject._e115(), argument, (isValueStringType) ? target.value : target.checked);
                            }
                            if (target instanceof HTMLSelectElement) {
                                _e88(componentObject._e115(), argument, target.value);
                            }
                        });
                    }
                    if (element.tagName === 'TEXTAREA' && (element instanceof HTMLTextAreaElement)) {
                        (evaluated === undefined) ?
                        _e88(componentObject._e115(), argument, element.value):
                            element.value = evaluated;
                        element.addEventListener('change', () => {
                            _e88(componentObject._e115(), argument, element.value);
                        });
                    }
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }

    function _e87(targetElement, componentObject, appInstance) {
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
                        let resolvedExpression = new Resolver()._a73(componentObject._e115(), allMatchedData[i].trim());
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




    function _x145(targetElement, componentObject, appInstance, skipEvents = false) {
        return new Promise(async (resolve, reject) => {
            try {
                await _e146(targetElement, componentObject, appInstance);
                await _a41(targetElement, componentObject, appInstance);
                await _e87(targetElement, componentObject, appInstance);
                await _x134(targetElement, componentObject, appInstance);
                await _e147(targetElement, componentObject, appInstance);
                await _e135(targetElement, componentObject, appInstance);
                await _e108(targetElement, componentObject, appInstance);
                await _x111(targetElement, componentObject, appInstance);
                await _x143(targetElement, componentObject, appInstance);
                if (!skipEvents) {
                    await _a144(targetElement, componentObject, appInstance);
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }




    /** Converts repeat expression into two entites: refObjName and aliasObjName  */
    function _a12(expression) {
        if (expression.includes('until '))
            return [_a19, expression.split('until')[1].trim()];
        return [
            expression.split(' as ')[0].trim(),
            expression.split(' as ')[1].trim()
        ];
    }

    function _e146(targetElement, componentObject, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                /** Retrieving all repeatable elements */
                const repeatableElements = _a112._x22(targetElement, appInstance, _e44);
                const scopeObject = componentObject._e115();
                /** Looping through repeatable elements */
                for (let i = 0; i < repeatableElements.length; i++) {
                    let repeatableElement = repeatableElements[i];
                    let htmlTemplate = repeatableElement.innerHTML;
                    repeatableElement.innerHTML = '';
                    let expression = _a112._a48(repeatableElement, appInstance._a141().prefix, _e44);
                    let [refObjName, aliasObjName] = _a12(expression);
                    if (refObjName === _a19) {
                        // This creates a new object that we can loop through
                        let repetitions = (new Resolver()._a73(scopeObject, aliasObjName));
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
                    const repeatableObject = new Resolver()._a73(scopeObject, refObjName);
                    if (undefined !== repeatableObject && null !== repeatableObject) {
                        let j = 0;
                        for (const [key, value] of Object.entries(repeatableObject)) {
                            // Creating an invidual component for each repititions
                            let childTempComponent = new _a43();
                            childTempComponent._a114({
                                $parent: scopeObject,
                                $index: j++,
                                [aliasObjName]: repeatableObject[key]
                            });
                            const childRepeatElement = _a21();
                            childRepeatElement.innerHTML = htmlTemplate;
                            await _x145(childRepeatElement, childTempComponent, appInstance, true);
                            _e109(childRepeatElement, repeatableElement);
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



    function _e147(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allStyleElements = _a112._x22(targetElement, appInstance, _a56);
                for (let i = 0; i < allStyleElements.length; i++) {
                    const element = allStyleElements[i];
                    if (_x110(element, appInstance))
                        continue;
                    const argument = _a112._a48(element, appInstance._a141().prefix, _a56);
                    let evaulated = new Resolver()._a73(componentObject._e115(), argument);
                    if (evaulated !== null && evaulated !== '' && evaulated !== undefined) {
                        element.classList.add(evaulated);
                    }
                    _x151(element, appInstance);
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }
    class _e78 {
        constructor() {
            this._e52 = {};
        }
        _e51({
            key,
            component
        }) {
            this._e52[key] = component;
        }
        _x25() {
            return this._e52;
        }
    }
    class _e90 {
        constructor() {
            this._a27 = {};
        }
        _a5(componentName, template) {
            this._a8(componentName);
            if (this._a27[componentName]._x9 === null) {
                this._a27[componentName]._x9 = template;
            }
        }
        _e7(componentName, handler) {
            this._a8(componentName);
            if (this._a27[componentName]._x42 === null) {
                this._a27[componentName]._x42 = handler;
            }
        }
        _x26(componentName) {
            if (!this._a27.hasOwnProperty(componentName))
                return null;
            return this._a27[componentName]._x9;
        }
        _x33(componentName) {
            if (!this._a27.hasOwnProperty(componentName))
                return null;
            return this._a27[componentName]._x42;
        }
        _a8(componentName) {
            if (!this._a27.hasOwnProperty(componentName)) {
                this._a27[componentName] = {
                    _x9: null,
                    _x42: null
                };
            }
        }
    }
    class _a43 {
        constructor() {
            this._e142 = 'unset';
            this._x124 = 'unset';
            this._x34 = [];
            this._e53 = [];
            this._a79 = null;
            this._e17 = '';
            this._a103 = null;
            this._e16 = {};
        }
        _e104(id) {
            this._e142 = id;
            return this;
        }
        _a80(name) {
            this._x124 = name;
            return this;
        }
        _x105() {
            return this._e142;
        }
        _x81() {
            return this._x124;
        }
        _x133(name) {
            if (!this._x34.includes(name)) {
                this._x34.push(name);
            }
        }
        _e150(id) {
            if (!this._e53.includes(id)) {
                this._e53.push(id);
            }
        }
        _a129() {
            return this._x34;
        }
        _x148() {
            return this._e53;
        }
        _e153(handler) {
            if (this._a79 === null) {
                this._a79 = handler;
            }
        }
        _e152() {
            return this._a79;
        }
        _a114(scopeObject) {
            if (this._a103 === null) {
                this._a103 = scopeObject;
            }
        }
        _e115() {
            return this._a103;
        }
        _e29(name, state, template) {
            if (this._e16.hasOwnProperty(name))
                return null;
            if (state === null)
                return null;
            this._e16[name] = {
                _x54: state,
                _x28: template
            };
        }
        _x30(name) {
            if (!this._e16.hasOwnProperty(name))
                return null;
            return this._e16[name]._x54;
        }
        _e10(name) {
            if (!this._e16.hasOwnProperty(name))
                return null;
            return this._e16[name]._x28;
        }
        _x31(name, state) {
            if (!this._e16.hasOwnProperty(name))
                return;
            this._e16[name]._x54 = state;
        }
        _x99(html) {
            this._e17 = html;
        }
        _a100() {
            return this._e17;
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
    class _e130 {
        constructor() {
            this._factoryRegistry = {};
        }
        _e14(name, handler) {
            if (handler === null)
                return;
            this._factoryRegistry[name] = {
                _factoryHandler: handler,
            };
        }
        _a72(name) {
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
         * @method _a73
         * Resolves an expression based on a given object
         * @param object baseObj
         * @param string expression
         *
         * @returns the value of the resolved expression
         */
        _a73(baseObj, expression, element = null) {
            // We first determine what type of expression we will need to resolve.
            // This will be based on the structure of the operation
            let resolveType = this._a116(expression);
            // This is where the actual resolve process takes place
            return this.resolve(baseObj, expression, resolveType, element);
        }
        /**
         * @method _a116
         * Determines the type of an expression
         * @param string expression
         * @returns type of expression
         *
         * @NOTE: the expression should always have to be a string!
         */
        _a116(expression) {
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
                    return this._a154(scopeObj, expression);
                    break;
                    // CASE: FUNCTION
                case 'function':
                    /**
                     * @function _e117
                     * Invokes/calls a given function based on the function expression
                     *
                     * @param object refObject - The object where the function to invoke is a member of
                     * @param object argScope - The object where we can reference the argument expression
                     * of the function to invoke
                     * @param string functionExpression - The function expression, for example
                     * myFunction(arg)
                     */
                    let _e117 = (refObject, argScope, functionExpression) => {
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
                                argObj.push(this._a73(argScope, splitFunctionArguments[i]));
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
                        let refObject = this._a73(scopeObj, this._a49(funcStruct[0]));
                        let funcExpression = expression.split('.').slice(((expressionTest.length) - 1)).join('.');
                        return _e117(refObject, scopeObj, funcExpression);
                    }
                    if (!scopeObj.hasOwnProperty(funcStruct[0])) {
                        // if (strawberry.debug) {
                        //     console.warn('strawberry.js: Unable to resolve $scope.'+expression);
                        // }
                        return '';
                    }
                    return _e117(scopeObj, scopeObj, expression);
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
                        return isNotTheSame(this._a73(scopeObj, comparables[0].trim()), this._a73(scopeObj, comparables[1].trim()));
                    } else if (expression.includes('==')) {
                        let comparables = expression.split('==');
                        return isTheSame(this._a73(scopeObj, comparables[0].trim()), this._a73(scopeObj, comparables[1].trim()));
                    } else if (expression.includes('is not ')) {
                        let comparables = expression.split('is not');
                        return isNotTheSame(this._a73(scopeObj, comparables[0].trim()), this._a73(scopeObj, comparables[1].trim()));
                    } else if (expression.includes('is ')) {
                        let comparables = expression.split('is');
                        return isTheSame(this._a73(scopeObj, comparables[0].trim()), this._a73(scopeObj, comparables[1].trim()));
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
                            let left = this._a73(scopeObj, exp[0].trim());
                            var right = this._a73(scopeObj, exp[1].trim());
                            finalExpression = left + operations[i] + right;
                        }
                    }
                    return eval(finalExpression);
                    break;
            }
        }
        _a154(scopeObj, objectExpression) {
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
        _a49(expression) {
            let expressionPieces = expression.split('.');
            if (expressionPieces.length < 2)
                return '$scope';
            expressionPieces.pop();
            return expressionPieces.join('.');
        }
        _x74(expression) {
            let expressionPieces = expression.split('.');
            return expressionPieces[expressionPieces.length - 1];
        }
        _x32(baseObj, objExpression) {
            let parentObjExpression = this._a49(objExpression);
            return this._a73(baseObj, parentObjExpression);
        }
    } {};
    class _x131 {
        constructor() {
            this._x102 = {};
        }
        _a15(name, handler) {
            if (handler === null)
                return;
            this._x102[name] = {
                _a118: handler
            };
        }
        _e75(name) {
            if (!this._x102.hasOwnProperty(name))
                return null;
            return this._x102[name];
        }
    }
    class _e119 {
        constructor() {
            this._x102 = {};
        }
        _e101(serviceName, handleOb) {
            if (this._x102.hasOwnProperty(serviceName))
                return null;
            this._x102[serviceName] = handleOb;
        }
        _e155(serviceName) {
            if (!this._x102.hasOwnProperty(serviceName))
                return null;
            return this._x102[serviceName];
        }
    }
    class StrawberryService {}




    class _e76 {
        constructor() {
            this._x50 = [];
        }
        onReady(callBack) {
            this._x50.push(callBack);
            return (this._x50.length) - 1;
        }
    }
    /**
     * The Strawberry app instance created using the
     * `strawberry.create` function
     */
    class _a138 {
        constructor({
            id,
            name,
            config
        }) {
            this._e164 = id;
            this._a162 = name;
            this._x163 = new _a11(name);
            this._x149 = {
                component: new _e78(),
                service: new _e119()
            };
            this._x156 = {
                component: new _e90(),
                service: new _x131(),
                factory: new _e130()
            };
            this._e139 = new _e76();
            this._a120 = false;
            if (config === undefined) {
                this._e159 = {
                    prefix: 'x'
                };
                return;
            }
            this._e159 = config;
        }
        _e140(config) {
            this._e159 = config;
        }
        _a141() {
            return this._e159;
        }
        _a157() {
            return this._a162;
        }
        _e161() {
            return this._e164;
        }
        _x121(htmlContent) {
            this._x163.implementation.body.innerHTML = htmlContent;
        }
        _x122() {
            return this._x163.implementation.body;
        }
        _x123() {
            return this._x149;
        }
        _a132() {
            return this._x156;
        }
        _x158() {
            return this._a120;
        }
        _e77() {
            this._a120 = true;
            this._e139._x50.forEach(callback => {
                callback();
            });
        }
        _x24() {
            return this._e139;
        }
    }




    const BootableApps = [];
    let instanceId = 0;
    const strawberry = window['strawberry'] = {
        create: (appName, config) => {
            const appInstance = new _a138({
                id: instanceId++,
                name: appName
            });
            if (config !== undefined)
                appInstance._e140(config);
            BootableApps.push(appInstance);
            return {
                component: (name, handler) => {
                    appInstance._a132().component._e7('@' + name, handler);
                },
                factory: (name, reference) => {
                    appInstance._a132().factory._e14(name, reference);
                },
                service: (name, handler) => {
                    appInstance._a132().service._a15(name, handler);
                }
            };
        }
    };
    DOMHelper.ready(() => {
        BootableApps.forEach(async (appInstance) => {
            try {
                const [appElement, templateElement] = _x107(appInstance);
                /** We'll add the App Template HTML content to the appInstance object */
                appInstance._x121(templateElement.innerHTML);
                /** Compiling all components in the App Template, and their dependencies.*/
                let componentEls = appInstance._x122().querySelectorAll('[xcomponent]');
                let componentId = 0;
                for (let i = 0; i < componentEls.length; i++) {
                    /** Component Element */
                    const componentEl = componentEls[i];
                    const componentName = _a112._a48(componentEl, appInstance._a141().prefix, _e18);
                    /** Component IDs would have to be embedded to the xid attribute */
                    const xid = appInstance._e161().toString() + '.' + (componentId++).toString();
                    componentEl.setAttribute('xid', xid);
                    /**
                     * Retrieving component templates, as well as the templates of their dependencies,
                     * and the dependencies of their dependencies.
                     */
                    componentEl.innerHTML = await _a20(xid, componentEl, appInstance, [componentName]);
                }
                const componentObjects = appInstance._x123().component._x25();
                const componentIdsList = [];
                for (const componentId in componentObjects) {
                    componentIdsList.push(componentId);
                    await _a38(componentObjects[componentId], appInstance);
                }
                for (const componentId in componentObjects) {
                    const componentTemporaryElement = _a21();
                    componentTemporaryElement.innerHTML = componentObjects[componentId]._a100();
                    _a39(componentTemporaryElement, componentObjects[componentId]._x148(), appInstance);
                    componentObjects[componentId]._x99(componentTemporaryElement.innerHTML);
                }
                /** Rendering phase */
                for (const componentId in componentObjects) {
                    const targetElement = _a112._a113(appInstance._x122(), appInstance, componentId);
                    /**
                     * This happens for the following circumstances:
                     * - When the component is added inside an xif element
                     */
                    if (targetElement === null)
                        continue;
                    const temporaryElement = _a21();
                    temporaryElement.innerHTML = targetElement.innerHTML;
                    _a39(temporaryElement, componentObjects[componentId]._x148(), appInstance);
                    await _x145(temporaryElement, componentObjects[componentId], appInstance);
                    _e96(temporaryElement, targetElement, appInstance, componentObjects[componentId]._x148());
                }
                /**
                 * @NOTE Temporary only!
                 * Will need to see how we can transfer properly from DOM implementation
                 * to actual HTML
                 */
                //appElement.innerHTML = appInstance._x122().innerHTML
                _e109(appInstance._x122(), appElement);
                appInstance._e77();
            } catch (error) {
                console.error(error);
            }
        });
    });
})();