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
    function _e3(componentObject, appInstance) {
        return appInstance._a24();
    }



    function _a138(componentObject, appInstance, blockName, callback) {
        const blockAttrNameAndValue = _x113._x70(_x58, appInstance, blockName);
        const componentElement = _x113._x114(_a86(appInstance), appInstance, componentObject._e106());
        const allB_x153s = componentElement.querySelectorAll(`[${blockAttrNameAndValue}]`);
        for (let i = 0; i < allB_x153s.length; i++) {
            const element = allB_x153s[i];
            const strawberryElement = new StrawberryElement(element);
            callback(strawberryElement);
        }
    }


    function _x13(componentObject, appInstance, elementName, state) {
        try {
            const elementState = componentObject._e30(elementName);
            if (elementState === null) {
                throw new Error('Unregistered componenet member named "' + elementName + '"');
            }
            if (elementState === state)
                return;
            const allDisabledElements = _e1(_x113._x70(_e36, appInstance, elementName), componentObject, appInstance);
            const allElements = Array.from(allDisabledElements);
            const allEnabledElements = _e1(_x113._x70(_x45, appInstance, elementName), componentObject, appInstance);
            allEnabledElements.forEach(allEnabledElement => {
                allElements.push(allEnabledElement);
            });
            for (let i = 0; i < allElements.length; i++) {
                const element = allElements[i];
                element.disabled = (state === 'disabled');
            }
            componentObject._e31(elementName, state);
        } catch (error) {
            console.error(`strawberry.js: [DisablerService] ` + error.message);
        }
    }

    function _x129(componentObject, appInstance, elementName) {
        try {
            _x13(componentObject, appInstance, elementName, 'disabled');
        } catch (error) {
            console.error(`strawberry.js: [EnablerService] ` + error.message);
        }
    }

    function _x139(componentObject, appInstance, elementName) {
        try {
            _x13(componentObject, appInstance, elementName, 'enabled');
        } catch (error) {
            console.error(`strawberry.js: [EnablerService] ` + error.message);
        }
    }

    function _e23(componentObject, appInstance) {
        class ParentReferenceTree {
            constructor(id) {
                this.id = id;
                const grandParentId = id.substring(0, (id.length - 2));
                const registry = appInstance._e124().component._x25();
                if (!registry.hasOwnProperty(grandParentId))
                    this.$parent = null;
                if (grandParentId !== '0')
                    this.$parent = new ParentReferenceTree(grandParentId);
            }
            get() {
                return registry[parentId]._e154();
            }
        }
        const parentId = componentObject._e106().substring(0, componentObject._e106().length - 2);
        const registry = appInstance._e124().component._x25();
        if (!registry.hasOwnProperty(parentId)) {
            return null;
        }
        return new ParentReferenceTree(parentId);
    }



    function _x4(elementToBindTo, componentObject, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                const elementBindFrom = _e21();
                elementBindFrom.innerHTML = componentObject._a101();
                await _x147(elementBindFrom, componentObject, appInstance);
                const childComponentIds = componentObject._x150();
                for (let i = 0; i < childComponentIds.length; i++) {
                    const childComponentId = childComponentIds[i];
                    const childComponent = _x113._x114(elementBindFrom, appInstance, childComponentId);
                    if (childComponent !== null) {
                        await _x4(childComponent, appInstance._e124().component._x25()[childComponentId], appInstance);
                    }
                }
                _e97(elementBindFrom, elementToBindTo, appInstance, componentObject._x150());
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }

    function _x71(componentObject, appInstance, blockName) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!appInstance._a160()) {
                    throw new Error(`Invalid invoking of service when boot is not complete`);
                }
                let mode = 'component';
                let elementsToPatch = [_x113._x114(_a86(appInstance), appInstance, componentObject._e106())];
                if (blockName !== undefined && blockName !== null) {
                    mode = 'block';
                    elementsToPatch = Array.from(_e1(_x113._x70(_x58, appInstance, blockName), componentObject, appInstance));
                }
                if (elementsToPatch.length === 0 || elementsToPatch[0] === null) {
                    if (!appInstance._x134())
                        return resolve(null);
                    throw new Error(`Unable to select element to patch`);
                }
                for (let i = 0; i < elementsToPatch.length; i++) {
                    const elementBindTo = elementsToPatch[i];
                    let elementBindFrom = _e21();
                    if (mode === 'component') {
                        const template = componentObject._a101();
                        elementBindFrom.innerHTML = template;
                    } else {
                        const template = componentObject._e10(blockName);
                        elementBindFrom.innerHTML = template;
                    }
                    await _x147(elementBindFrom, componentObject, appInstance);
                    _e97(elementBindFrom, elementBindTo, appInstance, componentObject._x150());
                    /**
                     * Find all unrendered child component. This happens usually because of
                     * conditional statements such xif
                     */
                    const childComponentIds = componentObject._x150();
                    for (let k = 0; k < childComponentIds.length; k++) {
                        const childComponentId = childComponentIds[k];
                        const childComponent = _x113._x114(elementBindTo, appInstance, childComponentId);
                        if (childComponent === null)
                            continue;
                        if (childComponent.innerHTML.trim() === '') {
                            await _x4(childComponent, appInstance._e124().component._x25()[childComponentId], appInstance);
                        }
                    }
                }
                resolve(null);
            } catch (error) {
                console.error(`strawberry.js: [PatchService] ` + error.message);
            }
        });
    }
    const _a35 = 'strawberry';
    const _x126 = 'service_object';
    const _x127 = 'factory_object';
    const _x92 = 'component_object';
    const _e18 = 'component';
    const _x44 = 'repeat';
    const _x107 = 'if';
    const _a83 = 'hide';
    const _x84 = 'show';
    const _e55 = 'check';
    const _x56 = 'style';
    const _e57 = 'model';
    const _e36 = 'disable';
    const _x45 = 'enable';
    const _x93 = 'click';
    const _e85 = 'change';
    const _e94 = 'touch';
    const _x58 = 'block';
    const _e59 = '$scope';
    const _x60 = '$block';
    const _e46 = '$enable';
    const _e37 = '$disable';
    const _x47 = '$parent';
    const _x61 = '$patch';
    const _x95 = '$app';
    const _x62 = 'id';
    const _a19 = '$$index';
    const _e96 = 'set';
    const _e63 = '@';
    const _x64 = 'event';
    class _x113 {
        /**
         * Creates a component attribute with value. Example: `xcomponent="@ComponentName"`
         */
        static _x69(name, appInstance) {
            return appInstance._a143().prefix + _e18 + '="@' + name + '"';
        }
        /**
         * Creates an attribute with any key. Example: `xsomekeyhere`
         */
        static _x162(attributeName, appInstance) {
            return appInstance._a143().prefix + attributeName;
        }
        /**
         * Creates an attribute with any key, with any value. Example: `xsomekeyhere="value"`
         */
        static _x70(attributeName, appInstance, value) {
            return appInstance._a143().prefix + attributeName + '="' + value + '"';
        }
        static _a48(element, prefix, attributeName) {
            const resolvedAttrName = prefix + attributeName;
            return element.getAttribute(resolvedAttrName);
        }
        static _x114(element, appInstance, xid) {
            const resolvedXidAttr = appInstance._a143().prefix + _x62 + '="' + xid + '"';
            return element.querySelector(`[${resolvedXidAttr}]`);
        }
        static _a22(element, appInstance, attributeName) {
            const resolvedAttrName = this._x162(attributeName, appInstance);
            return element.querySelectorAll(`[${resolvedAttrName}]`);
        }
        static _a2(element, appInstance, componentObject, childComponentName) {
            if (!childComponentName.includes('@'))
                childComponentName = '@' + childComponentName;
            const resultXids = [];
            // Making sure we are only getting direct siblings
            const childIds = componentObject._x150();
            for (let i = 0; i < childIds.length; i++) {
                const childId = childIds[i];
                const xidAttr = this._x70(_x62, appInstance, childId);
                const xidElement = element.querySelector(`[${xidAttr}]`);
                const componentName = xidElement.getAttribute(appInstance._a143().prefix + _e18);
                if (componentName === childComponentName) {
                    resultXids.push(childId);
                }
            }
            return resultXids;
        }
    }


    function _x145(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allB_x153s = _x113._a22(targetElement, appInstance, _x58);
                for (let i = 0; i < allB_x153s.length; i++) {
                    const element = allB_x153s[i];
                    const blockElName = _x113._a48(element, appInstance._a143().prefix, _x58);
                    /** Retrieving and registering the template */
                    const componentTemplate = componentObject._a101();
                    const tempCompEl = _e21();
                    tempCompEl.innerHTML = componentTemplate;
                    const selector = _x113._x70(_x58, appInstance, blockElName);
                    const tempBlockEl = tempCompEl.querySelector(`[${selector}]`);
                    if (null === componentObject._e30(blockElName)) {
                        componentObject._x29(blockElName, 'registered', tempBlockEl.innerHTML);
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
    function _e108(appInstance) {
        try {
            const selector = _x113._x70(_a35, appInstance, appInstance._x159());
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
                const componentName = _x113._a48(component, appInstance._a143().prefix, _e18);
                const componentAttribute = _x113._x70(_e18, appInstance, componentName);
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
                componentObject._e105(componentId)._x81(componentName);
                /** Registering the Component in the Library */
                appInstance._x133().component._x5(componentName, componentTemplateElement.innerHTML);
                /** Registering the Component Object */
                appInstance._e124().component._a51({
                    key: componentId,
                    component: componentObject
                });
                /** Retrieving and processing of child components **/
                const selector = _x113._x162(_e18, appInstance);
                const childComponents = componentImplementation.querySelectorAll(`[${selector}]`);
                for (let i = 0; i < childComponents.length; i++) {
                    const childComponent = childComponents[i];
                    const childComponentName = _x113._a48(childComponent, appInstance._a143().prefix, _e18);
                    const childComponentId = _a87(componentId, i.toString());
                    childComponent.setAttribute('xid', childComponentId);
                    componentObject._a135(childComponentName);
                    componentObject._e152(childComponentId);
                    if (componentTree.includes(childComponentName)) {
                        throw new Error(`strawberry.js: [BootError] Circular dependency in component "${childComponentName}" detected: ${JSON.stringify(componentTree)}`);
                    }
                    const childComponentTree = [childComponentName, ...componentTree];
                    childComponent.innerHTML = await _a20(childComponentId, childComponent, appInstance, childComponentTree);
                }
                compiledComponentHtml += componentImplementation.body.innerHTML;
                componentObject._a100(compiledComponentHtml);
                resolve(compiledComponentHtml);
            } catch (error) {
                reject(error);
            }
        });
    }

    function _e65(handler, type, name) {
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
        let serviceOb = appInstance._x133().service._a75(name);
        if (serviceOb !== null)
            return 'service';
        let factorHanlder = appInstance._x133().factory._a72(name);
        if (factorHanlder !== null)
            return 'factory';
        return null;
    }

    function _a67(factoryName, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                const factoryHandler = appInstance._x133().factory._a72(factoryName);
                if (factoryHandler === null) {
                    throw new Error(`strawberry.js: [BootError] Unregistered factory callback ${factoryName}.`);
                }
                const args = await _e65(factoryHandler, 'service', factoryName);
                const injectableArguments = [];
                for (let i = 0; i < args.length; i++) {
                    const arg = args[i];
                    if (_e66(arg, appInstance) === 'service') {
                        const depService = await _e68(arg, appInstance);
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

    function _e68(serviceName, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                let handleOb = appInstance._e124().service._a157(serviceName);
                if (handleOb !== null) {
                    resolve(handleOb);
                    return;
                }
                const serviceLib = appInstance._x133().service._a75(serviceName);
                if (serviceLib === null) {
                    throw new Error(`strawberry.js: [BootError] Unregistered service callback ${serviceName}.`);
                }
                const serviceHandler = serviceLib._a119;
                const args = await _e65(serviceHandler, 'service', serviceName);
                handleOb = {};
                const injectableArguments = [];
                for (let i = 0; i < args.length; i++) {
                    const arg = args[i];
                    if (_e66(arg, appInstance) === 'service') {
                        const depService = await _e68(arg, appInstance);
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
                appInstance._e124().service._e102(serviceName, handleOb);
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
                if (componentObject._e154() !== null) {
                    resolve(null);
                    return;
                }
                const componentName = componentObject._e82();
                const componentLibrary = appInstance._x133().component;
                const componentHandler = componentLibrary._x33(componentName);
                if (componentHandler === null) {
                    throw new Error(`strawberry.js: [BootError] Unregistered component callback ${componentName}.`);
                }
                const allArguments = await _e65(componentHandler, 'component', componentName);
                const scopeObject = {};
                const allChildComponentNames = componentObject._x130().map(childName => childName.substring(1, childName.length));
                const injectableArguments = [];
                for (let i = 0; i < allArguments.length; i++) {
                    const argument = allArguments[i];
                    if (argument === _e59) {
                        injectableArguments.push(scopeObject);
                        componentObject._e115(scopeObject);
                        continue;
                    }
                    if (argument.charAt(0) === '$') {
                        switch (argument) {
                            case _x60:
                                injectableArguments.push((blockName, callback) => {
                                    return _a138(componentObject, appInstance, blockName, callback);
                                });
                                break;
                            case _e46:
                                injectableArguments.push((elementName) => {
                                    return _x139(componentObject, appInstance, elementName);
                                });
                                break;
                            case _e37:
                                injectableArguments.push((elementName) => {
                                    return _x129(componentObject, appInstance, elementName);
                                });
                                break;
                            case _x61:
                                injectableArguments.push((elementName) => {
                                    return _x71(componentObject, appInstance, elementName !== null && elementName !== void 0 ? elementName : null);
                                });
                                break;
                            case _x47:
                                injectableArguments.push(_e23(componentObject, appInstance));
                                break;
                            case _x95:
                                injectableArguments.push(_e3(componentObject, appInstance));
                                break;
                            default:
                                break;
                        }
                        continue;
                    }
                    /** Service injection */
                    const service = appInstance._x133().service._a75(argument);
                    if (service !== null) {
                        injectableArguments.push(await _e68(argument, appInstance));
                        continue;
                    }
                    /** Factory injection */
                    const factory = appInstance._x133().factory._a72(argument);
                    if (factory !== null) {
                        injectableArguments.push(await _a67(argument, appInstance));
                        continue;
                    }
                    /** Component Injection */
                    if (!allChildComponentNames.includes(argument)) {
                        throw new Error(`strawberry.js: [BootError] @${argument} is not a child component of ${componentName}`);
                    }
                    /** Get all children with that child component names */
                    const componentElementImplementation = _x113._x114(appInstance._x123(), appInstance, componentObject._e106());
                    const childXids = _x113._a2(componentElementImplementation, appInstance, componentObject, argument);
                    const wrapper = {};
                    for (let n = 0; n < childXids.length; n++) {
                        const childXid = childXids[n];
                        const childComponentObject = appInstance._e124().component._x25()[childXid];
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
                                    const handler = componentInstance._e154();
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
                                            console.warn(`strawberry.js [ComponentError] Calling undefined member property or method "${name.toString()}" from component "${componentInstance._e82()}"`);
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
                componentObject._e155(handler);
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }



    function _x136(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allCheckedElements = _x113._a22(targetElement, appInstance, _e55);
                for (let i = 0; i < allCheckedElements.length; i++) {
                    const element = allCheckedElements[i];
                    if (_a111(element, appInstance))
                        continue;
                    const argument = _x113._a48(element, appInstance._a143().prefix, _e55);
                    const evalauted = new Resolver()._a73(componentObject._e116(), argument);
                    if (typeof evalauted === 'boolean') {
                        evalauted ? element.setAttribute('checked', '') : element.removeAttribute('checked');
                    }
                    _x153(element, appInstance);
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }

    function _e109(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allDisabledElements = _x113._a22(targetElement, appInstance, _e36);
                for (let i = 0; i < allDisabledElements.length; i++) {
                    const element = allDisabledElements[i];
                    const elementName = _x113._a48(element, appInstance._a143().prefix, _e36);
                    if (null === componentObject._e30(elementName)) {
                        componentObject._x29(elementName, 'disabled', '');
                    }
                    element.disabled = (componentObject._e30(elementName) === 'disabled');
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

    function _x39(component, childComponentIds, appInstance) {
        for (let i = 0; i < childComponentIds.length; i++) {
            const childComponentId = childComponentIds[i];
            _x113._x114(component, appInstance, childComponentId).innerHTML = '';
        }
    }

    function _e21() {
        return document.implementation.createHTMLDocument().body;
    }

    function _e110(bindFrom, bindTo) {
        if (bindFrom === null)
            return;
        while (bindFrom.childNodes.length > 0) {
            bindTo.appendChild(bindFrom.childNodes[0]);
        }
    }

    function _e97(bindFromEl, bindToEl, appInstance, childComponentIds) {
        const temporaryChildren = {};
        for (let i = 0; i < childComponentIds.length; i++) {
            const childComponentId = childComponentIds[i];
            const childTemporaryElement = _e21();
            const childActualComponent = _x113._x114(bindToEl, appInstance, childComponentId);
            if (childActualComponent !== null) {
                _e110(childActualComponent, childTemporaryElement);
                temporaryChildren[childComponentId] = childTemporaryElement;
            }
        }
        bindToEl.innerHTML = '';
        _e110(bindFromEl, bindToEl);
        for (const childComponentId in temporaryChildren) {
            const childActualComponent = _x113._x114(bindToEl, appInstance, childComponentId);
            if (childActualComponent === null)
                continue;
            _e110(temporaryChildren[childComponentId], childActualComponent);
        }
    }

    function _a128(element, comment) {
        if (null !== element) {
            element.innerHTML = '';
            element.outerHTML = '<!-- strawberry.js: ' + element.outerHTML + ' | ' + comment + ' -->';
        }
    }

    function _x153(element, appInstance) {
        const lockAttrName = _x113._x162(_e96, appInstance);
        element.setAttribute(lockAttrName, _e63);
    }

    function _a111(element, appInstance) {
        const lockAttrName = _x113._x162(_e96, appInstance);
        return (element.getAttribute(lockAttrName) !== null);
    }

    function _x40(element, eventName, appInstance) {
        const lockAttrName = _x113._x162(_x64, appInstance);
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

    function _x98(element, eventName, appInstance) {
        const lockAttrName = _x113._x162(_x64, appInstance);
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

    function _a86(appInstance) {
        const xAppElements = _x113._a22(document.body, appInstance, _a35);
        let appElement;
        for (let i = 0; i < xAppElements.length; i++) {
            const element = xAppElements[i];
            if (element.tagName !== 'TEMPLATE') {
                appElement = element;
            }
        }
        return appElement;
    }

    function _e1(attributeWithValue, componentObject, appInstance) {
        const componentChildIds = componentObject._x150();
        let selector = '';
        for (let i = 0; i < componentChildIds.length; i++) {
            const childId = componentChildIds[i];
            const childXidAttrName = _x113._x70(_x62, appInstance, childId);
            selector += ':not([' + childXidAttrName + '])';
        }
        selector += ` > [${attributeWithValue}]`;
        if (componentChildIds.length === 0) {
            const xidAttrName = _x113._x70(_x62, appInstance, componentObject._e106());
            selector = `[${xidAttrName}] [${attributeWithValue}]`;
        }
        const componentElement = _x113._x114(_a86(appInstance), appInstance, componentObject._e106());
        return componentElement.querySelectorAll(selector);
    }

    function _x6(componentObject, appInstance) {
        const temporaryElement = _e21();
        const componentElement = _x113._x114(_a86(appInstance), appInstance, componentObject._e106());
        if (componentElement === null)
            return null;
        temporaryElement.innerHTML = componentElement.innerHTML;
        const componentChildIds = componentObject._x150();
        for (let i = 0; i < componentChildIds.length; i++) {
            const componentChildId = componentChildIds[i];
            const childComponentElement = _x113._x114(temporaryElement, appInstance, componentChildId);
            if (childComponentElement !== null) {
                childComponentElement.innerHTML = '';
            }
        }
        return temporaryElement.innerHTML;
    }

    function _x112(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allEnabledElements = _x113._a22(targetElement, appInstance, _x45);
                for (let i = 0; i < allEnabledElements.length; i++) {
                    const element = allEnabledElements[i];
                    const elementName = _x113._a48(element, appInstance._a143().prefix, _x45);
                    if (null === componentObject._e30(elementName)) {
                        componentObject._x29(elementName, 'enabled', '');
                    }
                    element.disabled = (componentObject._e30(elementName) === 'disabled');
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }



    function _a146(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                /**
                 * This function adds event listener to elements which is bound to a function
                 * within the component scope
                 */
                const addEvent = function(scopeObject, eventElement, fnExpression, eventType) {
                    if (new Resolver()._e117(fnExpression) !== 'function')
                        return;
                    eventElement.addEventListener(eventType, () => {
                        new Resolver()._a73(scopeObject, fnExpression, eventElement);
                    });
                };
                const events = [{
                        type: 'click',
                        attr: _x93
                    },
                    {
                        type: 'change',
                        attr: _e85
                    },
                    {
                        type: 'keyup',
                        attr: _e94
                    }
                ];
                for (let i = 0; i < events.length; i++) {
                    const event = events[i];
                    const allEventElements = _x113._a22(targetElement, appInstance, event.attr);
                    for (let k = 0; k < allEventElements.length; k++) {
                        const element = allEventElements[k];
                        const fnExpression = _x113._a48(element, appInstance._a143().prefix, event.attr);
                        if (_x40(element, event.type, appInstance))
                            continue;
                        addEvent(componentObject._e116(), element, fnExpression, event.type);
                        _x98(element, event.type, appInstance);
                    }
                }
                resolve(null);
            } catch (error) {
                reject(null);
            }
        });
    }
    const _a87 = (existingComponentId, currentId) => {
        return existingComponentId + '.' + currentId;
    };
    const _e99 = (Ids) => {
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



    function _e41(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                /** Retrieving all elements with ifs conditional */
                const ifsElements = _x113._a22(targetElement, appInstance, _x107);
                for (let i = 0; i < ifsElements.length; i++) {
                    const ifsElement = ifsElements[i];
                    if (!_a111(ifsElement, appInstance)) {
                        const ifsArgument = _x113._a48(ifsElement, appInstance._a143().prefix, _x107);
                        const resolvedIfsValue = new Resolver()._a73(componentObject._e116(), ifsArgument);
                        if (typeof resolvedIfsValue === 'boolean' && !resolvedIfsValue) {
                            _a128(ifsElement, 'false');
                        }
                        _x153(ifsElement, appInstance);
                    }
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }


    function _e137(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                /**
                 * This function attemps to add an undefined model as part of the scope.
                 * For example, if you assign `xmodel="user.firstName"`, but firstName
                 * is not defined in $scope.user, then this function will add firstName
                 * as member property of $scope.user automatically
                 */
                const _x89 = (scopeObject, modelExpression, modelValue) => {
                    const parentObj = new Resolver()._x32(scopeObject, modelExpression);
                    const childObjExpression = new Resolver()._e74(modelExpression);
                    if (undefined !== parentObj)
                        parentObj[childObjExpression] = modelValue;
                };
                const _x90 = (modelElement, modelState) => {
                    (typeof modelState == 'boolean' && modelState) ?
                    modelElement.setAttribute('checked', ''):
                        modelElement.removeAttribute('checked');
                };
                const allModelElements = _x113._a22(targetElement, appInstance, _e57);
                for (let i = 0; i < allModelElements.length; i++) {
                    const element = allModelElements[i];
                    if (element === null)
                        continue;
                    const argument = _x113._a48(element, appInstance._a143().prefix, _e57);
                    const evaluated = new Resolver()._a73(componentObject._e116(), argument);
                    let isValueStringType = true;
                    if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                        if ((element instanceof HTMLInputElement)) {
                            const elementType = element.type;
                            if (elementType === 'radio' || elementType === 'checkbox') {
                                isValueStringType = false;
                                (evaluated === undefined) ?
                                _x89(componentObject._e116(), argument, false):
                                    _x90(element, evaluated);
                            }
                            if (elementType === 'text') {
                                (evaluated === undefined) ?
                                _x89(componentObject._e116(), argument, element.value):
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
                                    _x89(componentObject._e116(), argument, inputDate);
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
                                    _x89(componentObject._e116(), argument, inputDate);
                                }
                                const hours = (inputDate.getHours() < 10) ? '0' + inputDate.getHours() : inputDate.getHours();
                                const minutes = (inputDate.getMinutes() < 10) ? '0' + inputDate.getMinutes() : inputDate.getMinutes();
                                const elementValue = hours + ':' + minutes;
                                element.value = elementValue;
                            }
                        }
                        if ((element instanceof HTMLSelectElement)) {
                            (evaluated === undefined) ?
                            _x89(componentObject._e116(), argument, element.value):
                                element.value = evaluated;
                        }
                        element.addEventListener('change', (event) => {
                            const target = event.target;
                            if (target instanceof HTMLInputElement) {
                                if (target.type === 'date') {
                                    const newevaluated = new Resolver()._a73(componentObject._e116(), argument);
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
                                    _x89(componentObject._e116(), argument, newevaluated);
                                    return;
                                }
                                if (target.type === 'time') {
                                    const newevaluated = new Resolver()._a73(componentObject._e116(), argument);
                                    const [shour, sminute] = target.value.split(':');
                                    const hour = parseInt(shour);
                                    const minute = parseInt(sminute);
                                    if (!(newevaluated instanceof Date)) {
                                        throw new Error(`strawberry.js: [RenderError] Models assigned to Date and/or Time elements must be instance of Date object`);
                                    }
                                    newevaluated.setHours(hour);
                                    newevaluated.setMinutes(minute);
                                    _x89(componentObject._e116(), argument, newevaluated);
                                    return;
                                }
                                _x89(componentObject._e116(), argument, (isValueStringType) ? target.value : target.checked);
                            }
                            if (target instanceof HTMLSelectElement) {
                                _x89(componentObject._e116(), argument, target.value);
                            }
                        });
                    }
                    if (element.tagName === 'TEXTAREA' && (element instanceof HTMLTextAreaElement)) {
                        (evaluated === undefined) ?
                        _x89(componentObject._e116(), argument, element.value):
                            element.value = evaluated;
                        element.addEventListener('change', () => {
                            _x89(componentObject._e116(), argument, element.value);
                        });
                    }
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }

    function _x88(targetElement, componentObject, appInstance) {
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
                        let resolvedExpression = new Resolver()._a73(componentObject._e116(), allMatchedData[i].trim());
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




    function _x147(targetElement, componentObject, appInstance, skipEvents = false) {
        return new Promise(async (resolve, reject) => {
            try {
                await _e148(targetElement, componentObject, appInstance);
                await _e41(targetElement, componentObject, appInstance);
                await _x88(targetElement, componentObject, appInstance);
                await _x136(targetElement, componentObject, appInstance);
                await _x149(targetElement, componentObject, appInstance);
                await _e137(targetElement, componentObject, appInstance);
                await _e109(targetElement, componentObject, appInstance);
                await _x112(targetElement, componentObject, appInstance);
                await _x145(targetElement, componentObject, appInstance);
                if (!skipEvents) {
                    await _a146(targetElement, componentObject, appInstance);
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }




    /** Converts repeat expression into two entites: refObjName and aliasObjName  */
    function _x12(expression) {
        if (expression.includes('until '))
            return [_a19, expression.split('until')[1].trim()];
        return [
            expression.split(' as ')[0].trim(),
            expression.split(' as ')[1].trim()
        ];
    }

    function _e148(targetElement, componentObject, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                /** Retrieving all repeatable elements */
                const repeatableElements = _x113._a22(targetElement, appInstance, _x44);
                const scopeObject = componentObject._e116();
                /** Looping through repeatable elements */
                for (let i = 0; i < repeatableElements.length; i++) {
                    let repeatableElement = repeatableElements[i];
                    let htmlTemplate = repeatableElement.innerHTML;
                    repeatableElement.innerHTML = '';
                    let expression = _x113._a48(repeatableElement, appInstance._a143().prefix, _x44);
                    let [refObjName, aliasObjName] = _x12(expression);
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
                            childTempComponent._e115({
                                $parent: scopeObject,
                                $index: j++,
                                [aliasObjName]: repeatableObject[key]
                            });
                            const childRepeatElement = _e21();
                            childRepeatElement.innerHTML = htmlTemplate;
                            await _x147(childRepeatElement, childTempComponent, appInstance, true);
                            _e110(childRepeatElement, repeatableElement);
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



    function _x149(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allStyleElements = _x113._a22(targetElement, appInstance, _x56);
                for (let i = 0; i < allStyleElements.length; i++) {
                    const element = allStyleElements[i];
                    if (_a111(element, appInstance))
                        continue;
                    const argument = _x113._a48(element, appInstance._a143().prefix, _x56);
                    let evaulated = new Resolver()._a73(componentObject._e116(), argument);
                    if (evaulated !== null && evaulated !== '' && evaulated !== undefined) {
                        element.classList.add(evaulated);
                    }
                    _x153(element, appInstance);
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }
    class _e79 {
        constructor() {
            this._a52 = {};
        }
        _a51({
            key,
            component
        }) {
            this._a52[key] = component;
        }
        _x25() {
            return this._a52;
        }
    }
    class _e91 {
        constructor() {
            this._x27 = {};
        }
        _x5(componentName, template) {
            this._e8(componentName);
            if (this._x27[componentName]._x9 === null) {
                this._x27[componentName]._x9 = template;
            }
        }
        _x7(componentName, handler) {
            this._e8(componentName);
            if (this._x27[componentName]._a42 === null) {
                this._x27[componentName]._a42 = handler;
            }
        }
        _x26(componentName) {
            if (!this._x27.hasOwnProperty(componentName))
                return null;
            return this._x27[componentName]._x9;
        }
        _x33(componentName) {
            if (!this._x27.hasOwnProperty(componentName))
                return null;
            return this._x27[componentName]._a42;
        }
        _e8(componentName) {
            if (!this._x27.hasOwnProperty(componentName)) {
                this._x27[componentName] = {
                    _x9: null,
                    _a42: null
                };
            }
        }
    }
    class _a43 {
        constructor() {
            this._e144 = 'unset';
            this._e125 = 'unset';
            this._x34 = [];
            this._a53 = [];
            this._e80 = null;
            this._x17 = '';
            this._a104 = null;
            this._a16 = {};
        }
        _e105(id) {
            this._e144 = id;
            return this;
        }
        _x81(name) {
            this._e125 = name;
            return this;
        }
        _e106() {
            return this._e144;
        }
        _e82() {
            return this._e125;
        }
        _a135(name) {
            if (!this._x34.includes(name)) {
                this._x34.push(name);
            }
        }
        _e152(id) {
            if (!this._a53.includes(id)) {
                this._a53.push(id);
            }
        }
        _x130() {
            return this._x34;
        }
        _x150() {
            return this._a53;
        }
        _e155(handler) {
            if (this._e80 === null) {
                this._e80 = handler;
            }
        }
        _e154() {
            return this._e80;
        }
        _e115(scopeObject) {
            if (this._a104 === null) {
                this._a104 = scopeObject;
            }
        }
        _e116() {
            return this._a104;
        }
        _x29(name, state, template) {
            if (this._a16.hasOwnProperty(name))
                return null;
            if (state === null)
                return null;
            this._a16[name] = {
                _a54: state,
                _e28: template
            };
        }
        _e30(name) {
            if (!this._a16.hasOwnProperty(name))
                return null;
            return this._a16[name]._a54;
        }
        _e10(name) {
            if (!this._a16.hasOwnProperty(name))
                return null;
            return this._a16[name]._e28;
        }
        _e31(name, state) {
            if (!this._a16.hasOwnProperty(name))
                return;
            this._a16[name]._a54 = state;
        }
        _a100(html) {
            this._x17 = html;
        }
        _a101() {
            return this._x17;
        }
    }
    class _x11 {
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
    class _a131 {
        constructor() {
            this._factoryRegistry = {};
        }
        _a14(name, handler) {
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
            let resolveType = this._e117(expression);
            // This is where the actual resolve process takes place
            return this.resolve(baseObj, expression, resolveType, element);
        }
        /**
         * @method _e117
         * Determines the type of an expression
         * @param string expression
         * @returns type of expression
         *
         * @NOTE: the expression should always have to be a string!
         */
        _e117(expression) {
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
                    return this._e156(scopeObj, expression);
                    break;
                    // CASE: FUNCTION
                case 'function':
                    /**
                     * @function _a118
                     * Invokes/calls a given function based on the function expression
                     *
                     * @param object refObject - The object where the function to invoke is a member of
                     * @param object argScope - The object where we can reference the argument expression
                     * of the function to invoke
                     * @param string functionExpression - The function expression, for example
                     * myFunction(arg)
                     */
                    let _a118 = (refObject, argScope, functionExpression) => {
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
                        return _a118(refObject, scopeObj, funcExpression);
                    }
                    if (!scopeObj.hasOwnProperty(funcStruct[0])) {
                        // if (strawberry.debug) {
                        //     console.warn('strawberry.js: Unable to resolve $scope.'+expression);
                        // }
                        return '';
                    }
                    return _a118(scopeObj, scopeObj, expression);
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
        _e156(scopeObj, objectExpression) {
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
        _e74(expression) {
            let expressionPieces = expression.split('.');
            return expressionPieces[expressionPieces.length - 1];
        }
        _x32(baseObj, objExpression) {
            let parentObjExpression = this._a49(objExpression);
            return this._a73(baseObj, parentObjExpression);
        }
    } {};
    class _a132 {
        constructor() {
            this._e103 = {};
        }
        _x15(name, handler) {
            if (handler === null)
                return;
            this._e103[name] = {
                _a119: handler
            };
        }
        _a75(name) {
            if (!this._e103.hasOwnProperty(name))
                return null;
            return this._e103[name];
        }
    }
    class _e120 {
        constructor() {
            this._e103 = {};
        }
        _e102(serviceName, handleOb) {
            if (this._e103.hasOwnProperty(serviceName))
                return null;
            this._e103[serviceName] = handleOb;
        }
        _a157(serviceName) {
            if (!this._e103.hasOwnProperty(serviceName))
                return null;
            return this._e103[serviceName];
        }
    }
    class StrawberryService {}




    class _a76 {
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
    class _x140 {
        constructor({
            id,
            name,
            config
        }) {
            this._e166 = id;
            this._x164 = name;
            this._e165 = new _x11(name);
            this._e151 = {
                component: new _e79(),
                service: new _e120()
            };
            this._a158 = {
                component: new _e91(),
                service: new _a132(),
                factory: new _a131()
            };
            this._a141 = new _a76();
            this._e121 = false;
            this._a78 = false;
            if (config === undefined) {
                this._a161 = {
                    prefix: 'x'
                };
                return;
            }
            this._a161 = config;
        }
        _e142(config) {
            this._a161 = config;
        }
        _a143() {
            return this._a161;
        }
        _x159() {
            return this._x164;
        }
        _a163() {
            return this._e166;
        }
        _e122(htmlContent) {
            this._e165.implementation.body.innerHTML = htmlContent;
        }
        _x123() {
            return this._e165.implementation.body;
        }
        _e124() {
            return this._e151;
        }
        _x133() {
            return this._a158;
        }
        _a160() {
            return this._e121;
        }
        _x134() {
            return this._a78;
        }
        _a77() {
            this._e121 = true;
            this._a141._x50.forEach(async (callback) => {
                await Promise.resolve(callback());
            });
            this._a78 = true;
        }
        _a24() {
            return this._a141;
        }
    }




    const BootableApps = [];
    let instanceId = 0;
    const strawberry = window['strawberry'] = {
        create: (appName, config) => {
            const appInstance = new _x140({
                id: instanceId++,
                name: appName
            });
            if (config !== undefined)
                appInstance._e142(config);
            BootableApps.push(appInstance);
            return {
                component: (name, handler) => {
                    appInstance._x133().component._x7('@' + name, handler);
                },
                factory: (name, reference) => {
                    appInstance._x133().factory._a14(name, reference);
                },
                service: (name, handler) => {
                    appInstance._x133().service._x15(name, handler);
                }
            };
        }
    };
    DOMHelper.ready(() => {
        BootableApps.forEach(async (appInstance) => {
            try {
                const [appElement, templateElement] = _e108(appInstance);
                /** We'll add the App Template HTML content to the appInstance object */
                appInstance._e122(templateElement.innerHTML);
                /** Compiling all components in the App Template, and their dependencies.*/
                let componentEls = appInstance._x123().querySelectorAll('[xcomponent]');
                let componentId = 0;
                for (let i = 0; i < componentEls.length; i++) {
                    /** Component Element */
                    const componentEl = componentEls[i];
                    const componentName = _x113._a48(componentEl, appInstance._a143().prefix, _e18);
                    /** Component IDs would have to be embedded to the xid attribute */
                    const xid = appInstance._a163().toString() + '.' + (componentId++).toString();
                    componentEl.setAttribute('xid', xid);
                    /**
                     * Retrieving component templates, as well as the templates of their dependencies,
                     * and the dependencies of their dependencies.
                     */
                    componentEl.innerHTML = await _a20(xid, componentEl, appInstance, [componentName]);
                }
                const componentObjects = appInstance._e124().component._x25();
                const componentIdsList = [];
                for (const componentId in componentObjects) {
                    componentIdsList.push(componentId);
                    await _a38(componentObjects[componentId], appInstance);
                }
                for (const componentId in componentObjects) {
                    const componentTemporaryElement = _e21();
                    componentTemporaryElement.innerHTML = componentObjects[componentId]._a101();
                    _x39(componentTemporaryElement, componentObjects[componentId]._x150(), appInstance);
                    componentObjects[componentId]._a100(componentTemporaryElement.innerHTML);
                }
                /** Rendering phase */
                for (const componentId in componentObjects) {
                    const targetElement = _x113._x114(appInstance._x123(), appInstance, componentId);
                    /**
                     * This happens for the following circumstances:
                     * - When the component is added inside an xif element
                     */
                    if (targetElement === null)
                        continue;
                    const temporaryElement = _e21();
                    temporaryElement.innerHTML = targetElement.innerHTML;
                    _x39(temporaryElement, componentObjects[componentId]._x150(), appInstance);
                    await _x147(temporaryElement, componentObjects[componentId], appInstance);
                    _e97(temporaryElement, targetElement, appInstance, componentObjects[componentId]._x150());
                }
                _e110(appInstance._x123(), appElement);
                appInstance._a77();
            } catch (error) {
                console.error(error);
            }
        });
    });
})();