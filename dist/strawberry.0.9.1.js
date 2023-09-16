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
    function _x3(componentObject, appInstance) {
        return appInstance._a24();
    }

    function _e136(componentObject, appInstance, blockName, callback) {
        const blockAttrNameAndValue = _a112._x70(_x58, appInstance, blockName);
        const componentElement = _a112._x113(_e85(appInstance), appInstance, componentObject._e105());
        const allB_e151s = componentElement.querySelectorAll(`[${blockAttrNameAndValue}]`);
        for (let i = 0; i < allB_e151s.length; i++) {
            const element = allB_e151s[i];
            const strawberryElement = new StrawberryElement(element);
            callback(strawberryElement);
        }
    }
    function _x13(componentObject, appInstance, elementName, state) {
        try {
            const elementState = componentObject._a30(elementName);
            if (elementState === null) {
                throw new Error('Unregistered componenet member named "' + elementName + '"');
            }
            if (elementState === state)
                return;
            const allDisabledElements = _a1(_a112._x70(_e36, appInstance, elementName), componentObject, appInstance);
            const allElements = Array.from(allDisabledElements);
            const allEnabledElements = _a1(_a112._x70(_e45, appInstance, elementName), componentObject, appInstance);
            allEnabledElements.forEach(allEnabledElement => {
                allElements.push(allEnabledElement);
            });
            for (let i = 0; i < allElements.length; i++) {
                const element = allElements[i];
                element.disabled = (state === 'disabled');
            }
            componentObject._a31(elementName, state);
        } catch (error) {
            console.error(`strawberry.js: [DisablerService] ` + error.message);
        }
    }

    function _x128(componentObject, appInstance, elementName) {
        try {
            _x13(componentObject, appInstance, elementName, 'disabled');
        } catch (error) {
            console.error(`strawberry.js: [EnablerService] ` + error.message);
        }
    }

    function _x137(componentObject, appInstance, elementName) {
        try {
            _x13(componentObject, appInstance, elementName, 'enabled');
        } catch (error) {
            console.error(`strawberry.js: [EnablerService] ` + error.message);
        }
    }

    function _x23(componentObject, appInstance) {
        class ParentReferenceTree {
            constructor(id) {
                this.id = id;
                const grandParentId = id.substring(0, (id.length - 2));
                const registry = appInstance._e123().component._a25();
                if (!registry.hasOwnProperty(grandParentId))
                    this.$parent = null;
                if (grandParentId !== '0')
                    this.$parent = new ParentReferenceTree(grandParentId);
            }
            get() {
                return registry[parentId]._a152();
            }
        }
        const parentId = componentObject._e105().substring(0, componentObject._e105().length - 2);
        const registry = appInstance._e123().component._a25();
        if (!registry.hasOwnProperty(parentId)) {
            return null;
        }
        return new ParentReferenceTree(parentId);
    }
    function _x4(elementToBindTo, componentObject, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                const elementBindFrom = _a21();
                elementBindFrom.innerHTML = componentObject._e100();
                await _a145(elementBindFrom, componentObject, appInstance);
                const childComponentIds = componentObject._e148();
                for (let i = 0; i < childComponentIds.length; i++) {
                    const childComponentId = childComponentIds[i];
                    const childComponent = _a112._x113(elementBindFrom, appInstance, childComponentId);
                    if (childComponent !== null) {
                        await _x4(childComponent, appInstance._e123().component._a25()[childComponentId], appInstance);
                    }
                }
                _e96(elementBindFrom, elementToBindTo, appInstance, componentObject._e148());
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }

    function _e71(componentObject, appInstance, blockName) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!appInstance._a158()) {
                    throw new Error(`Invalid invoking of service when boot is not complete`);
                }
                let mode = 'component';
                let elementsToPatch = [_a112._x113(_e85(appInstance), appInstance, componentObject._e105())];
                if (blockName !== undefined && blockName !== null) {
                    mode = 'block';
                    elementsToPatch = Array.from(_a1(_a112._x70(_x58, appInstance, blockName), componentObject, appInstance));
                }
                if (elementsToPatch.length === 0 || elementsToPatch[0] === null) {
                    throw new Error(`Unable to select element to patch`);
                }
                for (let i = 0; i < elementsToPatch.length; i++) {
                    const elementBindTo = elementsToPatch[i];
                    let elementBindFrom = _a21();
                    if (mode === 'component') {
                        const template = componentObject._e100();
                        elementBindFrom.innerHTML = template;
                    } else {
                        const template = componentObject._x10(blockName);
                        elementBindFrom.innerHTML = template;
                    }
                    await _a145(elementBindFrom, componentObject, appInstance);
                    _e96(elementBindFrom, elementBindTo, appInstance, componentObject._e148());
                    /**
                     * Find all unrendered child component. This happens usually because of
                     * conditional statements such xif
                     */
                    const childComponentIds = componentObject._e148();
                    for (let k = 0; k < childComponentIds.length; k++) {
                        const childComponentId = childComponentIds[k];
                        const childComponent = _a112._x113(elementBindTo, appInstance, childComponentId);
                        if (childComponent === null)
                            continue;
                        if (childComponent.innerHTML.trim() === '') {
                            await _x4(childComponent, appInstance._e123().component._a25()[childComponentId], appInstance);
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
    const _e125 = 'service_object';
    const _x126 = 'factory_object';
    const _x91 = 'component_object';
    const _a18 = 'component';
    const _a44 = 'repeat';
    const _x106 = 'if';
    const _e82 = 'hide';
    const _e83 = 'show';
    const _x55 = 'check';
    const _a56 = 'style';
    const _x57 = 'model';
    const _e36 = 'disable';
    const _e45 = 'enable';
    const _a92 = 'click';
    const _a84 = 'change';
    const _a93 = 'touch';
    const _x58 = 'block';
    const _x59 = '$scope';
    const _a60 = '$block';
    const _x46 = '$enable';
    const _e37 = '$disable';
    const _e47 = '$parent';
    const _e61 = '$patch';
    const _a94 = '$app';
    const _e62 = 'id';
    const _a19 = '$$index';
    const _e95 = 'set';
    const _x63 = '@';
    const _e64 = 'event';
    class _a112 {
        /**
         * Creates a component attribute with value. Example: `xcomponent="@ComponentName"`
         */
        static _a69(name, appInstance) {
            return appInstance._x141().prefix + _a18 + '="@' + name + '"';
        }
        /**
         * Creates an attribute with any key. Example: `xsomekeyhere`
         */
        static _e160(attributeName, appInstance) {
            return appInstance._x141().prefix + attributeName;
        }
        /**
         * Creates an attribute with any key, with any value. Example: `xsomekeyhere="value"`
         */
        static _x70(attributeName, appInstance, value) {
            return appInstance._x141().prefix + attributeName + '="' + value + '"';
        }
        static _x48(element, prefix, attributeName) {
            const resolvedAttrName = prefix + attributeName;
            return element.getAttribute(resolvedAttrName);
        }
        static _x113(element, appInstance, xid) {
            const resolvedXidAttr = appInstance._x141().prefix + _e62 + '="' + xid + '"';
            return element.querySelector(`[${resolvedXidAttr}]`);
        }
        static _a22(element, appInstance, attributeName) {
            const resolvedAttrName = this._e160(attributeName, appInstance);
            return element.querySelectorAll(`[${resolvedAttrName}]`);
        }
        static _e2(element, appInstance, componentObject, childComponentName) {
            if (!childComponentName.includes('@'))
                childComponentName = '@' + childComponentName;
            const resultXids = [];
            // Making sure we are only getting direct siblings
            const childIds = componentObject._e148();
            for (let i = 0; i < childIds.length; i++) {
                const childId = childIds[i];
                const xidAttr = this._x70(_e62, appInstance, childId);
                const xidElement = element.querySelector(`[${xidAttr}]`);
                const componentName = xidElement.getAttribute(appInstance._x141().prefix + _a18);
                if (componentName === childComponentName) {
                    resultXids.push(childId);
                }
            }
            return resultXids;
        }
    }


    function _a143(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allB_e151s = _a112._a22(targetElement, appInstance, _x58);
                for (let i = 0; i < allB_e151s.length; i++) {
                    const element = allB_e151s[i];
                    const blockElName = _a112._x48(element, appInstance._x141().prefix, _x58);
                    /** Retrieving and registering the template */
                    const componentTemplate = componentObject._e100();
                    const tempCompEl = _a21();
                    tempCompEl.innerHTML = componentTemplate;
                    const selector = _a112._x70(_x58, appInstance, blockElName);
                    const tempBlockEl = tempCompEl.querySelector(`[${selector}]`);
                    if (null === componentObject._a30(blockElName)) {
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
    function _a107(appInstance) {
        try {
            const selector = _a112._x70(_e35, appInstance, appInstance._e157());
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
    function _x20(componentId, component, appInstance, componentTree) {
        return new Promise(async (resolve, reject) => {
            try {
                let compiledComponentHtml = '';
                // First, we'll check if component has declared template
                const componentName = _a112._x48(component, appInstance._x141().prefix, _a18);
                const componentAttribute = _a112._x70(_a18, appInstance, componentName);
                const componentSelector = `template[${componentAttribute}]`;
                const componentTemplateElements = document.querySelectorAll(componentSelector);
                if (componentTemplateElements.length === 0) {
                    throw new Error(`strawberry.js: [BootError] Unable to find Component template ${componentSelector}.`);
                }
                if (componentTemplateElements.length > 1) {
                    throw new Error(`strawberry.js: [BootError] There are appears to be multiple instances of Component template ${componentSelector}.`);
                }
                /** Creating the Component Object */
                const componentObject = new _e43();
                const componentTemplateElement = componentTemplateElements[0];
                const componentImplementation = document.implementation.createHTMLDocument();
                componentImplementation.body.innerHTML = componentTemplateElement.innerHTML;
                componentObject._a104(componentId)._x80(componentName);
                /** Registering the Component in the Library */
                appInstance._x132().component._x5(componentName, componentTemplateElement.innerHTML);
                /** Registering the Component Object */
                appInstance._e123().component._e51({
                    key: componentId,
                    component: componentObject
                });
                /** Retrieving and processing of child components **/
                const selector = _a112._e160(_a18, appInstance);
                const childComponents = componentImplementation.querySelectorAll(`[${selector}]`);
                for (let i = 0; i < childComponents.length; i++) {
                    const childComponent = childComponents[i];
                    const childComponentName = _a112._x48(childComponent, appInstance._x141().prefix, _a18);
                    const childComponentId = _e86(componentId, i.toString());
                    childComponent.setAttribute('xid', childComponentId);
                    componentObject._x133(childComponentName);
                    componentObject._x150(childComponentId);
                    if (componentTree.includes(childComponentName)) {
                        throw new Error(`strawberry.js: [BootError] Circular dependency in component "${childComponentName}" detected: ${JSON.stringify(componentTree)}`);
                    }
                    const childComponentTree = [childComponentName, ...componentTree];
                    childComponent.innerHTML = await _x20(childComponentId, childComponent, appInstance, childComponentTree);
                }
                compiledComponentHtml += componentImplementation.body.innerHTML;
                componentObject._x99(compiledComponentHtml);
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

    function _x66(name, appInstance) {
        /** Check if it is a Service */
        let serviceOb = appInstance._x132().service._a75(name);
        if (serviceOb !== null)
            return 'service';
        let factorHanlder = appInstance._x132().factory._e72(name);
        if (factorHanlder !== null)
            return 'factory';
        return null;
    }

    function _x67(factoryName, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                const factoryHandler = appInstance._x132().factory._e72(factoryName);
                if (factoryHandler === null) {
                    throw new Error(`strawberry.js: [BootError] Unregistered factory callback ${factoryName}.`);
                }
                const args = await _e65(factoryHandler, 'service', factoryName);
                const injectableArguments = [];
                for (let i = 0; i < args.length; i++) {
                    const arg = args[i];
                    if (_x66(arg, appInstance) === 'service') {
                        const depService = await _x68(arg, appInstance);
                        injectableArguments.push(depService);
                        continue;
                    }
                    if (_x66(arg, appInstance) === 'factory') {
                        const depFactory = await _x67(arg, appInstance);
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
                let handleOb = appInstance._e123().service._e155(serviceName);
                if (handleOb !== null) {
                    resolve(handleOb);
                    return;
                }
                const serviceLib = appInstance._x132().service._a75(serviceName);
                if (serviceLib === null) {
                    throw new Error(`strawberry.js: [BootError] Unregistered service callback ${serviceName}.`);
                }
                const serviceHandler = serviceLib._x118;
                const args = await _e65(serviceHandler, 'service', serviceName);
                handleOb = {};
                const injectableArguments = [];
                for (let i = 0; i < args.length; i++) {
                    const arg = args[i];
                    if (_x66(arg, appInstance) === 'service') {
                        const depService = await _x68(arg, appInstance);
                        injectableArguments.push(depService);
                        continue;
                    }
                    if (_x66(arg, appInstance) === 'factory') {
                        const depFactory = await _x67(arg, appInstance);
                        injectableArguments.push(depFactory);
                        continue;
                    }
                    injectableArguments.push(null);
                }
                handleOb = serviceHandler(...injectableArguments);
                appInstance._e123().service._e101(serviceName, handleOb);
                resolve(handleOb);
            } catch (error) {
                reject(error);
            }
        });
    }
    /** This is where callback functions to components are being executed */
    function _e38(componentObject, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                if (componentObject._a152() !== null) {
                    resolve(null);
                    return;
                }
                const componentName = componentObject._e81();
                const componentLibrary = appInstance._x132().component;
                const componentHandler = componentLibrary._e33(componentName);
                if (componentHandler === null) {
                    throw new Error(`strawberry.js: [BootError] Unregistered component callback ${componentName}.`);
                }
                const allArguments = await _e65(componentHandler, 'component', componentName);
                const scopeObject = {};
                const allChildComponentNames = componentObject._a129().map(childName => childName.substring(1, childName.length));
                const injectableArguments = [];
                for (let i = 0; i < allArguments.length; i++) {
                    const argument = allArguments[i];
                    if (argument === _x59) {
                        injectableArguments.push(scopeObject);
                        componentObject._e114(scopeObject);
                        continue;
                    }
                    if (argument.charAt(0) === '$') {
                        switch (argument) {
                            case _a60:
                                injectableArguments.push((blockName, callback) => {
                                    return _e136(componentObject, appInstance, blockName, callback);
                                });
                                break;
                            case _x46:
                                injectableArguments.push((elementName) => {
                                    return _x137(componentObject, appInstance, elementName);
                                });
                                break;
                            case _e37:
                                injectableArguments.push((elementName) => {
                                    return _x128(componentObject, appInstance, elementName);
                                });
                                break;
                            case _e61:
                                injectableArguments.push((elementName) => {
                                    return _e71(componentObject, appInstance, elementName !== null && elementName !== void 0 ? elementName : null);
                                });
                                break;
                            case _e47:
                                injectableArguments.push(_x23(componentObject, appInstance));
                                break;
                            case _a94:
                                injectableArguments.push(_x3(componentObject, appInstance));
                                break;
                            default:
                                break;
                        }
                        continue;
                    }
                    /** Service injection */
                    const service = appInstance._x132().service._a75(argument);
                    if (service !== null) {
                        injectableArguments.push(await _x68(argument, appInstance));
                        continue;
                    }
                    /** Factory injection */
                    const factory = appInstance._x132().factory._e72(argument);
                    if (factory !== null) {
                        injectableArguments.push(await _x67(argument, appInstance));
                        continue;
                    }
                    /** Component Injection */
                    if (!allChildComponentNames.includes(argument)) {
                        throw new Error(`strawberry.js: [BootError] @${argument} is not a child component of ${componentName}`);
                    }
                    /** Get all children with that child component names */
                    const componentElementImplementation = _a112._x113(appInstance._x122(), appInstance, componentObject._e105());
                    const childXids = _a112._e2(componentElementImplementation, appInstance, componentObject, argument);
                    const wrapper = {};
                    for (let n = 0; n < childXids.length; n++) {
                        const childXid = childXids[n];
                        const childComponentObject = appInstance._e123().component._a25()[childXid];
                        await _e38(childComponentObject, appInstance);
                        wrapper[childXid] = childComponentObject;
                    }
                    const componentProxy = new Proxy(wrapper, {
                        get: function get(target, name) {
                            return function wrapper() {
                                // const args = Array.prototype.slice.call(arguments)
                                const returns = [];
                                for (const xid in target) {
                                    const componentInstance = target[xid];
                                    const handler = componentInstance._a152();
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
                                                returns.push(handlerInstance());
                                            } else {
                                                returns.push(handlerInstance);
                                            }
                                            continue;
                                        } else {
                                            console.warn(`strawberry.js [ComponentError] Calling undefined member property or method "${name.toString()}" from component "${componentInstance._e81()}"`);
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
                componentObject._a153(handler);
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }



    function _x134(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allCheckedElements = _a112._a22(targetElement, appInstance, _x55);
                for (let i = 0; i < allCheckedElements.length; i++) {
                    const element = allCheckedElements[i];
                    if (_x110(element, appInstance))
                        continue;
                    const argument = _a112._x48(element, appInstance._x141().prefix, _x55);
                    const evalauted = new Resolver()._e73(componentObject._x115(), argument);
                    if (typeof evalauted === 'boolean') {
                        evalauted ? element.setAttribute('checked', '') : element.removeAttribute('checked');
                    }
                    _e151(element, appInstance);
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
                const allDisabledElements = _a112._a22(targetElement, appInstance, _e36);
                for (let i = 0; i < allDisabledElements.length; i++) {
                    const element = allDisabledElements[i];
                    const elementName = _a112._x48(element, appInstance._x141().prefix, _e36);
                    if (null === componentObject._a30(elementName)) {
                        componentObject._e29(elementName, 'disabled', '');
                    }
                    element.disabled = (componentObject._a30(elementName) === 'disabled');
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
            _a112._x113(component, appInstance, childComponentId).innerHTML = '';
        }
    }

    function _a21() {
        return document.implementation.createHTMLDocument().body;
    }

    function _x109(bindFrom, bindTo) {
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
            const childActualComponent = _a112._x113(bindToEl, appInstance, childComponentId);
            if (childActualComponent !== null) {
                _x109(childActualComponent, childTemporaryElement);
                temporaryChildren[childComponentId] = childTemporaryElement;
            }
        }
        bindToEl.innerHTML = '';
        _x109(bindFromEl, bindToEl);
        for (const childComponentId in temporaryChildren) {
            const childActualComponent = _a112._x113(bindToEl, appInstance, childComponentId);
            if (childActualComponent === null)
                continue;
            _x109(temporaryChildren[childComponentId], childActualComponent);
        }
    }

    function _a127(element, comment) {
        if (null !== element) {
            element.innerHTML = '';
            element.outerHTML = '<!-- strawberry.js: ' + element.outerHTML + ' | ' + comment + ' -->';
        }
    }

    function _e151(element, appInstance) {
        const lockAttrName = _a112._e160(_e95, appInstance);
        element.setAttribute(lockAttrName, _x63);
    }

    function _x110(element, appInstance) {
        const lockAttrName = _a112._e160(_e95, appInstance);
        return (element.getAttribute(lockAttrName) !== null);
    }

    function _a40(element, eventName, appInstance) {
        const lockAttrName = _a112._e160(_e64, appInstance);
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
        const lockAttrName = _a112._e160(_e64, appInstance);
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

    function _e85(appInstance) {
        const xAppElements = _a112._a22(document.body, appInstance, _e35);
        let appElement;
        for (let i = 0; i < xAppElements.length; i++) {
            const element = xAppElements[i];
            if (element.tagName !== 'TEMPLATE') {
                appElement = element;
            }
        }
        return appElement;
    }

    function _a1(attributeWithValue, componentObject, appInstance) {
        const componentChildIds = componentObject._e148();
        let selector = '';
        for (let i = 0; i < componentChildIds.length; i++) {
            const childId = componentChildIds[i];
            const childXidAttrName = _a112._x70(_e62, appInstance, childId);
            selector += ':not([' + childXidAttrName + '])';
        }
        selector += ` > [${attributeWithValue}]`;
        const componentElement = _a112._x113(_e85(appInstance), appInstance, componentObject._e105());
        return componentElement.querySelectorAll(selector);
    }

    function _x6(componentObject, appInstance) {
        const temporaryElement = _a21();
        const componentElement = _a112._x113(_e85(appInstance), appInstance, componentObject._e105());
        if (componentElement === null)
            return null;
        temporaryElement.innerHTML = componentElement.innerHTML;
        const componentChildIds = componentObject._e148();
        for (let i = 0; i < componentChildIds.length; i++) {
            const componentChildId = componentChildIds[i];
            const childComponentElement = _a112._x113(temporaryElement, appInstance, componentChildId);
            if (childComponentElement !== null) {
                childComponentElement.innerHTML = '';
            }
        }
        return temporaryElement.innerHTML;
    }

    function _x111(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allEnabledElements = _a112._a22(targetElement, appInstance, _e45);
                for (let i = 0; i < allEnabledElements.length; i++) {
                    const element = allEnabledElements[i];
                    const elementName = _a112._x48(element, appInstance._x141().prefix, _e45);
                    if (null === componentObject._a30(elementName)) {
                        componentObject._e29(elementName, 'enabled', '');
                    }
                    element.disabled = (componentObject._a30(elementName) === 'disabled');
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
                    if (new Resolver()._e116(fnExpression) !== 'function')
                        return;
                    eventElement.addEventListener(eventType, () => {
                        new Resolver()._e73(scopeObject, fnExpression, eventElement);
                    });
                };
                const events = [{
                        type: 'click',
                        attr: _a92
                    },
                    {
                        type: 'change',
                        attr: _a84
                    },
                    {
                        type: 'keyup',
                        attr: _a93
                    }
                ];
                for (let i = 0; i < events.length; i++) {
                    const event = events[i];
                    const allEventElements = _a112._a22(targetElement, appInstance, event.attr);
                    for (let k = 0; k < allEventElements.length; k++) {
                        const element = allEventElements[k];
                        const fnExpression = _a112._x48(element, appInstance._x141().prefix, event.attr);
                        if (_a40(element, event.type, appInstance))
                            continue;
                        addEvent(componentObject._x115(), element, fnExpression, event.type);
                        _a97(element, event.type, appInstance);
                    }
                }
                resolve(null);
            } catch (error) {
                reject(null);
            }
        });
    }
    const _e86 = (existingComponentId, currentId) => {
        return existingComponentId + '.' + currentId;
    };
    const _e98 = (Ids) => {
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



    function _x41(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                /** Retrieving all elements with ifs conditional */
                const ifsElements = _a112._a22(targetElement, appInstance, _x106);
                for (let i = 0; i < ifsElements.length; i++) {
                    const ifsElement = ifsElements[i];
                    if (!_x110(ifsElement, appInstance)) {
                        const ifsArgument = _a112._x48(ifsElement, appInstance._x141().prefix, _x106);
                        const resolvedIfsValue = new Resolver()._e73(componentObject._x115(), ifsArgument);
                        if (typeof resolvedIfsValue === 'boolean' && !resolvedIfsValue) {
                            _a127(ifsElement, 'false');
                        }
                        _e151(ifsElement, appInstance);
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
                const _x88 = (scopeObject, modelExpression, modelValue) => {
                    const parentObj = new Resolver()._x32(scopeObject, modelExpression);
                    const childObjExpression = new Resolver()._a74(modelExpression);
                    if (undefined !== parentObj)
                        parentObj[childObjExpression] = modelValue;
                };
                const _a89 = (modelElement, modelState) => {
                    (typeof modelState == 'boolean' && modelState) ?
                    modelElement.setAttribute('checked', ''):
                        modelElement.removeAttribute('checked');
                };
                const allModelElements = _a112._a22(targetElement, appInstance, _x57);
                for (let i = 0; i < allModelElements.length; i++) {
                    const element = allModelElements[i];
                    if (element === null)
                        continue;
                    const argument = _a112._x48(element, appInstance._x141().prefix, _x57);
                    const evaluated = new Resolver()._e73(componentObject._x115(), argument);
                    let isValueStringType = true;
                    if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                        if ((element instanceof HTMLInputElement)) {
                            const elementType = element.type;
                            if (elementType === 'radio' || elementType === 'checkbox') {
                                isValueStringType = false;
                                (evaluated === undefined) ?
                                _x88(componentObject._x115(), argument, false):
                                    _a89(element, evaluated);
                            }
                            if (elementType === 'text') {
                                (evaluated === undefined) ?
                                _x88(componentObject._x115(), argument, element.value):
                                    element.value = evaluated;
                            }
                        }
                        if ((element instanceof HTMLSelectElement)) {
                            (evaluated === undefined) ?
                            _x88(componentObject._x115(), argument, element.value):
                                element.value = evaluated;
                        }
                        element.addEventListener('change', () => {
                            if (element instanceof HTMLInputElement) {
                                _x88(componentObject._x115(), argument, (isValueStringType) ? element.value : element.checked);
                            }
                            if (element instanceof HTMLSelectElement) {
                                _x88(componentObject._x115(), argument, element.value);
                            }
                        });
                    }
                    if (element.tagName === 'TEXTAREA' && (element instanceof HTMLTextAreaElement)) {
                        (evaluated === undefined) ?
                        _x88(componentObject._x115(), argument, element.value):
                            element.value = evaluated;
                        element.addEventListener('change', () => {
                            _x88(componentObject._x115(), argument, element.value);
                        });
                    }
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }

    function _a87(targetElement, componentObject, appInstance) {
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
                        let resolvedExpression = new Resolver()._e73(componentObject._x115(), allMatchedData[i].trim());
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




    function _a145(targetElement, componentObject, appInstance, skipEvents = false) {
        return new Promise(async (resolve, reject) => {
            try {
                await _x146(targetElement, componentObject, appInstance);
                await _x41(targetElement, componentObject, appInstance);
                await _a87(targetElement, componentObject, appInstance);
                await _x134(targetElement, componentObject, appInstance);
                await _e147(targetElement, componentObject, appInstance);
                await _e135(targetElement, componentObject, appInstance);
                await _e108(targetElement, componentObject, appInstance);
                await _x111(targetElement, componentObject, appInstance);
                await _a143(targetElement, componentObject, appInstance);
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
    function _e12(expression) {
        if (expression.includes('until '))
            return [_a19, expression.split('until')[1].trim()];
        return [
            expression.split(' as ')[0].trim(),
            expression.split(' as ')[1].trim()
        ];
    }

    function _x146(targetElement, componentObject, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                /** Retrieving all repeatable elements */
                const repeatableElements = _a112._a22(targetElement, appInstance, _a44);
                const scopeObject = componentObject._x115();
                /** Looping through repeatable elements */
                for (let i = 0; i < repeatableElements.length; i++) {
                    let repeatableElement = repeatableElements[i];
                    let htmlTemplate = repeatableElement.innerHTML;
                    repeatableElement.innerHTML = '';
                    let expression = _a112._x48(repeatableElement, appInstance._x141().prefix, _a44);
                    let [refObjName, aliasObjName] = _e12(expression);
                    if (refObjName === _a19) {
                        // This creates a new object that we can loop through
                        let repetitions = (new Resolver()._e73(scopeObject, aliasObjName));
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
                    const repeatableObject = new Resolver()._e73(scopeObject, refObjName);
                    if (undefined !== repeatableObject && null !== repeatableObject) {
                        let j = 0;
                        for (const [key, value] of Object.entries(repeatableObject)) {
                            // Creating an invidual component for each repititions
                            let childTempComponent = new _e43();
                            childTempComponent._e114({
                                $parent: scopeObject,
                                $index: j++,
                                [aliasObjName]: repeatableObject[key]
                            });
                            const childRepeatElement = _a21();
                            childRepeatElement.innerHTML = htmlTemplate;
                            await _a145(childRepeatElement, childTempComponent, appInstance, true);
                            _x109(childRepeatElement, repeatableElement);
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
                const allStyleElements = _a112._a22(targetElement, appInstance, _a56);
                for (let i = 0; i < allStyleElements.length; i++) {
                    const element = allStyleElements[i];
                    if (_x110(element, appInstance))
                        continue;
                    const argument = _a112._x48(element, appInstance._x141().prefix, _a56);
                    let evaulated = new Resolver()._e73(componentObject._x115(), argument);
                    if (evaulated !== null && evaulated !== '' && evaulated !== undefined) {
                        element.classList.add(evaulated);
                    }
                    _e151(element, appInstance);
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
        _a25() {
            return this._e52;
        }
    }
    class _e90 {
        constructor() {
            this._x27 = {};
        }
        _x5(componentName, template) {
            this._e8(componentName);
            if (this._x27[componentName]._a9 === null) {
                this._x27[componentName]._a9 = template;
            }
        }
        _e7(componentName, handler) {
            this._e8(componentName);
            if (this._x27[componentName]._e42 === null) {
                this._x27[componentName]._e42 = handler;
            }
        }
        _a26(componentName) {
            if (!this._x27.hasOwnProperty(componentName))
                return null;
            return this._x27[componentName]._a9;
        }
        _e33(componentName) {
            if (!this._x27.hasOwnProperty(componentName))
                return null;
            return this._x27[componentName]._e42;
        }
        _e8(componentName) {
            if (!this._x27.hasOwnProperty(componentName)) {
                this._x27[componentName] = {
                    _a9: null,
                    _e42: null
                };
            }
        }
    }
    class _e43 {
        constructor() {
            this._a142 = 'unset';
            this._e124 = 'unset';
            this._e34 = [];
            this._x53 = [];
            this._e79 = null;
            this._e17 = '';
            this._a103 = null;
            this._a16 = {};
        }
        _a104(id) {
            this._a142 = id;
            return this;
        }
        _x80(name) {
            this._e124 = name;
            return this;
        }
        _e105() {
            return this._a142;
        }
        _e81() {
            return this._e124;
        }
        _x133(name) {
            if (!this._e34.includes(name)) {
                this._e34.push(name);
            }
        }
        _x150(id) {
            if (!this._x53.includes(id)) {
                this._x53.push(id);
            }
        }
        _a129() {
            return this._e34;
        }
        _e148() {
            return this._x53;
        }
        _a153(handler) {
            if (this._e79 === null) {
                this._e79 = handler;
            }
        }
        _a152() {
            return this._e79;
        }
        _e114(scopeObject) {
            if (this._a103 === null) {
                this._a103 = scopeObject;
            }
        }
        _x115() {
            return this._a103;
        }
        _e29(name, state, template) {
            if (this._a16.hasOwnProperty(name))
                return null;
            if (state === null)
                return null;
            this._a16[name] = {
                _a54: state,
                _x28: template
            };
        }
        _a30(name) {
            if (!this._a16.hasOwnProperty(name))
                return null;
            return this._a16[name]._a54;
        }
        _x10(name) {
            if (!this._a16.hasOwnProperty(name))
                return null;
            return this._a16[name]._x28;
        }
        _a31(name, state) {
            if (!this._a16.hasOwnProperty(name))
                return;
            this._a16[name]._a54 = state;
        }
        _x99(html) {
            this._e17 = html;
        }
        _e100() {
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
    class _x130 {
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
        _e72(name) {
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
         * @method _e73
         * Resolves an expression based on a given object
         * @param object baseObj
         * @param string expression
         *
         * @returns the value of the resolved expression
         */
        _e73(baseObj, expression, element = null) {
            // We first determine what type of expression we will need to resolve.
            // This will be based on the structure of the operation
            let resolveType = this._e116(expression);
            // This is where the actual resolve process takes place
            return this.resolve(baseObj, expression, resolveType, element);
        }
        /**
         * @method _e116
         * Determines the type of an expression
         * @param string expression
         * @returns type of expression
         *
         * @NOTE: the expression should always have to be a string!
         */
        _e116(expression) {
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
                    return this._e154(scopeObj, expression);
                    break;
                    // CASE: FUNCTION
                case 'function':
                    /**
                     * @function _a117
                     * Invokes/calls a given function based on the function expression
                     *
                     * @param object refObject - The object where the function to invoke is a member of
                     * @param object argScope - The object where we can reference the argument expression
                     * of the function to invoke
                     * @param string functionExpression - The function expression, for example
                     * myFunction(arg)
                     */
                    let _a117 = (refObject, argScope, functionExpression) => {
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
                                argObj.push(this._e73(argScope, splitFunctionArguments[i]));
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
                        let refObject = this._e73(scopeObj, this._a49(funcStruct[0]));
                        let funcExpression = expression.split('.').slice(((expressionTest.length) - 1)).join('.');
                        return _a117(refObject, scopeObj, funcExpression);
                    }
                    if (!scopeObj.hasOwnProperty(funcStruct[0])) {
                        // if (strawberry.debug) {
                        //     console.warn('strawberry.js: Unable to resolve $scope.'+expression);
                        // }
                        return '';
                    }
                    return _a117(scopeObj, scopeObj, expression);
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
                        return isNotTheSame(this._e73(scopeObj, comparables[0].trim()), this._e73(scopeObj, comparables[1].trim()));
                    } else if (expression.includes('==')) {
                        let comparables = expression.split('==');
                        return isTheSame(this._e73(scopeObj, comparables[0].trim()), this._e73(scopeObj, comparables[1].trim()));
                    } else if (expression.includes('is not ')) {
                        let comparables = expression.split('is not');
                        return isNotTheSame(this._e73(scopeObj, comparables[0].trim()), this._e73(scopeObj, comparables[1].trim()));
                    } else if (expression.includes('is ')) {
                        let comparables = expression.split('is');
                        return isTheSame(this._e73(scopeObj, comparables[0].trim()), this._e73(scopeObj, comparables[1].trim()));
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
                            let left = this._e73(scopeObj, exp[0].trim());
                            var right = this._e73(scopeObj, exp[1].trim());
                            finalExpression = left + operations[i] + right;
                        }
                    }
                    return eval(finalExpression);
                    break;
            }
        }
        _e154(scopeObj, objectExpression) {
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
        _a74(expression) {
            let expressionPieces = expression.split('.');
            return expressionPieces[expressionPieces.length - 1];
        }
        _x32(baseObj, objExpression) {
            let parentObjExpression = this._a49(objExpression);
            return this._e73(baseObj, parentObjExpression);
        }
    } {};
    class _x131 {
        constructor() {
            this._e102 = {};
        }
        _e15(name, handler) {
            if (handler === null)
                return;
            this._e102[name] = {
                _x118: handler
            };
        }
        _a75(name) {
            if (!this._e102.hasOwnProperty(name))
                return null;
            return this._e102[name];
        }
    }
    class _a119 {
        constructor() {
            this._e102 = {};
        }
        _e101(serviceName, handleOb) {
            if (this._e102.hasOwnProperty(serviceName))
                return null;
            this._e102[serviceName] = handleOb;
        }
        _e155(serviceName) {
            if (!this._e102.hasOwnProperty(serviceName))
                return null;
            return this._e102[serviceName];
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
            this._x164 = id;
            this._x162 = name;
            this._e163 = new _a11(name);
            this._e149 = {
                component: new _e78(),
                service: new _a119()
            };
            this._e156 = {
                component: new _e90(),
                service: new _x131(),
                factory: new _x130()
            };
            this._a139 = new _e76();
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
        _x141() {
            return this._e159;
        }
        _e157() {
            return this._x162;
        }
        _e161() {
            return this._x164;
        }
        _a121(htmlContent) {
            this._e163.implementation.body.innerHTML = htmlContent;
        }
        _x122() {
            return this._e163.implementation.body;
        }
        _e123() {
            return this._e149;
        }
        _x132() {
            return this._e156;
        }
        _a158() {
            return this._a120;
        }
        _a77() {
            this._a120 = true;
            this._a139._x50.forEach(callback => {
                callback();
            });
        }
        _a24() {
            return this._a139;
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
                    appInstance._x132().component._e7('@' + name, handler);
                },
                factory: (name, reference) => {
                    appInstance._x132().factory._a14(name, reference);
                },
                service: (name, handler) => {
                    appInstance._x132().service._e15(name, handler);
                }
            };
        }
    };
    DOMHelper.ready(() => {
        BootableApps.forEach(async (appInstance) => {
            try {
                const [appElement, templateElement] = _a107(appInstance);
                /** We'll add the App Template HTML content to the appInstance object */
                appInstance._a121(templateElement.innerHTML);
                /** Compiling all components in the App Template, and their dependencies.*/
                let componentEls = appInstance._x122().querySelectorAll('[xcomponent]');
                let componentId = 0;
                for (let i = 0; i < componentEls.length; i++) {
                    /** Component Element */
                    const componentEl = componentEls[i];
                    const componentName = _a112._x48(componentEl, appInstance._x141().prefix, _a18);
                    /** Component IDs would have to be embedded to the xid attribute */
                    const xid = appInstance._e161().toString() + '.' + (componentId++).toString();
                    componentEl.setAttribute('xid', xid);
                    /**
                     * Retrieving component templates, as well as the templates of their dependencies,
                     * and the dependencies of their dependencies.
                     */
                    componentEl.innerHTML = await _x20(xid, componentEl, appInstance, [componentName]);
                }
                const componentObjects = appInstance._e123().component._a25();
                const componentIdsList = [];
                for (const componentId in componentObjects) {
                    componentIdsList.push(componentId);
                    await _e38(componentObjects[componentId], appInstance);
                }
                for (const componentId in componentObjects) {
                    const componentTemporaryElement = _a21();
                    componentTemporaryElement.innerHTML = componentObjects[componentId]._e100();
                    _a39(componentTemporaryElement, componentObjects[componentId]._e148(), appInstance);
                    componentObjects[componentId]._x99(componentTemporaryElement.innerHTML);
                }
                /** Rendering phase */
                for (const componentId in componentObjects) {
                    const targetElement = _a112._x113(appInstance._x122(), appInstance, componentId);
                    /**
                     * This happens for the following circumstances:
                     * - When the component is added inside an xif element
                     */
                    if (targetElement === null)
                        continue;
                    const temporaryElement = _a21();
                    temporaryElement.innerHTML = targetElement.innerHTML;
                    _a39(temporaryElement, componentObjects[componentId]._e148(), appInstance);
                    await _a145(temporaryElement, componentObjects[componentId], appInstance);
                    _e96(temporaryElement, targetElement, appInstance, componentObjects[componentId]._e148());
                }
                /**
                 * @NOTE Temporary only!
                 * Will need to see how we can transfer properly from DOM implementation
                 * to actual HTML
                 */
                //appElement.innerHTML = appInstance._x122().innerHTML
                _x109(appInstance._x122(), appElement);
                appInstance._a77();
            } catch (error) {
                console.error(error);
            }
        });
    });
})();