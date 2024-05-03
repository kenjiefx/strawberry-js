/*
==========================================
Strawberry JS (Beta Version 0.9.8)
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
    /**
     * Registers and stores all the Component template and
     * callback handlers.
     */
    class x44 {
        constructor() {
            this.a110 = {};
        }
        /** Registers a template */
        a89(name, template) {
            this.x124(name);
            if (this.a110[name].x111 !== null)
                return;
            this.a110[name].x111 = template;
        }
        /** Registers a callback handler */
        e98(name, handler) {
            this.x124(name);
            if (this.a110[name].a115 !== null)
                return;
            this.a110[name].a115 = handler;
        }
        /** Retrieves the template */
        e90(name) {
            if (!(name in this.a110))
                return null;
            return this.a110[name].x111;
        }
        /** Retrievs the handler */
        x99(name) {
            if (!(name in this.a110))
                return null;
            return this.a110[name].a115;
        }
        x124(name) {
            if (!(name in this.a110)) {
                this.a110[name] = {
                    x111: null,
                    a115: null
                };
            }
        }
    }
    class TypeofFactory {}
    /**
     * Registers and stores all the Factory callbacks/handlers
     */
    class e63 {
        constructor() {
            this.a110 = {};
        }
        /** Register a new callback/handler */
        e112(name, handler) {
            if (handler === null)
                return;
            this.a110[name] = {
                a115: handler
            };
        }
        /** Retrievs a handler */
        x99(name) {
            if (!(name in this.a110))
                return null;
            return this.a110[name].a115;
        }
    }
    /**
     * Registers and stores all the Service callbacks/handlers
     */
    class e64 {
        constructor() {
            this.a110 = {};
        }
        /** Register a new callback/handler */
        e112(name, handler) {
            if (handler === null)
                return;
            this.a110[name] = {
                a115: handler
            };
        }
        /** Retrievs a handler */
        x99(name) {
            if (!(name in this.a110))
                return null;
            return this.a110[name];
        }
    }



    /**
     * The App library contains all the usable Components, Services,
     * and Factories declared from the frontend.
     */
    class x100 {
        constructor() {
            this.e108 = new x44;
            this.e116 = new e64;
            this.a117 = new e63;
        }
    }

    function e2(componentObject, appInstance) {
        return appInstance.a27();
    }



    function e74(componentObject, appInstance, blockName, callback) {
        const blockAttrNameAndValue = e52.x28(BLOCK_ELEMENT_ATTR, appInstance, blockName);
        const componentElement = e52.x53(e38(appInstance), appInstance, componentObject.a125());
        if (componentElement === null) {
            throw new Error('strawberry.js unknown component element');
        }
        const allBlockElements = componentElement.querySelectorAll(`[${blockAttrNameAndValue}]`);
        for (let i = 0; i < allBlockElements.length; i++) {
            const element = allBlockElements[i];
            const strawberryElement = new x39(element);
            callback(strawberryElement);
        }
    }

    function a7(componentObject, appInstance) {
        return {
            get: (childName) => {
                if (childName.charAt(0) !== '@')
                    childName = '@' + childName;
                let childComponentObject = null;
                const childIds = componentObject.x91();
                for (let i = 0; i < childIds.length; i++) {
                    const childId = childIds[i];
                    const childComponent = appInstance.x65().e108.x130()[childId];
                    if (childComponent.x118() === childName) {
                        childComponentObject = childComponent;
                        break;
                    }
                }
                if (childComponentObject === null)
                    return null;
                return childComponentObject.x99();
            }
        };
    }


    function a8(componentObject, appInstance, elementName, state) {
        try {
            const elementState = componentObject.e15(elementName);
            if (elementState === null) {
                throw new Error('unregistered componenet member named "' + elementName + '"');
            }
            if (elementState === state)
                return;
            const allDisabledElements = x1(e52.x28(DISABLE_ELEMENT_ATTR, appInstance, elementName), componentObject, appInstance);
            if (allDisabledElements === null)
                return;
            const allElements = Array.from(allDisabledElements);
            const allEnabledElements = x1(e52.x28(ENABLE_ELEMENT_ATTR, appInstance, elementName), componentObject, appInstance);
            if (allEnabledElements === null)
                return;
            allEnabledElements.forEach(allEnabledElement => {
                allElements.push(allEnabledElement);
            });
            for (let i = 0; i < allElements.length; i++) {
                const element = allElements[i];
                element.disabled = (state === 'disabled');
            }
            componentObject.e16(elementName, state);
        } catch (error) {
            console.error(`strawberry.js: [DisablerService] ` + error.message);
        }
    }

    function x66(componentObject, appInstance, elementName) {
        try {
            a8(componentObject, appInstance, elementName, 'disabled');
        } catch (error) {
            console.error(`strawberry.js: [EnablerService] ` + error.message);
        }
    }

    function a75(componentObject, appInstance, elementName) {
        try {
            a8(componentObject, appInstance, elementName, 'enabled');
        } catch (error) {
            console.error(`strawberry.js: [EnablerService] ` + error.message);
        }
    }

    function e11(componentObject, appInstance) {
        class a23 {
            constructor(id) {
                this.id = id;
                const grandParentId = id.substring(0, (id.length - 2));
                const registry = appInstance.x65().e108.x130();
                if (!registry.hasOwnProperty(grandParentId))
                    this.$parent = null;
                if (grandParentId !== '0')
                    this.$parent = new a23(grandParentId);
            }
            get() {
                return registry[parentId].x99();
            }
        }
        const parentId = componentObject.a125().substring(0, componentObject.a125().length - 2);
        const registry = appInstance.x65().e108.x130();
        if (!registry.hasOwnProperty(parentId)) {
            return null;
        }
        return new a23(parentId);
    }



    function e3(elementToBindTo, componentObject, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                const elementBindFrom = e12();
                elementBindFrom.innerHTML = componentObject.x54();
                await e82(elementBindFrom, componentObject, appInstance);
                const childComponentIds = componentObject.x91();
                for (let i = 0; i < childComponentIds.length; i++) {
                    const childComponentId = childComponentIds[i];
                    const childComponent = e52.x53(elementBindFrom, appInstance, childComponentId);
                    if (childComponent !== null) {
                        await e3(childComponent, appInstance.x65().e108.x130()[childComponentId], appInstance);
                    }
                }
                e45(elementBindFrom, elementToBindTo, appInstance, componentObject.x91());
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }

    function e29(componentObject, appInstance, blockName) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!appInstance.x119()) {
                    throw new Error(`invalid invoking of service when boot is not ready`);
                }
                let mode = 'component';
                let elementsToPatch = [e52.x53(e38(appInstance), appInstance, componentObject.a125())];
                if (blockName !== undefined && blockName !== null) {
                    mode = 'block';
                    const elementsButNotChild = x1(e52.x28(BLOCK_ELEMENT_ATTR, appInstance, blockName), componentObject, appInstance);
                    if (elementsButNotChild === null) {
                        return;
                    }
                    elementsToPatch = Array.from(elementsButNotChild);
                }
                if (elementsToPatch.length === 0 || elementsToPatch[0] === null) {
                    if (!appInstance.e101())
                        return resolve(null);
                    throw new Error(`invalid invoking of service when boot is not complete`);
                }
                for (let i = 0; i < elementsToPatch.length; i++) {
                    const elementBindTo = elementsToPatch[i];
                    let elementBindFrom = e12();
                    if (mode === 'component') {
                        const template = componentObject.x54();
                        elementBindFrom.innerHTML = template;
                    } else {
                        if (blockName === undefined || blockName === null)
                            continue;
                        const template = componentObject.x9(blockName);
                        if (template === null)
                            continue;
                        elementBindFrom.innerHTML = template;
                    }
                    await e82(elementBindFrom, componentObject, appInstance);
                    if (elementBindTo === null)
                        continue;
                    e45(elementBindFrom, elementBindTo, appInstance, componentObject.x91());
                    /**
                     * Find all unrendered child component. This happens usually because of
                     * conditional statements such xif
                     */
                    const childComponentIds = componentObject.x91();
                    for (let k = 0; k < childComponentIds.length; k++) {
                        const childComponentId = childComponentIds[k];
                        const childComponent = e52.x53(elementBindTo, appInstance, childComponentId);
                        if (childComponent === null)
                            continue;
                        if (childComponent.innerHTML.trim() === '') {
                            await e3(childComponent, appInstance.x65().e108.x130()[childComponentId], appInstance);
                        }
                    }
                }
                resolve(null);
            } catch (error) {
                console.error(`strawberry.js: [PatchService] ` + error.message);
            }
        });
    }
    const STRAWBERRY_ATTRIBUTE = 'strawberry';
    const SERVICE_OBJECT = 'service_object';
    const FACTORY_OBJECT = 'factory_object';
    const COMPONENT_OBJECT = 'component_object';
    const COMPONENT_ELEMENT_ATTR = 'component';
    const REPEAT_ELEMENT_ATTR = 'repeat';
    const IF_ELEMENT_ATTR = 'if';
    const HIDE_ELEMENT_ATTR = 'hide';
    const SHOW_ELEMENT_ATTR = 'show';
    const CHECK_ELEMENT_ATTR = 'check';
    const STYLE_ELEMENT_ATTR = 'style';
    const MODEL_ELEMENT_ATTR = 'model';
    const DISABLE_ELEMENT_ATTR = 'disable';
    const ENABLE_ELEMENT_ATTR = 'enable';
    const CLICK_EVENT_ATTR = 'click';
    const CHANGE_EVENT_ATTR = 'change';
    const TOUCH_EVENT_ATTR = 'touch';
    const BLOCK_ELEMENT_ATTR = 'block';
    const SCOPE_ARGUMENT_KEY = '$scope';
    const BLOCK_ARGUMENT_KEY = '$block';
    const ENABLE_ARGUMENT_KEY = '$enable';
    const DISABLE_ARGUMENT_KEY = '$disable';
    const PARENT_ARGUMENT_KEY = '$parent';
    const CHILDREN_ARGUMENT_KEY = '$children';
    const PATCH_ARGUMENT_KEY = '$patch';
    const APP_ARGUMENT_KEY = '$app';
    const STRAWBERRY_ID_ATTR = 'id';
    const REPEAT_REFERENCE_TOKEN = '$$index';
    const LOCK_ID_ATTR_KEY = 'set';
    const LOCK_ID_ATTR_VALUE = '@';
    const EVENT_ELEMENT_ATTR = 'event';
    class e52 {
        /**
         * Creates a component attribute with value. Example: `xcomponent="@ComponentName"`
         */
        static a30(name, appInstance) {
            return appInstance.e46().prefix + COMPONENT_ELEMENT_ATTR + '="@' + name + '"';
        }
        /**
         * Creates an attribute with any key. Example: `xsomekeyhere`
         */
        static e109(attributeName, appInstance) {
            return appInstance.e46().prefix + attributeName;
        }
        /**
         * Creates an attribute with any key, with any value. Example: `xsomekeyhere="value"`
         */
        static x28(attributeName, appInstance, value) {
            return appInstance.e46().prefix + attributeName + '="' + value + '"';
        }
        static x24(element, prefix, attributeName) {
            const resolvedAttrName = prefix + attributeName;
            return element.getAttribute(resolvedAttrName);
        }
        static x53(element, appInstance, xid) {
            const resolvedXidAttr = appInstance.e46().prefix + STRAWBERRY_ID_ATTR + '="' + xid + '"';
            return element.querySelector(`[${resolvedXidAttr}]`);
        }
        static e13(element, appInstance, attributeName) {
            const resolvedAttrName = this.e109(attributeName, appInstance);
            return element.querySelectorAll(`[${resolvedAttrName}]`);
        }
        static e4(element, appInstance, componentObject, childComponentName) {
            if (!childComponentName.includes('@'))
                childComponentName = '@' + childComponentName;
            const resultXids = [];
            // Making sure we are only getting direct siblings
            const childIds = componentObject.x91();
            for (let i = 0; i < childIds.length; i++) {
                const childId = childIds[i];
                const xidAttr = this.x28(STRAWBERRY_ID_ATTR, appInstance, childId);
                const xidElement = element.querySelector(`[${xidAttr}]`);
                if (xidElement === null)
                    continue;
                const componentName = xidElement.getAttribute(appInstance.e46().prefix + COMPONENT_ELEMENT_ATTR);
                if (componentName === childComponentName) {
                    resultXids.push(childId);
                }
            }
            return resultXids;
        }
    }




    const a126 = 'strawberry.js: [BootError]';
    const a120 = 'strawberry.js: [BootWarning]';

    function a55(appInstance) {
        let targetElement = null;
        let templateElement = null;
        try {
            const selector = e52.x28(STRAWBERRY_ATTRIBUTE, appInstance, appInstance.a102());
            const domInstances = document.querySelectorAll(`[${selector}]`);
            if (domInstances.length === 0) {
                throw new Error(`${a126} Unable to find element ${selector}.`);
            }
            if (domInstances.length > 2) {
                throw new Error(`${a126} There are appears to be multiple instances of element ${selector}.`);
            }
            for (let i = 0; i < domInstances.length; i++) {
                const domInstance = domInstances[i];
                if (domInstance.tagName === 'TEMPLATE') {
                    templateElement = domInstance;
                    continue;
                }
                targetElement = domInstance;
            }
        } catch (error) {
            console.error(error);
        }
        if (targetElement === null || templateElement === null) {
            throw new Error();
        }
        return [targetElement, templateElement];
    }

    function e14(componentId, component, appInstance, componentTree) {
        return new Promise(async (resolve, reject) => {
            try {
                let compiledComponentHtml = '';
                // First, we'll check if component has declared template
                const componentName = e52.x24(component, appInstance.e46().prefix, COMPONENT_ELEMENT_ATTR);
                if (componentName === null) {
                    throw new Error(`${a126} a component has no component name attribute.`);
                }
                const componentAttribute = e52.x28(COMPONENT_ELEMENT_ATTR, appInstance, componentName);
                const componentSelector = `template[${componentAttribute}]`;
                const componentTemplateElements = document.querySelectorAll(componentSelector);
                if (componentTemplateElements.length === 0) {
                    throw new Error(`strawberry.js: [BootError] Unable to find Component template ${componentSelector}.`);
                }
                if (componentTemplateElements.length > 1) {
                    throw new Error(`strawberry.js: [BootError] There are appears to be multiple instances of Component template ${componentSelector}.`);
                }
                /** Creating the Component Object */
                const componentObject = new x25();
                const componentTemplateElement = componentTemplateElements[0];
                const componentImplementation = document.implementation.createHTMLDocument();
                componentImplementation.body.innerHTML = componentTemplateElement.innerHTML;
                componentObject.a127(componentId).a121(componentName);
                /** Registering the Component in the Library */
                appInstance.x76().e108.a89(componentName, componentTemplateElement.innerHTML);
                /** Registering the Component Object */
                appInstance.x65().e108.e112(componentId, componentObject);
                /** Retrieving and processing of child components **/
                const selector = e52.e109(COMPONENT_ELEMENT_ATTR, appInstance);
                const childComponents = componentImplementation.querySelectorAll(`[${selector}]`);
                for (let i = 0; i < childComponents.length; i++) {
                    const childComponent = childComponents[i];
                    const childComponentName = e52.x24(childComponent, appInstance.e46().prefix, COMPONENT_ELEMENT_ATTR);
                    if (childComponentName == null) {
                        console.warn(`${a120} a child component is declared but no name was provided`);
                        continue;
                    }
                    const childComponentId = x40(componentId, i.toString());
                    childComponent.setAttribute('xid', childComponentId);
                    componentObject.e83(childComponentName);
                    componentObject.a103(childComponentId);
                    if (componentTree.includes(childComponentName)) {
                        throw new Error(`${a126} circular dependency in component "${childComponentName}" detected: ${JSON.stringify(componentTree)}`);
                    }
                    const childComponentTree = [childComponentName, ...componentTree];
                    childComponent.innerHTML = await e14(childComponentId, childComponent, appInstance, childComponentTree);
                }
                compiledComponentHtml += componentImplementation.body.innerHTML;
                componentObject.a56(compiledComponentHtml);
                resolve(compiledComponentHtml);
            } catch (error) {
                reject(error);
            }
        });
    }

    function e31(handler, type, name) {
        return new Promise((resolve, reject) => {
            try {
                const handlerStr = handler.toString().split('{')[0];
                const matchedFn = handlerStr.match(/(?<=\().+?(?=\))/g);
                if (matchedFn === null || /[(={})]/g.test(matchedFn[0])) {
                    return resolve([]);
                }
                resolve(matchedFn[0].split(','));
            } catch (error) {
                reject(error);
            }
        });
    }

    function x32(name, appInstance) {
        /** Check if it is a Service */
        let serviceOb = appInstance.x76().e116.x99(name);
        if (serviceOb !== null)
            return 'service';
        let factorHanlder = appInstance.x76().a117.x99(name);
        if (factorHanlder !== null)
            return 'factory';
        return null;
    }

    function a33(factoryName, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                const factoryHandler = appInstance.x76().a117.x99(factoryName);
                if (factoryHandler === null) {
                    throw new Error(`${a126} unregistered factory callback ${factoryName}.`);
                }
                const args = await e31(factoryHandler, 'service', factoryName);
                const injectableArguments = [];
                for (let i = 0; i < args.length; i++) {
                    const arg = args[i];
                    if (x32(arg, appInstance) === 'service') {
                        const depService = await x34(arg, appInstance);
                        injectableArguments.push(depService);
                        continue;
                    }
                    if (x32(arg, appInstance) === 'factory') {
                        const depFactory = await a33(arg, appInstance);
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
                    throw new Error(`${a126} factory ${factoryName} must return typeof class reference.`);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    function x34(serviceName, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                let handleOb = appInstance.x65().e116.x104(serviceName);
                if (handleOb !== null) {
                    resolve(handleOb);
                    return;
                }
                const serviceLib = appInstance.x76().e116.x99(serviceName);
                if (serviceLib === null) {
                    throw new Error(`${a126} Unregistered service callback ${serviceName}.`);
                }
                const serviceHandler = serviceLib.a115;
                const args = await e31(serviceHandler, 'service', serviceName);
                handleOb = {};
                const injectableArguments = [];
                for (let i = 0; i < args.length; i++) {
                    const arg = args[i];
                    if (x32(arg, appInstance) === 'service') {
                        const depService = await x34(arg, appInstance);
                        injectableArguments.push(depService);
                        continue;
                    }
                    if (x32(arg, appInstance) === 'factory') {
                        const depFactory = await a33(arg, appInstance);
                        injectableArguments.push(depFactory);
                        continue;
                    }
                    injectableArguments.push(null);
                }
                handleOb = serviceHandler(...injectableArguments);
                if (handleOb === null) {
                    return resolve(handleOb);
                }
                appInstance.x65().e116.e112(serviceName, handleOb);
                resolve(handleOb);
            } catch (error) {
                reject(error);
            }
        });
    }
    /** This is where callback functions to components are being executed */
    function e17(componentObject, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                if (componentObject.x99() !== null) {
                    resolve();
                    return;
                }
                const componentName = componentObject.x118();
                const componentLibrary = appInstance.x76().e108;
                const componentHandler = componentLibrary.x99(componentName);
                if (componentHandler === null) {
                    throw new Error(`${a126} Unregistered component callback ${componentName}.`);
                }
                const allArguments = await e31(componentHandler, 'component', componentName);
                const scopeObject = {};
                const allChildComponentNames = componentObject.a77().map(childName => childName.substring(1, childName.length));
                const injectableArguments = [];
                for (let i = 0; i < allArguments.length; i++) {
                    const argument = allArguments[i];
                    if (argument === SCOPE_ARGUMENT_KEY) {
                        injectableArguments.push(scopeObject);
                        componentObject.a67(scopeObject);
                        continue;
                    }
                    if (argument.charAt(0) === '$') {
                        switch (argument) {
                            case BLOCK_ARGUMENT_KEY:
                                injectableArguments.push((blockName, callback) => {
                                    return e74(componentObject, appInstance, blockName, callback);
                                });
                                break;
                            case ENABLE_ARGUMENT_KEY:
                                injectableArguments.push((elementName) => {
                                    return a75(componentObject, appInstance, elementName);
                                });
                                break;
                            case DISABLE_ARGUMENT_KEY:
                                injectableArguments.push((elementName) => {
                                    return x66(componentObject, appInstance, elementName);
                                });
                                break;
                            case PATCH_ARGUMENT_KEY:
                                injectableArguments.push((elementName) => {
                                    return e29(componentObject, appInstance, elementName !== null && elementName !== void 0 ? elementName : null);
                                });
                                break;
                            case PARENT_ARGUMENT_KEY:
                                injectableArguments.push(e11(componentObject, appInstance));
                                break;
                            case APP_ARGUMENT_KEY:
                                injectableArguments.push(e2(componentObject, appInstance));
                                break;
                            case CHILDREN_ARGUMENT_KEY:
                                injectableArguments.push(a7(componentObject, appInstance));
                                break;
                            default:
                                break;
                        }
                        continue;
                    }
                    /** Service injection */
                    const service = appInstance.x76().e116.x99(argument);
                    if (service !== null) {
                        injectableArguments.push(await x34(argument, appInstance));
                        continue;
                    }
                    /** Factory injection */
                    const factory = appInstance.x76().a117.x99(argument);
                    if (factory !== null) {
                        injectableArguments.push(await x34(argument, appInstance));
                        continue;
                    }
                    /** Component Injection */
                    if (!allChildComponentNames.includes(argument)) {
                        throw new Error(`${a126} @${argument} is not a child component of ${componentName}`);
                    }
                    /** Get all children with that child component names */
                    const componentElementImplementation = e52.x53(appInstance.x92(), appInstance, componentObject.a125());
                    if (componentElementImplementation === null) {
                        console.warn(`${a120} unable to find element with xid "${componentObject.a125()}"`);
                        continue;
                    }
                    const childXids = e52.e4(componentElementImplementation, appInstance, componentObject, argument);
                    const wrapper = {};
                    for (let n = 0; n < childXids.length; n++) {
                        const childXid = childXids[n];
                        const childComponentObject = appInstance.x65().e108.x130()[childXid];
                        await e17(childComponentObject, appInstance);
                        wrapper[childXid] = childComponentObject;
                    }
                    const componentProxy = new Proxy(wrapper, {
                        get: function get(target, name) {
                            return function wrapper() {
                                const args = Array.prototype.slice.call(arguments);
                                const returns = [];
                                for (const xid in target) {
                                    const componentInstance = target[xid];
                                    const handler = componentInstance.x99();
                                    if (handler === null) {
                                        continue;
                                    }
                                    if (typeof handler === 'string' ||
                                        typeof handler === 'number' ||
                                        typeof handler === 'boolean') {
                                        returns.push(handler);
                                        continue;
                                    }
                                    if (typeof handler === 'object') {
                                        if (name in handler) {
                                            const handlerInstance = handler[name];
                                            if (handlerInstance instanceof Function) {
                                                returns.push(handlerInstance(...args));
                                            } else {
                                                returns.push(handlerInstance);
                                            }
                                            continue;
                                        } else {
                                            console.warn(`strawberry.js calling undefined member property or method "${name.toString()}" from component "${componentInstance.x118()}"`);
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
                componentObject.e98(handler);
                resolve();
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

    function a18(component, childComponentIds, appInstance) {
        for (let i = 0; i < childComponentIds.length; i++) {
            const childComponentId = childComponentIds[i];
            const element = e52.x53(component, appInstance, childComponentId);
            if (element !== null) {
                element.innerHTML = '';
            }
        }
    }

    function e12() {
        return document.implementation.createHTMLDocument().body;
    }

    function e57(bindFrom, bindTo) {
        if (bindFrom === null)
            return;
        while (bindFrom.childNodes.length > 0) {
            bindTo.appendChild(bindFrom.childNodes[0]);
        }
    }

    function e45(bindFromEl, bindToEl, appInstance, childComponentIds) {
        const temporaryChildren = {};
        for (let i = 0; i < childComponentIds.length; i++) {
            const childComponentId = childComponentIds[i];
            const childTemporaryElement = e12();
            const childActualComponent = e52.x53(bindToEl, appInstance, childComponentId);
            if (childActualComponent !== null) {
                e57(childActualComponent, childTemporaryElement);
                temporaryChildren[childComponentId] = childTemporaryElement;
            }
        }
        bindToEl.innerHTML = '';
        e57(bindFromEl, bindToEl);
        for (const childComponentId in temporaryChildren) {
            const childActualComponent = e52.x53(bindToEl, appInstance, childComponentId);
            if (childActualComponent === null)
                continue;
            e57(temporaryChildren[childComponentId], childActualComponent);
        }
    }

    function e68(element, comment) {
        if (null !== element) {
            element.innerHTML = '';
            if (element.parentNode !== null) {
                element.outerHTML = '<!-- strawberry.js: ' + element.outerHTML + ' | ' + comment + ' -->';
            }
        }
    }

    function a93(element, appInstance) {
        const lockAttrName = e52.e109(LOCK_ID_ATTR_KEY, appInstance);
        element.setAttribute(lockAttrName, LOCK_ID_ATTR_VALUE);
    }

    function a58(element, appInstance) {
        const lockAttrName = e52.e109(LOCK_ID_ATTR_KEY, appInstance);
        return (element.getAttribute(lockAttrName) !== null);
    }

    function a19(element, eventName, appInstance) {
        const lockAttrName = e52.e109(EVENT_ELEMENT_ATTR, appInstance);
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

    function a47(element, eventName, appInstance) {
        const lockAttrName = e52.e109(EVENT_ELEMENT_ATTR, appInstance);
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

    function e38(appInstance) {
        const xAppElements = e52.e13(document.body, appInstance, STRAWBERRY_ATTRIBUTE);
        let appElement = null;
        for (let i = 0; i < xAppElements.length; i++) {
            const element = xAppElements[i];
            if (element.tagName !== 'TEMPLATE') {
                appElement = element;
            }
        }
        if (appElement === null) {
            throw new Error(`strawberry.js no live app element found for ${appInstance.a102()}`);
        }
        return appElement;
    }

    function x1(attributeWithValue, componentObject, appInstance) {
        const componentChildIds = componentObject.x91();
        let selector = '';
        for (let i = 0; i < componentChildIds.length; i++) {
            const childId = componentChildIds[i];
            const childXidAttrName = e52.x28(STRAWBERRY_ID_ATTR, appInstance, childId);
            selector += ':not([' + childXidAttrName + '])';
        }
        selector += ` > [${attributeWithValue}]`;
        if (componentChildIds.length === 0) {
            const xidAttrName = e52.x28(STRAWBERRY_ID_ATTR, appInstance, componentObject.a125());
            selector = `[${xidAttrName}] [${attributeWithValue}]`;
        }
        const componentElement = e52.x53(e38(appInstance), appInstance, componentObject.a125());
        if (componentElement === null)
            return null;
        return componentElement.querySelectorAll(selector);
    }

    function a6(componentObject, appInstance) {
        const temporaryElement = e12();
        const componentElement = e52.x53(e38(appInstance), appInstance, componentObject.a125());
        if (componentElement === null)
            return null;
        temporaryElement.innerHTML = componentElement.innerHTML;
        const componentChildIds = componentObject.x91();
        for (let i = 0; i < componentChildIds.length; i++) {
            const componentChildId = componentChildIds[i];
            const childComponentElement = e52.x53(temporaryElement, appInstance, componentChildId);
            if (childComponentElement !== null) {
                childComponentElement.innerHTML = '';
            }
        }
        return temporaryElement.innerHTML;
    }
    const x40 = (existingComponentId, currentId) => {
        return existingComponentId + '.' + currentId;
    };
    const a48 = (Ids) => {
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
    class x41 {
        constructor() {
            this.a110 = {};
        }
        e112(key, component) {
            this.a110[key] = component;
        }
        x130() {
            return this.a110;
        }
    }
    class a59 {
        constructor() {
            this.a110 = {};
        }
        e112(serviceName, handleOb) {
            if (!(serviceName in this.a110))
                return null;
            this.a110[serviceName] = handleOb;
        }
        x104(serviceName) {
            if (!(serviceName in this.a110))
                return null;
            return this.a110[serviceName];
        }
    }


    /**
     * The App library contains all the registered Components, Services,
     * and Factories declared from the frontend.
     */
    class a94 {
        constructor() {
            this.e108 = new x41;
            this.e116 = new a59;
        }
    }
    class x25 {
        constructor() {
            this._componentId = 'unset';
            this._componentName = 'unset';
            this._componentChildNames = [];
            this._componentChildIds = [];
            this._componentHandler = null;
            this._componentHtmlTemplate = '';
            this._scopeRefObject = null;
            this._namedElementsRegistry = {};
        }
        a127(id) {
            this._componentId = id;
            return this;
        }
        a121(name) {
            this._componentName = name;
            return this;
        }
        a125() {
            return this._componentId;
        }
        x118() {
            return this._componentName;
        }
        e83(name) {
            if (!this._componentChildNames.includes(name)) {
                this._componentChildNames.push(name);
            }
        }
        a103(id) {
            if (!this._componentChildIds.includes(id)) {
                this._componentChildIds.push(id);
            }
        }
        a77() {
            return this._componentChildNames;
        }
        x91() {
            return this._componentChildIds;
        }
        e98(handler) {
            if (this._componentHandler === null) {
                this._componentHandler = handler;
            }
        }
        x99() {
            return this._componentHandler;
        }
        a67(scopeObject) {
            if (this._scopeRefObject === null) {
                this._scopeRefObject = scopeObject;
            }
        }
        e69() {
            return this._scopeRefObject;
        }
        a20(name, state, template) {
            if (this._namedElementsRegistry.hasOwnProperty(name))
                return null;
            if (state === null)
                return null;
            this._namedElementsRegistry[name] = {
                _namedElementState: state,
                _namedElementTemplate: template
            };
        }
        e15(name) {
            if (!this._namedElementsRegistry.hasOwnProperty(name))
                return null;
            return this._namedElementsRegistry[name]._namedElementState;
        }
        x9(name) {
            if (!this._namedElementsRegistry.hasOwnProperty(name))
                return null;
            return this._namedElementsRegistry[name]._namedElementTemplate;
        }
        e16(name, state) {
            if (!this._namedElementsRegistry.hasOwnProperty(name))
                return;
            this._namedElementsRegistry[name]._namedElementState = state;
        }
        a56(html) {
            this._componentHtmlTemplate = html;
        }
        x54() {
            return this._componentHtmlTemplate;
        }
    }
    /**
     * Serves as a proxy or intermediary for interacting with a HTML document implementation,
     * abstract the details of creating, modifying, or managing documents.
     */
    class x5 {
        constructor(name) {
            this.a70 = document.implementation.createHTMLDocument(name);
        }
    }
    /**
     * The `StrawberryElement` class provides a wrapper around the Element object,
     * offering additional abstraction for managing states, scope, and other
     * non-default features.
     */
    class x39 {
        /**
         * @param element - The Element
         * @param pcount - The number of iteration of parent created
         */
        constructor(element, pcount = null) {
            this.$element = element;
            this.e84 = null;
            this.a105(pcount !== null && pcount !== void 0 ? pcount : 1);
        }
        /** Wraps the parent element within `StrawberryElement` object */
        a105(count) {
            const parentElement = this.$element.parentElement;
            if (count > 3 || parentElement === null)
                return;
            this.$parent = new x39(parentElement, count++);
        }
        /** Retrieves the $element */
        get() {
            return this.$element;
        }
        /** Retrieves the state */
        getState() {
            return this.e84;
        }
        setState(state) {
            if (state === null)
                return;
            this.e84 = state;
        }
        setScope(scope) {
            this.a122 = scope;
        }
        getScope() {
            return this.a122;
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
            const classes = this.listClass();
            for (var i = 0; i < classes.length; i++) {
                let aclass = classes[i];
                (aclass === className) ?
                this.removeClass(className):
                    this.addClass(className);
            }
        }
    }
    /**
     * @class Resolver
     * Resolves all given expression
     */

    class e113 {
        /**
         * @method _resolveExpression
         * Resolves an expression based on a given object
         * @param object baseObj
         * @param string expression
         *
         * @returns the value of the resolved expression
         */
        a42(baseObj, expression, element = null) {
            // We first determine what type of expression we will need to resolve.
            // This will be based on the structure of the operation
            let resolveType = this.x71(expression);
            // This is where the actual resolve process takes place
            return this.x123(baseObj, expression, resolveType, element);
        }
        /**
         * @method _getResolveType
         * Determines the type of an expression
         * @param string expression
         * @returns type of expression
         *
         * @NOTE: the expression should always have to be a string!
         */
        x71(expression) {
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
        x123(scopeObj, expression, resolveType, element = null) {
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
                    return this.x106(scopeObj, expression);
                    break;
                    // CASE: FUNCTION
                case 'function':
                    /**
                     * @function _invokeFunction
                     * Invokes/calls a given function based on the function expression
                     *
                     * @param object refObject - The object where the function to invoke is a member of
                     * @param object argScope - The object where we can reference the argument expression
                     * of the function to invoke
                     * @param string functionExpression - The function expression, for example
                     * myFunction(arg)
                     */
                    let _invokeFunction = (refObject, argScope, functionExpression) => {
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
                                argObj.push(this.a42(argScope, splitFunctionArguments[i]));
                            }
                            if (element !== null) {
                                argObj.push(new x39(element));
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
                            argObj.push(new x39(element));
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
                        let refObject = this.a42(scopeObj, this.x35(funcStruct[0]));
                        let funcExpression = expression.split('.').slice(((expressionTest.length) - 1)).join('.');
                        return _invokeFunction(refObject, scopeObj, funcExpression);
                    }
                    if (!scopeObj.hasOwnProperty(funcStruct[0])) {
                        // if (strawberry.debug) {
                        //     console.warn('strawberry.js: Unable to resolve $scope.'+expression);
                        // }
                        return '';
                    }
                    return _invokeFunction(scopeObj, scopeObj, expression);
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
                        return isNotTheSame(this.a42(scopeObj, comparables[0].trim()), this.a42(scopeObj, comparables[1].trim()));
                    } else if (expression.includes('==')) {
                        let comparables = expression.split('==');
                        return isTheSame(this.a42(scopeObj, comparables[0].trim()), this.a42(scopeObj, comparables[1].trim()));
                    } else if (expression.includes('is not ')) {
                        let comparables = expression.split('is not');
                        return isNotTheSame(this.a42(scopeObj, comparables[0].trim()), this.a42(scopeObj, comparables[1].trim()));
                    } else if (expression.includes('is ')) {
                        let comparables = expression.split('is');
                        return isTheSame(this.a42(scopeObj, comparables[0].trim()), this.a42(scopeObj, comparables[1].trim()));
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
                            let left = this.a42(scopeObj, exp[0].trim());
                            var right = this.a42(scopeObj, exp[1].trim());
                            finalExpression = left + operations[i] + right;
                        }
                    }
                    return eval(finalExpression);
                    break;
            }
        }
        x106(scopeObj, objectExpression) {
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
        x35(expression) {
            let expressionPieces = expression.split('.');
            if (expressionPieces.length < 2)
                return '$scope';
            expressionPieces.pop();
            return expressionPieces.join('.');
        }
        e43(expression) {
            let expressionPieces = expression.split('.');
            return expressionPieces[expressionPieces.length - 1];
        }
        a21(baseObj, objExpression) {
            let parentObjExpression = this.x35(objExpression);
            return this.a42(baseObj, parentObjExpression);
        }
    } {};



    class x36 {
        constructor() {
            this.e37 = [];
        }
        onReady(callBack) {
            this.e37.push(callBack);
            return (this.e37.length) - 1;
        }
    }
    /**
     * The internal version of the Strawberry application
     */
    class a78 {
        constructor({
            x128,
            x131
        }) {
            this.e129 = new x5(x128);
            this.e107 = new x100;
            this.e95 = new a94;
            this.e79 = {
                prefix: 'x'
            };
            this.x131 = x131;
            this.x128 = x128;
            this.x60 = new x36;
            this.e96 = false;
            this.x72 = false;
        }
        a125() {
            return this.x131;
        }
        /**
         * Returns the name of the strawberry app instance
         */
        a102() {
            return this.x128;
        }
        /**
         * Sets the raw HTML body of the Strawberry app instance
         * @param content
         */
        a97(content) {
            this.e129.a70.body.innerHTML = content;
        }
        x92() {
            return this.e129.a70.body;
        }
        /**
         * Sets the Configuration of the Strawberry app instance
         * @param configuration
         */
        x49(configuration) {
            this.e79 = configuration;
        }
        e46() {
            return this.e79;
        }
        /**
         * Retreieves the App Library
         * @see x100
         */
        x76() {
            return this.e107;
        }
        /**
         * Retreieves the App Registry
         * @see a94
         */
        x65() {
            return this.e95;
        }
        a73() {
            this.e96 = true;
            this.x60.e37.forEach(async (callback) => {
                await Promise.resolve(callback());
            });
            this.x72 = true;
        }
        a27() {
            return this.x60;
        }
        x119() {
            return this.e96;
        }
        e101() {
            return this.x72;
        }
    }

    function x26(targetElement, componentObject, appInstance) {
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
                        const scopeObject = componentObject.e69();
                        if (scopeObject === null)
                            return;
                        let resolvedExpression = new e113().a42(scopeObject, allMatchedData[i].trim());
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


    function a85(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allBlockElements = e52.e13(targetElement, appInstance, BLOCK_ELEMENT_ATTR);
                for (let i = 0; i < allBlockElements.length; i++) {
                    const element = allBlockElements[i];
                    const blockElName = e52.x24(element, appInstance.e46().prefix, BLOCK_ELEMENT_ATTR);
                    if (blockElName === null)
                        continue;
                    /** Retrieving and registering the template */
                    const componentTemplate = componentObject.x54();
                    const tempCompEl = e12();
                    tempCompEl.innerHTML = componentTemplate;
                    const selector = e52.x28(BLOCK_ELEMENT_ATTR, appInstance, blockElName);
                    const tempBlockEl = tempCompEl.querySelector(`[${selector}]`);
                    if (tempBlockEl === null)
                        continue;
                    if (null === componentObject.e15(blockElName)) {
                        componentObject.a20(blockElName, 'registered', tempBlockEl.innerHTML);
                    }
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }



    function e80(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allCheckedElements = e52.e13(targetElement, appInstance, CHECK_ELEMENT_ATTR);
                for (let i = 0; i < allCheckedElements.length; i++) {
                    const element = allCheckedElements[i];
                    if (a58(element, appInstance))
                        continue;
                    const argument = e52.x24(element, appInstance.e46().prefix, CHECK_ELEMENT_ATTR);
                    const scopeObject = componentObject.e69();
                    if (scopeObject === null || argument === null)
                        continue;
                    const evalauted = new e113().a42(scopeObject, argument);
                    if (typeof evalauted === 'boolean') {
                        evalauted ? element.setAttribute('checked', '') : element.removeAttribute('checked');
                    }
                    a93(element, appInstance);
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }

    function x61(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allDisabledElements = e52.e13(targetElement, appInstance, DISABLE_ELEMENT_ATTR);
                for (let i = 0; i < allDisabledElements.length; i++) {
                    const element = allDisabledElements[i];
                    const elementName = e52.x24(element, appInstance.e46().prefix, DISABLE_ELEMENT_ATTR);
                    if (elementName === null)
                        continue;
                    if (null === componentObject.e15(elementName)) {
                        componentObject.a20(elementName, 'disabled', '');
                    }
                    element.disabled = (componentObject.e15(elementName) === 'disabled');
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }

    function x62(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allEnabledElements = e52.e13(targetElement, appInstance, ENABLE_ELEMENT_ATTR);
                for (let i = 0; i < allEnabledElements.length; i++) {
                    const element = allEnabledElements[i];
                    const elementName = e52.x24(element, appInstance.e46().prefix, ENABLE_ELEMENT_ATTR);
                    if (elementName === null)
                        continue;
                    if (null === componentObject.e15(elementName)) {
                        componentObject.a20(elementName, 'enabled', '');
                    }
                    element.disabled = (componentObject.e15(elementName) === 'disabled');
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }



    function e86(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                /**
                 * This function adds event listener to elements which is bound to a function
                 * within the component scope
                 */
                const e114 = function(scopeObject, eventElement, fnExpression, eventType) {
                    if (new e113().x71(fnExpression) !== 'function')
                        return;
                    eventElement.addEventListener(eventType, () => {
                        new e113().a42(scopeObject, fnExpression, eventElement);
                    });
                };
                const events = [{
                        type: 'click',
                        attr: CLICK_EVENT_ATTR
                    },
                    {
                        type: 'change',
                        attr: CHANGE_EVENT_ATTR
                    },
                    {
                        type: 'keyup',
                        attr: TOUCH_EVENT_ATTR
                    }
                ];
                for (let i = 0; i < events.length; i++) {
                    const event = events[i];
                    const allEventElements = e52.e13(targetElement, appInstance, event.attr);
                    for (let k = 0; k < allEventElements.length; k++) {
                        const element = allEventElements[k];
                        const fnExpression = e52.x24(element, appInstance.e46().prefix, event.attr);
                        if (a19(element, event.type, appInstance))
                            continue;
                        const scopeObject = componentObject.e69();
                        if (scopeObject === null || fnExpression == null)
                            continue;
                        e114(componentObject.e69(), element, fnExpression, event.type);
                        a47(element, event.type, appInstance);
                    }
                }
                resolve(null);
            } catch (error) {
                reject(null);
            }
        });
    }



    function e22(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                /** Retrieving all elements with ifs conditional */
                const ifsElements = e52.e13(targetElement, appInstance, IF_ELEMENT_ATTR);
                for (let i = 0; i < ifsElements.length; i++) {
                    const ifsElement = ifsElements[i];
                    if (!a58(ifsElement, appInstance)) {
                        const ifsArgument = e52.x24(ifsElement, appInstance.e46().prefix, IF_ELEMENT_ATTR);
                        const scopeObject = componentObject.e69();
                        if (scopeObject === null || ifsArgument === null)
                            continue;
                        const resolvedIfsValue = new e113().a42(scopeObject, ifsArgument);
                        if (typeof resolvedIfsValue === 'boolean' && !resolvedIfsValue) {
                            e68(ifsElement, 'false');
                        }
                        a93(ifsElement, appInstance);
                    }
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }


    function e81(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                /**
                 * This function attemps to add an undefined model as part of the scope.
                 * For example, if you assign `xmodel="user.firstName"`, but firstName
                 * is not defined in $scope.user, then this function will add firstName
                 * as member property of $scope.user automatically
                 */
                const e50 = (scopeObject, modelExpression, modelValue) => {
                    const parentObj = new e113().a21(scopeObject, modelExpression);
                    const childObjExpression = new e113().e43(modelExpression);
                    if (undefined !== parentObj)
                        parentObj[childObjExpression] = modelValue;
                };
                const x51 = (modelElement, modelState) => {
                    (typeof modelState == 'boolean' && modelState) ?
                    modelElement.setAttribute('checked', ''):
                        modelElement.removeAttribute('checked');
                };
                const allModelElements = e52.e13(targetElement, appInstance, MODEL_ELEMENT_ATTR);
                for (let i = 0; i < allModelElements.length; i++) {
                    const element = allModelElements[i];
                    if (element === null)
                        continue;
                    const argument = e52.x24(element, appInstance.e46().prefix, MODEL_ELEMENT_ATTR);
                    const myScopeObject = componentObject.e69();
                    if (myScopeObject === null || argument === null)
                        continue;
                    const evaluated = new e113().a42(myScopeObject, argument);
                    let isValueStringType = true;
                    if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                        if ((element instanceof HTMLInputElement)) {
                            const elementType = element.type;
                            if (elementType === 'radio' || elementType === 'checkbox') {
                                isValueStringType = false;
                                (evaluated === undefined) ?
                                e50(myScopeObject, argument, false):
                                    x51(element, evaluated);
                            }
                            if (elementType === 'text' || elementType === 'password' || element.type === 'email') {
                                (evaluated === undefined) ?
                                e50(myScopeObject, argument, element.value):
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
                                    e50(myScopeObject, argument, inputDate);
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
                                    e50(myScopeObject, argument, inputDate);
                                }
                                const hours = (inputDate.getHours() < 10) ? '0' + inputDate.getHours() : inputDate.getHours();
                                const minutes = (inputDate.getMinutes() < 10) ? '0' + inputDate.getMinutes() : inputDate.getMinutes();
                                const elementValue = hours + ':' + minutes;
                                element.value = elementValue;
                            }
                        }
                        if ((element instanceof HTMLSelectElement)) {
                            (evaluated === undefined) ?
                            e50(myScopeObject, argument, element.value):
                                element.value = evaluated;
                        }
                        element.addEventListener('change', (event) => {
                            const target = event.target;
                            if (target instanceof HTMLInputElement) {
                                if (target.type === 'date') {
                                    const newevaluated = new e113().a42(myScopeObject, argument);
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
                                    e50(myScopeObject, argument, newevaluated);
                                    return;
                                }
                                if (target.type === 'time') {
                                    const newevaluated = new e113().a42(myScopeObject, argument);
                                    const [shour, sminute] = target.value.split(':');
                                    const hour = parseInt(shour);
                                    const minute = parseInt(sminute);
                                    if (!(newevaluated instanceof Date)) {
                                        throw new Error(`strawberry.js: [RenderError] Models assigned to Date and/or Time elements must be instance of Date object`);
                                    }
                                    newevaluated.setHours(hour);
                                    newevaluated.setMinutes(minute);
                                    e50(myScopeObject, argument, newevaluated);
                                    return;
                                }
                                e50(myScopeObject, argument, (isValueStringType) ? target.value : target.checked);
                            }
                            if (target instanceof HTMLSelectElement) {
                                e50(myScopeObject, argument, target.value);
                            }
                        });
                    }
                    if (element.tagName === 'TEXTAREA' && (element instanceof HTMLTextAreaElement)) {
                        (evaluated === undefined) ?
                        e50(myScopeObject, argument, element.value):
                            element.value = evaluated;
                        element.addEventListener('change', () => {
                            e50(myScopeObject, argument, element.value);
                        });
                    }
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }




    /** Converts repeat expression into two entites: refObjName and aliasObjName  */
    function e10(expression) {
        if (expression.includes('until '))
            return [REPEAT_REFERENCE_TOKEN, expression.split('until')[1].trim()];
        return [
            expression.split(' as ')[0].trim(),
            expression.split(' as ')[1].trim()
        ];
    }

    function e87(targetElement, componentObject, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                /** Retrieving all repeatable elements */
                const repeatableElements = e52.e13(targetElement, appInstance, REPEAT_ELEMENT_ATTR);
                const scopeObject = componentObject.e69();
                if (scopeObject === null)
                    return resolve(null);
                /** Looping through repeatable elements */
                for (let i = 0; i < repeatableElements.length; i++) {
                    let repeatableElement = repeatableElements[i];
                    let htmlTemplate = repeatableElement.innerHTML;
                    repeatableElement.innerHTML = '';
                    let expression = e52.x24(repeatableElement, appInstance.e46().prefix, REPEAT_ELEMENT_ATTR);
                    if (expression === null)
                        continue;
                    let [refObjName, aliasObjName] = e10(expression);
                    if (refObjName === REPEAT_REFERENCE_TOKEN) {
                        // This creates a new object that we can loop through
                        let repetitions = (new e113().a42(scopeObject, aliasObjName));
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
                    const repeatableObject = new e113().a42(scopeObject, refObjName);
                    if (undefined !== repeatableObject && null !== repeatableObject) {
                        let j = 0;
                        for (const [key, value] of Object.entries(repeatableObject)) {
                            // Creating an invidual component for each repititions
                            let childTempComponent = new x25();
                            childTempComponent.a67({
                                $parent: scopeObject,
                                $index: j++,
                                [aliasObjName]: repeatableObject[key]
                            });
                            const childRepeatElement = e12();
                            childRepeatElement.innerHTML = htmlTemplate;
                            await e82(childRepeatElement, childTempComponent, appInstance, true);
                            e57(childRepeatElement, repeatableElement);
                        }
                    }
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }



    function a88(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allStyleElements = e52.e13(targetElement, appInstance, STYLE_ELEMENT_ATTR);
                for (let i = 0; i < allStyleElements.length; i++) {
                    const element = allStyleElements[i];
                    if (a58(element, appInstance))
                        continue;
                    const argument = e52.x24(element, appInstance.e46().prefix, STYLE_ELEMENT_ATTR);
                    const scopeObject = componentObject.e69();
                    if (scopeObject === null || argument === null)
                        continue;
                    let evaulated = new e113().a42(scopeObject, argument);
                    if (evaulated !== null && evaulated !== '' && evaulated !== undefined) {
                        element.classList.add(evaulated);
                    }
                    a93(element, appInstance);
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }




    function e82(targetElement, componentObject, appInstance, skipEvents = false) {
        return new Promise(async (resolve, reject) => {
            try {
                await e87(targetElement, componentObject, appInstance);
                await e22(targetElement, componentObject, appInstance);
                await x26(targetElement, componentObject, appInstance);
                await e80(targetElement, componentObject, appInstance);
                await a88(targetElement, componentObject, appInstance);
                await e81(targetElement, componentObject, appInstance);
                await x61(targetElement, componentObject, appInstance);
                await x62(targetElement, componentObject, appInstance);
                await a85(targetElement, componentObject, appInstance);
                if (!skipEvents) {
                    await e86(targetElement, componentObject, appInstance);
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }




    /**
     * Stores all created StrawberryApp instances
     */
    const StrawberryAppInstances = [];
    /**
     * This value increments, serving as the unique id
     * of the StrawberryApp instance.
     */
    let instanceId = 0;
    /**
     * Attached to the window object to provide a simple interface to interact with
     * the Strawberry framework code. It allows for creating instances of the app, managing
     * components, and more. This aims to simplify and provide a clean and intuitive
     * interface for working with the application.
     */
    const AppPublicAPI = {
        create: (name, config) => {
            const appInstance = new a78({
                x131: instanceId++,
                x128: name
            });
            if (config !== undefined) {
                appInstance.x49(config);
            }
            StrawberryAppInstances.push(appInstance);
            return {
                component: (name, handler) => {
                    appInstance.x76().e108.e98(`@${name}`, handler);
                },
                factory: (name, handler) => {
                    appInstance.x76().a117.e112(name, handler);
                },
                service: (name, handler) => {
                    appInstance.x76().e116.e112(name, handler);
                }
            };
        }
    };
    const strawberry = window['strawberry'] = AppPublicAPI;
    DOMHelper.ready(() => {
        StrawberryAppInstances.forEach(async (appInstance) => {
            try {
                const [appElement, templateElement] = a55(appInstance);
                /** We'll add the App Template HTML content to the appInstance object */
                appInstance.a97(templateElement.innerHTML);
                /** Compiling all components in the App Template, and their dependencies.*/
                const xcomponent = e52.e109(COMPONENT_ELEMENT_ATTR, appInstance);
                let componentEls = appInstance.x92().querySelectorAll(`[${xcomponent}]`);
                let componentId = 0;
                for (let i = 0; i < componentEls.length; i++) {
                    /** Component Element */
                    const componentEl = componentEls[i];
                    const componentName = e52.x24(componentEl, appInstance.e46().prefix, COMPONENT_ELEMENT_ATTR);
                    if (componentName === null) {
                        continue;
                    }
                    /** Component IDs would have to be embedded to the xid attribute */
                    const xid = appInstance.a125().toString() + '.' + (componentId++).toString();
                    const xidAttr = e52.e109('id', appInstance);
                    componentEl.setAttribute(xidAttr, xid);
                    /**
                     * Retrieving component templates, as well as the templates of their dependencies,
                     * and the dependencies of their dependencies.
                     */
                    componentEl.innerHTML = await e14(xid, componentEl, appInstance, [componentName]);
                }
                const componentObjects = appInstance.x65().e108.x130();
                const componentIdsList = [];
                for (const componentId in componentObjects) {
                    componentIdsList.push(componentId);
                    await e17(componentObjects[componentId], appInstance);
                }
                for (const componentId in componentObjects) {
                    const componentTemporaryElement = e12();
                    componentTemporaryElement.innerHTML = componentObjects[componentId].x54();
                    a18(componentTemporaryElement, componentObjects[componentId].x91(), appInstance);
                    componentObjects[componentId].a56(componentTemporaryElement.innerHTML);
                }
                /** Rendering phase */
                for (const componentId in componentObjects) {
                    const targetElement = e52.x53(appInstance.x92(), appInstance, componentId);
                    /**
                     * This happens for the following circumstances:
                     * - When the component is added inside an xif element
                     */
                    if (targetElement === null)
                        continue;
                    const temporaryElement = e12();
                    temporaryElement.innerHTML = targetElement.innerHTML;
                    a18(temporaryElement, componentObjects[componentId].x91(), appInstance);
                    await e82(temporaryElement, componentObjects[componentId], appInstance);
                    e45(temporaryElement, targetElement, appInstance, componentObjects[componentId].x91());
                }
                e57(appInstance.x92(), appElement);
                appInstance.a73();
            } catch (error) {
                console.error(error);
            }
        });
    });
})();