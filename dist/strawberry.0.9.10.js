/*
==========================================
Strawberry JS (Beta Version 0.9.10)
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
    class e45 {
        constructor() {
            this.x112 = {};
        }
        /** Registers a template */
        a91(name, template) {
            this.a126(name);
            if (this.x112[name].x113 !== null)
                return;
            this.x112[name].x113 = template;
        }
        /** Registers a callback handler */
        x100(name, handler) {
            this.a126(name);
            if (this.x112[name].x117 !== null)
                return;
            this.x112[name].x117 = handler;
        }
        /** Retrieves the template */
        a92(name) {
            if (!(name in this.x112))
                return null;
            return this.x112[name].x113;
        }
        /** Retrievs the handler */
        e101(name) {
            if (!(name in this.x112))
                return null;
            return this.x112[name].x117;
        }
        a126(name) {
            if (!(name in this.x112)) {
                this.x112[name] = {
                    x113: null,
                    x117: null
                };
            }
        }
    }
    class TypeofFactory {}
    /**
     * Registers and stores all the Factory callbacks/handlers
     */
    class e64 {
        constructor() {
            this.x112 = {};
        }
        /** Register a new callback/handler */
        e114(name, handler) {
            if (handler === null)
                return;
            this.x112[name] = {
                x117: handler
            };
        }
        /** Retrievs a handler */
        e101(name) {
            if (!(name in this.x112))
                return null;
            return this.x112[name].x117;
        }
    }
    /**
     * Registers and stores all the Service callbacks/handlers
     */
    class e75 {
        constructor() {
            this.x112 = {};
        }
        /** Register a new callback/handler */
        e114(name, handler) {
            if (handler === null)
                return;
            this.x112[name] = {
                x117: handler
            };
        }
        /** Retrievs a handler */
        e101(name) {
            if (!(name in this.x112))
                return null;
            return this.x112[name];
        }
    }
    /**
     * Registers and stores all the Service callbacks/handlers
     */
    class x65 {
        constructor() {
            this.x112 = {};
        }
        /** Register a new callback/handler */
        e114(name, handler) {
            if (handler === null)
                return;
            this.x112[name] = {
                x117: handler
            };
        }
        /** Retrievs a handler */
        e101(name) {
            if (!(name in this.x112))
                return null;
            return this.x112[name];
        }
    }




    /**
     * The App library contains all the usable Components, Services,
     * and Factories declared from the frontend.
     */
    class a102 {
        constructor() {
            this.e110 = new e45;
            this.e118 = new x65;
            this.x119 = new e64;
            this.a127 = new e75;
        }
    }

    function e2(componentObject, appInstance) {
        return appInstance.x28();
    }



    function e76(componentObject, appInstance, blockName, callback) {
        const blockAttrNameAndValue = x53.e29(BLOCK_ELEMENT_ATTR, appInstance, blockName);
        const componentElement = x53.x54(a38(appInstance), appInstance, componentObject.x128());
        if (componentElement === null) {
            throw new Error('strawberry.js unknown component element');
        }
        const allBlockElements = componentElement.querySelectorAll(`[${blockAttrNameAndValue}]`);
        for (let i = 0; i < allBlockElements.length; i++) {
            const element = allBlockElements[i];
            const strawberryElement = new a39(element);
            callback(strawberryElement);
        }
    }

    function e8(componentObject, appInstance) {
        return {
            get: (childName) => {
                if (childName.charAt(0) !== '@')
                    childName = '@' + childName;
                let childComponentObject = null;
                const childIds = componentObject.x93();
                for (let i = 0; i < childIds.length; i++) {
                    const childId = childIds[i];
                    const childComponent = appInstance.e66().e110.e133()[childId];
                    if (childComponent.x120() === childName) {
                        childComponentObject = childComponent;
                        break;
                    }
                }
                if (childComponentObject === null)
                    return null;
                return childComponentObject.e101();
            }
        };
    }


    function x9(componentObject, appInstance, elementName, state) {
        try {
            const elementState = componentObject.e16(elementName);
            if (elementState === null) {
                throw new Error('unregistered componenet member named "' + elementName + '"');
            }
            if (elementState === state)
                return;
            const allDisabledElements = x1(x53.e29(DISABLE_ELEMENT_ATTR, appInstance, elementName), componentObject, appInstance);
            if (allDisabledElements === null)
                return;
            const allElements = Array.from(allDisabledElements);
            const allEnabledElements = x1(x53.e29(ENABLE_ELEMENT_ATTR, appInstance, elementName), componentObject, appInstance);
            if (allEnabledElements === null)
                return;
            allEnabledElements.forEach(allEnabledElement => {
                allElements.push(allEnabledElement);
            });
            for (let i = 0; i < allElements.length; i++) {
                const element = allElements[i];
                element.disabled = (state === 'disabled');
            }
            componentObject.e17(elementName, state);
        } catch (error) {
            console.error(`strawberry.js: [DisablerService] ` + error.message);
        }
    }

    function e67(componentObject, appInstance, elementName) {
        try {
            x9(componentObject, appInstance, elementName, 'disabled');
        } catch (error) {
            console.error(`strawberry.js: [EnablerService] ` + error.message);
        }
    }

    function x77(componentObject, appInstance, elementName) {
        try {
            x9(componentObject, appInstance, elementName, 'enabled');
        } catch (error) {
            console.error(`strawberry.js: [EnablerService] ` + error.message);
        }
    }

    function a12(componentObject, appInstance) {
        class x24 {
            constructor(id) {
                this.id = id;
                const grandParentId = id.substring(0, (id.length - 2));
                const registry = appInstance.e66().e110.e133();
                if (!registry.hasOwnProperty(grandParentId))
                    this.$parent = null;
                if (grandParentId !== '0')
                    this.$parent = new x24(grandParentId);
            }
            get() {
                return registry[parentId].e101();
            }
        }
        const parentId = componentObject.x128().substring(0, componentObject.x128().length - 2);
        const registry = appInstance.e66().e110.e133();
        if (!registry.hasOwnProperty(parentId)) {
            return null;
        }
        return new x24(parentId);
    }



    function a3(elementToBindTo, componentObject, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                const elementBindFrom = x13();
                elementBindFrom.innerHTML = componentObject.x55();
                await a84(elementBindFrom, componentObject, appInstance);
                const childComponentIds = componentObject.x93();
                for (let i = 0; i < childComponentIds.length; i++) {
                    const childComponentId = childComponentIds[i];
                    const childComponent = x53.x54(elementBindFrom, appInstance, childComponentId);
                    if (childComponent !== null) {
                        await a3(childComponent, appInstance.e66().e110.e133()[childComponentId], appInstance);
                    }
                }
                a46(elementBindFrom, elementToBindTo, appInstance, componentObject.x93());
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }

    function x30(componentObject, appInstance, blockName) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!appInstance.x121()) {
                    throw new Error(`invalid invoking of service when boot is not ready`);
                }
                let mode = 'component';
                let elementsToPatch = [x53.x54(a38(appInstance), appInstance, componentObject.x128())];
                if (blockName !== undefined && blockName !== null) {
                    mode = 'block';
                    const elementsButNotChild = x1(x53.e29(BLOCK_ELEMENT_ATTR, appInstance, blockName), componentObject, appInstance);
                    if (elementsButNotChild === null) {
                        return;
                    }
                    elementsToPatch = Array.from(elementsButNotChild);
                }
                if (elementsToPatch.length === 0 || elementsToPatch[0] === null) {
                    if (!appInstance.e103())
                        return resolve(null);
                    throw new Error(`invalid invoking of service when boot is not complete`);
                }
                for (let i = 0; i < elementsToPatch.length; i++) {
                    const elementBindTo = elementsToPatch[i];
                    let elementBindFrom = x13();
                    if (mode === 'component') {
                        const template = componentObject.x55();
                        elementBindFrom.innerHTML = template;
                    } else {
                        if (blockName === undefined || blockName === null)
                            continue;
                        const template = componentObject.e10(blockName);
                        if (template === null)
                            continue;
                        elementBindFrom.innerHTML = template;
                    }
                    await a84(elementBindFrom, componentObject, appInstance);
                    if (elementBindTo === null)
                        continue;
                    a46(elementBindFrom, elementBindTo, appInstance, componentObject.x93());
                    /**
                     * Find all unrendered child component. This happens usually because of
                     * conditional statements such xif
                     */
                    const childComponentIds = componentObject.x93();
                    for (let k = 0; k < childComponentIds.length; k++) {
                        const childComponentId = childComponentIds[k];
                        const childComponent = x53.x54(elementBindTo, appInstance, childComponentId);
                        if (childComponent === null)
                            continue;
                        if (childComponent.innerHTML.trim() === '') {
                            await a3(childComponent, appInstance.e66().e110.e133()[childComponentId], appInstance);
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
    class x53 {
        /**
         * Creates a component attribute with value. Example: `xcomponent="@ComponentName"`
         */
        static e31(name, appInstance) {
            return appInstance.x47().prefix + COMPONENT_ELEMENT_ATTR + '="@' + name + '"';
        }
        /**
         * Creates an attribute with any key. Example: `xsomekeyhere`
         */
        static x111(attributeName, appInstance) {
            return appInstance.x47().prefix + attributeName;
        }
        /**
         * Creates an attribute with any key, with any value. Example: `xsomekeyhere="value"`
         */
        static e29(attributeName, appInstance, value) {
            return appInstance.x47().prefix + attributeName + '="' + value + '"';
        }
        static a25(element, prefix, attributeName) {
            const resolvedAttrName = prefix + attributeName;
            return element.getAttribute(resolvedAttrName);
        }
        static x54(element, appInstance, xid) {
            const resolvedXidAttr = appInstance.x47().prefix + STRAWBERRY_ID_ATTR + '="' + xid + '"';
            return element.querySelector(`[${resolvedXidAttr}]`);
        }
        static e14(element, appInstance, attributeName) {
            const resolvedAttrName = this.x111(attributeName, appInstance);
            return element.querySelectorAll(`[${resolvedAttrName}]`);
        }
        static e4(element, appInstance, componentObject, childComponentName) {
            if (!childComponentName.includes('@'))
                childComponentName = '@' + childComponentName;
            const resultXids = [];
            // Making sure we are only getting direct siblings
            const childIds = componentObject.x93();
            for (let i = 0; i < childIds.length; i++) {
                const childId = childIds[i];
                const xidAttr = this.e29(STRAWBERRY_ID_ATTR, appInstance, childId);
                const xidElement = element.querySelector(`[${xidAttr}]`);
                if (xidElement === null)
                    continue;
                const componentName = xidElement.getAttribute(appInstance.x47().prefix + COMPONENT_ELEMENT_ATTR);
                if (componentName === childComponentName) {
                    resultXids.push(childId);
                }
            }
            return resultXids;
        }
    }




    const e129 = 'strawberry.js: [BootError]';
    const x122 = 'strawberry.js: [BootWarning]';

    function x56(appInstance) {
        let targetElement = null;
        let templateElement = null;
        try {
            const selector = x53.e29(STRAWBERRY_ATTRIBUTE, appInstance, appInstance.x104());
            const domInstances = document.querySelectorAll(`[${selector}]`);
            if (domInstances.length === 0) {
                throw new Error(`${e129} Unable to find element ${selector}.`);
            }
            if (domInstances.length > 2) {
                throw new Error(`${e129} There are appears to be multiple instances of element ${selector}.`);
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

    function a15(componentId, component, appInstance, componentTree) {
        return new Promise(async (resolve, reject) => {
            try {
                let compiledComponentHtml = '';
                // First, we'll check if component has declared template
                const componentName = x53.a25(component, appInstance.x47().prefix, COMPONENT_ELEMENT_ATTR);
                if (componentName === null) {
                    throw new Error(`${e129} a component has no component name attribute.`);
                }
                const componentAttribute = x53.e29(COMPONENT_ELEMENT_ATTR, appInstance, componentName);
                const componentSelector = `template[${componentAttribute}]`;
                const componentTemplateElements = document.querySelectorAll(componentSelector);
                if (componentTemplateElements.length === 0) {
                    throw new Error(`strawberry.js: [BootError] Unable to find Component template ${componentSelector}.`);
                }
                if (componentTemplateElements.length > 1) {
                    throw new Error(`strawberry.js: [BootError] There are appears to be multiple instances of Component template ${componentSelector}.`);
                }
                /** Creating the Component Object */
                const componentObject = new a26();
                const componentTemplateElement = componentTemplateElements[0];
                const componentImplementation = document.implementation.createHTMLDocument();
                componentImplementation.body.innerHTML = componentTemplateElement.innerHTML;
                componentObject.e130(componentId).a123(componentName);
                /** Registering the Component in the Library */
                appInstance.e78().e110.a91(componentName, componentTemplateElement.innerHTML);
                /** Registering the Component Object */
                appInstance.e66().e110.e114(componentId, componentObject);
                /** Retrieving and processing of child components **/
                const selector = x53.x111(COMPONENT_ELEMENT_ATTR, appInstance);
                const childComponents = componentImplementation.querySelectorAll(`[${selector}]`);
                for (let i = 0; i < childComponents.length; i++) {
                    const childComponent = childComponents[i];
                    const childComponentName = x53.a25(childComponent, appInstance.x47().prefix, COMPONENT_ELEMENT_ATTR);
                    if (childComponentName == null) {
                        console.warn(`${x122} a child component is declared but no name was provided`);
                        continue;
                    }
                    const childComponentId = a40(componentId, i.toString());
                    childComponent.setAttribute('xid', childComponentId);
                    componentObject.a85(childComponentName);
                    componentObject.a105(childComponentId);
                    if (componentTree.includes(childComponentName)) {
                        throw new Error(`${e129} circular dependency in component "${childComponentName}" detected: ${JSON.stringify(componentTree)}`);
                    }
                    const childComponentTree = [childComponentName, ...componentTree];
                    childComponent.innerHTML = await a15(childComponentId, childComponent, appInstance, childComponentTree);
                }
                compiledComponentHtml += componentImplementation.body.innerHTML;
                componentObject.a57(compiledComponentHtml);
                resolve(compiledComponentHtml);
            } catch (error) {
                reject(error);
            }
        });
    }

    function a32(handler, type, name) {
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

    function e6(name, appInstance) {
        /** Check if it is a Service */
        let serviceOb = appInstance.e78().e118.e101(name);
        if (serviceOb !== null)
            return 'service';
        let factorHanlder = appInstance.e78().x119.e101(name);
        if (factorHanlder !== null)
            return 'factory';
        const helperObj = appInstance.e78().a127.e101(name);
        if (helperObj !== null)
            return 'helper';
        return null;
    }

    function x33(factoryName, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                const factoryHandler = appInstance.e78().x119.e101(factoryName);
                if (factoryHandler === null) {
                    throw new Error(`${e129} unregistered factory callback ${factoryName}.`);
                }
                const args = await a32(factoryHandler, 'service', factoryName);
                const injectableArguments = [];
                for (let i = 0; i < args.length; i++) {
                    const arg = args[i];
                    const handlerType = e6(arg, appInstance);
                    if (handlerType === 'service') {
                        const depService = await e34(arg, appInstance);
                        injectableArguments.push(depService);
                        continue;
                    }
                    if (handlerType === 'factory') {
                        const depFactory = await x33(arg, appInstance);
                        injectableArguments.push(depFactory);
                        continue;
                    }
                    if (handlerType === 'helper') {
                        throw new Error(`${e129} factories [${factoryName}] are not allowed to have helpers [${arg}] as dependencies.`);
                    }
                    injectableArguments.push(null);
                }
                const handleInstance = factoryHandler(...injectableArguments);
                if (typeof handleInstance === 'function' && handleInstance.prototype && handleInstance.prototype.constructor === handleInstance) {
                    resolve(handleInstance);
                    return;
                } else {
                    throw new Error(`${e129} factory ${factoryName} must return typeof class reference.`);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    function e34(serviceName, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                let handleOb = appInstance.e66().e118.x106(serviceName);
                if (handleOb !== null) {
                    resolve(handleOb);
                    return;
                }
                const serviceLib = appInstance.e78().e118.e101(serviceName);
                if (serviceLib === null) {
                    throw new Error(`${e129} Unregistered service callback ${serviceName}.`);
                }
                const serviceHandler = serviceLib.x117;
                const args = await a32(serviceHandler, 'service', serviceName);
                handleOb = {};
                const injectableArguments = [];
                for (let i = 0; i < args.length; i++) {
                    const arg = args[i];
                    const handlerType = e6(arg, appInstance);
                    if (handlerType === 'service') {
                        const depService = await e34(arg, appInstance);
                        injectableArguments.push(depService);
                        continue;
                    }
                    if (handlerType === 'factory') {
                        const depFactory = await x33(arg, appInstance);
                        injectableArguments.push(depFactory);
                        continue;
                    }
                    if (handlerType === 'helper') {
                        throw new Error(`${e129} services [${serviceName}] are not allowed to have helpers [${arg}] as dependencies.`);
                    }
                    injectableArguments.push(null);
                }
                handleOb = serviceHandler(...injectableArguments);
                if (handleOb === null) {
                    return resolve(handleOb);
                }
                appInstance.e66().e118.e114(serviceName, handleOb);
                resolve(handleOb);
            } catch (error) {
                reject(error);
            }
        });
    }
    const e41 = (helperName, scopeObject, componentObject, appInstance) => {
        return new Promise(async (resolve, reject) => {
            try {
                const helperHandler = appInstance.e78().a127.e101(helperName);
                if (helperHandler === null) {
                    throw new Error(`${e129} unregistered helper callback ${helperHandler}.`);
                }
                const handler = helperHandler.x117;
                const args = await a32(handler, 'helper', helperName);
                const injectableArguments = [];
                for (let i = 0; i < args.length; i++) {
                    const arg = args[i];
                    if (arg === SCOPE_ARGUMENT_KEY) {
                        injectableArguments.push(scopeObject);
                        continue;
                    }
                    if (arg.charAt(0) === '$') {
                        switch (arg) {
                            case BLOCK_ARGUMENT_KEY:
                                injectableArguments.push((blockName, callback) => {
                                    return e76(componentObject, appInstance, blockName, callback);
                                });
                                break;
                            case ENABLE_ARGUMENT_KEY:
                                injectableArguments.push((elementName) => {
                                    return x77(componentObject, appInstance, elementName);
                                });
                                break;
                            case DISABLE_ARGUMENT_KEY:
                                injectableArguments.push((elementName) => {
                                    return e67(componentObject, appInstance, elementName);
                                });
                                break;
                            case PATCH_ARGUMENT_KEY:
                                injectableArguments.push((elementName) => {
                                    return x30(componentObject, appInstance, elementName !== null && elementName !== void 0 ? elementName : null);
                                });
                                break;
                            case PARENT_ARGUMENT_KEY:
                                injectableArguments.push(a12(componentObject, appInstance));
                                break;
                            case APP_ARGUMENT_KEY:
                                injectableArguments.push(e2(componentObject, appInstance));
                                break;
                            case CHILDREN_ARGUMENT_KEY:
                                injectableArguments.push(e8(componentObject, appInstance));
                                break;
                            default:
                                break;
                        }
                        continue;
                    }
                    const handlerType = e6(arg, appInstance);
                    if (handlerType === 'service') {
                        const depService = await e34(arg, appInstance);
                        injectableArguments.push(depService);
                        continue;
                    }
                    if (handlerType === 'factory') {
                        const depFactory = await x33(arg, appInstance);
                        injectableArguments.push(depFactory);
                        continue;
                    }
                    if (handlerType === 'helper') {
                        const depHelper = await e41(arg, scopeObject, componentObject, appInstance);
                        injectableArguments.push(depHelper);
                        continue;
                    }
                    injectableArguments.push(null);
                }
                const handleObj = handler(...injectableArguments);
                resolve(handleObj);
            } catch (error) {
                reject(error);
            }
        });
    };
    /** This is where callback functions to components are being executed */
    function e18(componentObject, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                if (componentObject.e101() !== null) {
                    resolve();
                    return;
                }
                const componentName = componentObject.x120();
                const componentLibrary = appInstance.e78().e110;
                const componentHandler = componentLibrary.e101(componentName);
                if (componentHandler === null) {
                    throw new Error(`${e129} Unregistered component callback ${componentName}.`);
                }
                const allArguments = await a32(componentHandler, 'component', componentName);
                const scopeObject = {};
                const allChildComponentNames = componentObject.a79().map(childName => childName.substring(1, childName.length));
                const injectableArguments = [];
                for (let i = 0; i < allArguments.length; i++) {
                    const argument = allArguments[i];
                    if (argument === SCOPE_ARGUMENT_KEY) {
                        injectableArguments.push(scopeObject);
                        componentObject.a68(scopeObject);
                        continue;
                    }
                    if (argument.charAt(0) === '$') {
                        switch (argument) {
                            case BLOCK_ARGUMENT_KEY:
                                injectableArguments.push((blockName, callback) => {
                                    return e76(componentObject, appInstance, blockName, callback);
                                });
                                break;
                            case ENABLE_ARGUMENT_KEY:
                                injectableArguments.push((elementName) => {
                                    return x77(componentObject, appInstance, elementName);
                                });
                                break;
                            case DISABLE_ARGUMENT_KEY:
                                injectableArguments.push((elementName) => {
                                    return e67(componentObject, appInstance, elementName);
                                });
                                break;
                            case PATCH_ARGUMENT_KEY:
                                injectableArguments.push((elementName) => {
                                    return x30(componentObject, appInstance, elementName !== null && elementName !== void 0 ? elementName : null);
                                });
                                break;
                            case PARENT_ARGUMENT_KEY:
                                injectableArguments.push(a12(componentObject, appInstance));
                                break;
                            case APP_ARGUMENT_KEY:
                                injectableArguments.push(e2(componentObject, appInstance));
                                break;
                            case CHILDREN_ARGUMENT_KEY:
                                injectableArguments.push(e8(componentObject, appInstance));
                                break;
                            default:
                                break;
                        }
                        continue;
                    }
                    /** Service injection */
                    const service = appInstance.e78().e118.e101(argument);
                    if (service !== null) {
                        injectableArguments.push(await e34(argument, appInstance));
                        continue;
                    }
                    /** Factory injection */
                    const factory = appInstance.e78().x119.e101(argument);
                    if (factory !== null) {
                        injectableArguments.push(await x33(argument, appInstance));
                        continue;
                    }
                    /** Helper injection */
                    const helper = appInstance.e78().a127.e101(argument);
                    if (helper !== null) {
                        injectableArguments.push(await e41(argument, scopeObject, componentObject, appInstance));
                        continue;
                    }
                    /** Component Injection */
                    if (!allChildComponentNames.includes(argument)) {
                        throw new Error(`${e129} @${argument} is not a child component of ${componentName}`);
                    }
                    /** Get all children with that child component names */
                    const componentElementImplementation = x53.x54(appInstance.a94(), appInstance, componentObject.x128());
                    if (componentElementImplementation === null) {
                        console.warn(`${x122} unable to find element with xid "${componentObject.x128()}"`);
                        continue;
                    }
                    const childXids = x53.e4(componentElementImplementation, appInstance, componentObject, argument);
                    const wrapper = {};
                    for (let n = 0; n < childXids.length; n++) {
                        const childXid = childXids[n];
                        const childComponentObject = appInstance.e66().e110.e133()[childXid];
                        await e18(childComponentObject, appInstance);
                        wrapper[childXid] = childComponentObject;
                    }
                    const componentProxy = new Proxy(wrapper, {
                        get: function get(target, name) {
                            return function wrapper() {
                                const args = Array.prototype.slice.call(arguments);
                                const returns = [];
                                for (const xid in target) {
                                    const componentInstance = target[xid];
                                    const handler = componentInstance.e101();
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
                                            console.warn(`strawberry.js calling undefined member property or method "${name.toString()}" from component "${componentInstance.x120()}"`);
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
                componentObject.x100(handler);
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

    function e19(component, childComponentIds, appInstance) {
        for (let i = 0; i < childComponentIds.length; i++) {
            const childComponentId = childComponentIds[i];
            const element = x53.x54(component, appInstance, childComponentId);
            if (element !== null) {
                element.innerHTML = '';
            }
        }
    }

    function x13() {
        return document.implementation.createHTMLDocument().body;
    }

    function e58(bindFrom, bindTo) {
        if (bindFrom === null)
            return;
        while (bindFrom.childNodes.length > 0) {
            bindTo.appendChild(bindFrom.childNodes[0]);
        }
    }

    function a46(bindFromEl, bindToEl, appInstance, childComponentIds) {
        const temporaryChildren = {};
        for (let i = 0; i < childComponentIds.length; i++) {
            const childComponentId = childComponentIds[i];
            const childTemporaryElement = x13();
            const childActualComponent = x53.x54(bindToEl, appInstance, childComponentId);
            if (childActualComponent !== null) {
                e58(childActualComponent, childTemporaryElement);
                temporaryChildren[childComponentId] = childTemporaryElement;
            }
        }
        bindToEl.innerHTML = '';
        e58(bindFromEl, bindToEl);
        for (const childComponentId in temporaryChildren) {
            const childActualComponent = x53.x54(bindToEl, appInstance, childComponentId);
            if (childActualComponent === null)
                continue;
            e58(temporaryChildren[childComponentId], childActualComponent);
        }
    }

    function e69(element, comment) {
        if (null !== element) {
            element.innerHTML = '';
            if (element.parentNode !== null) {
                element.outerHTML = '<!-- strawberry.js: ' + element.outerHTML + ' | ' + comment + ' -->';
            }
        }
    }

    function x95(element, appInstance) {
        const lockAttrName = x53.x111(LOCK_ID_ATTR_KEY, appInstance);
        element.setAttribute(lockAttrName, LOCK_ID_ATTR_VALUE);
    }

    function e59(element, appInstance) {
        const lockAttrName = x53.x111(LOCK_ID_ATTR_KEY, appInstance);
        return (element.getAttribute(lockAttrName) !== null);
    }

    function a20(element, eventName, appInstance) {
        const lockAttrName = x53.x111(EVENT_ELEMENT_ATTR, appInstance);
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

    function x48(element, eventName, appInstance) {
        const lockAttrName = x53.x111(EVENT_ELEMENT_ATTR, appInstance);
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

    function a38(appInstance) {
        const xAppElements = x53.e14(document.body, appInstance, STRAWBERRY_ATTRIBUTE);
        let appElement = null;
        for (let i = 0; i < xAppElements.length; i++) {
            const element = xAppElements[i];
            if (element.tagName !== 'TEMPLATE') {
                appElement = element;
            }
        }
        if (appElement === null) {
            throw new Error(`strawberry.js no live app element found for ${appInstance.x104()}`);
        }
        return appElement;
    }

    function x1(attributeWithValue, componentObject, appInstance) {
        const componentChildIds = componentObject.x93();
        let selector = '';
        for (let i = 0; i < componentChildIds.length; i++) {
            const childId = componentChildIds[i];
            const childXidAttrName = x53.e29(STRAWBERRY_ID_ATTR, appInstance, childId);
            selector += ':not([' + childXidAttrName + '])';
        }
        selector += ` > [${attributeWithValue}]`;
        if (componentChildIds.length === 0) {
            const xidAttrName = x53.e29(STRAWBERRY_ID_ATTR, appInstance, componentObject.x128());
            selector = `[${xidAttrName}] [${attributeWithValue}]`;
        }
        const componentElement = x53.x54(a38(appInstance), appInstance, componentObject.x128());
        if (componentElement === null)
            return null;
        return componentElement.querySelectorAll(selector);
    }

    function e7(componentObject, appInstance) {
        const temporaryElement = x13();
        const componentElement = x53.x54(a38(appInstance), appInstance, componentObject.x128());
        if (componentElement === null)
            return null;
        temporaryElement.innerHTML = componentElement.innerHTML;
        const componentChildIds = componentObject.x93();
        for (let i = 0; i < componentChildIds.length; i++) {
            const componentChildId = componentChildIds[i];
            const childComponentElement = x53.x54(temporaryElement, appInstance, componentChildId);
            if (childComponentElement !== null) {
                childComponentElement.innerHTML = '';
            }
        }
        return temporaryElement.innerHTML;
    }
    const a40 = (existingComponentId, currentId) => {
        return existingComponentId + '.' + currentId;
    };
    const a49 = (Ids) => {
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
    class a42 {
        constructor() {
            this.x112 = {};
        }
        e114(key, component) {
            this.x112[key] = component;
        }
        e133() {
            return this.x112;
        }
    }
    class x60 {
        constructor() {
            this.x112 = {};
        }
        e114(serviceName, handleOb) {
            if (!(serviceName in this.x112))
                return null;
            this.x112[serviceName] = handleOb;
        }
        x106(serviceName) {
            if (!(serviceName in this.x112))
                return null;
            return this.x112[serviceName];
        }
    }


    /**
     * The App library contains all the registered Components, Services,
     * and Factories declared from the frontend.
     */
    class x96 {
        constructor() {
            this.e110 = new a42;
            this.e118 = new x60;
        }
    }
    class a26 {
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
        e130(id) {
            this._componentId = id;
            return this;
        }
        a123(name) {
            this._componentName = name;
            return this;
        }
        x128() {
            return this._componentId;
        }
        x120() {
            return this._componentName;
        }
        a85(name) {
            if (!this._componentChildNames.includes(name)) {
                this._componentChildNames.push(name);
            }
        }
        a105(id) {
            if (!this._componentChildIds.includes(id)) {
                this._componentChildIds.push(id);
            }
        }
        a79() {
            return this._componentChildNames;
        }
        x93() {
            return this._componentChildIds;
        }
        x100(handler) {
            if (this._componentHandler === null) {
                this._componentHandler = handler;
            }
        }
        e101() {
            return this._componentHandler;
        }
        a68(scopeObject) {
            if (this._scopeRefObject === null) {
                this._scopeRefObject = scopeObject;
            }
        }
        e70() {
            return this._scopeRefObject;
        }
        x21(name, state, template) {
            if (this._namedElementsRegistry.hasOwnProperty(name))
                return null;
            if (state === null)
                return null;
            this._namedElementsRegistry[name] = {
                _namedElementState: state,
                _namedElementTemplate: template
            };
        }
        e16(name) {
            if (!this._namedElementsRegistry.hasOwnProperty(name))
                return null;
            return this._namedElementsRegistry[name]._namedElementState;
        }
        e10(name) {
            if (!this._namedElementsRegistry.hasOwnProperty(name))
                return null;
            return this._namedElementsRegistry[name]._namedElementTemplate;
        }
        e17(name, state) {
            if (!this._namedElementsRegistry.hasOwnProperty(name))
                return;
            this._namedElementsRegistry[name]._namedElementState = state;
        }
        a57(html) {
            this._componentHtmlTemplate = html;
        }
        x55() {
            return this._componentHtmlTemplate;
        }
    }
    /**
     * Serves as a proxy or intermediary for interacting with a HTML document implementation,
     * abstract the details of creating, modifying, or managing documents.
     */
    class x5 {
        constructor(name) {
            this.a71 = document.implementation.createHTMLDocument(name);
        }
    }
    /**
     * The `StrawberryElement` class provides a wrapper around the Element object,
     * offering additional abstraction for managing states, scope, and other
     * non-default features.
     */
    class a39 {
        /**
         * @param element - The Element
         * @param pcount - The number of iteration of parent created
         */
        constructor(element, pcount = null) {
            this.$element = element;
            this.x86 = null;
            this.x107(pcount !== null && pcount !== void 0 ? pcount : 1);
        }
        /** Wraps the parent element within `StrawberryElement` object */
        x107(count) {
            const parentElement = this.$element.parentElement;
            if (count > 3 || parentElement === null)
                return;
            this.$parent = new a39(parentElement, count++);
        }
        /** Retrieves the $element */
        get() {
            return this.$element;
        }
        /** Retrieves the state */
        getState() {
            return this.x86;
        }
        setState(state) {
            if (state === null)
                return;
            this.x86 = state;
        }
        setScope(scope) {
            this.e124 = scope;
        }
        getScope() {
            return this.e124;
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

    class x115 {
        /**
         * @method _resolveExpression
         * Resolves an expression based on a given object
         * @param object baseObj
         * @param string expression
         *
         * @returns the value of the resolved expression
         */
        x43(baseObj, expression, element = null) {
            // We first determine what type of expression we will need to resolve.
            // This will be based on the structure of the operation
            let resolveType = this.a72(expression);
            // This is where the actual resolve process takes place
            return this.x125(baseObj, expression, resolveType, element);
        }
        /**
         * @method _getResolveType
         * Determines the type of an expression
         * @param string expression
         * @returns type of expression
         *
         * @NOTE: the expression should always have to be a string!
         */
        a72(expression) {
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
        x125(scopeObj, expression, resolveType, element = null) {
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
                    return this.x108(scopeObj, expression);
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
                                argObj.push(this.x43(argScope, splitFunctionArguments[i]));
                            }
                            if (element !== null) {
                                argObj.push(new a39(element));
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
                            argObj.push(new a39(element));
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
                        let refObject = this.x43(scopeObj, this.x35(funcStruct[0]));
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
                        return isNotTheSame(this.x43(scopeObj, comparables[0].trim()), this.x43(scopeObj, comparables[1].trim()));
                    } else if (expression.includes('==')) {
                        let comparables = expression.split('==');
                        return isTheSame(this.x43(scopeObj, comparables[0].trim()), this.x43(scopeObj, comparables[1].trim()));
                    } else if (expression.includes('is not ')) {
                        let comparables = expression.split('is not');
                        return isNotTheSame(this.x43(scopeObj, comparables[0].trim()), this.x43(scopeObj, comparables[1].trim()));
                    } else if (expression.includes('is ')) {
                        let comparables = expression.split('is');
                        return isTheSame(this.x43(scopeObj, comparables[0].trim()), this.x43(scopeObj, comparables[1].trim()));
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
                            let left = this.x43(scopeObj, exp[0].trim());
                            var right = this.x43(scopeObj, exp[1].trim());
                            finalExpression = left + operations[i] + right;
                        }
                    }
                    return eval(finalExpression);
                    break;
            }
        }
        x108(scopeObj, objectExpression) {
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
        e44(expression) {
            let expressionPieces = expression.split('.');
            return expressionPieces[expressionPieces.length - 1];
        }
        x22(baseObj, objExpression) {
            let parentObjExpression = this.x35(objExpression);
            return this.x43(baseObj, parentObjExpression);
        }
    } {};



    class e36 {
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
    class x80 {
        constructor({
            a131,
            a134
        }) {
            this.x132 = new x5(a131);
            this.e109 = new a102;
            this.x97 = new x96;
            this.a81 = {
                prefix: 'x'
            };
            this.a134 = a134;
            this.a131 = a131;
            this.x61 = new e36;
            this.a98 = false;
            this.a73 = false;
        }
        x128() {
            return this.a134;
        }
        /**
         * Returns the name of the strawberry app instance
         */
        x104() {
            return this.a131;
        }
        /**
         * Sets the raw HTML body of the Strawberry app instance
         * @param content
         */
        e99(content) {
            this.x132.a71.body.innerHTML = content;
        }
        a94() {
            return this.x132.a71.body;
        }
        /**
         * Sets the Configuration of the Strawberry app instance
         * @param configuration
         */
        a50(configuration) {
            this.a81 = configuration;
        }
        x47() {
            return this.a81;
        }
        /**
         * Retreieves the App Library
         * @see a102
         */
        e78() {
            return this.e109;
        }
        /**
         * Retreieves the App Registry
         * @see x96
         */
        e66() {
            return this.x97;
        }
        a74() {
            this.a98 = true;
            this.x61.e37.forEach(async (callback) => {
                await Promise.resolve(callback());
            });
            this.a73 = true;
        }
        x28() {
            return this.x61;
        }
        x121() {
            return this.a98;
        }
        e103() {
            return this.a73;
        }
    }

    function e27(targetElement, componentObject, appInstance) {
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
                        const scopeObject = componentObject.e70();
                        if (scopeObject === null)
                            return;
                        let resolvedExpression = new x115().x43(scopeObject, allMatchedData[i].trim());
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


    function e87(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allBlockElements = x53.e14(targetElement, appInstance, BLOCK_ELEMENT_ATTR);
                for (let i = 0; i < allBlockElements.length; i++) {
                    const element = allBlockElements[i];
                    const blockElName = x53.a25(element, appInstance.x47().prefix, BLOCK_ELEMENT_ATTR);
                    if (blockElName === null)
                        continue;
                    /** Retrieving and registering the template */
                    const componentTemplate = componentObject.x55();
                    const tempCompEl = x13();
                    tempCompEl.innerHTML = componentTemplate;
                    const selector = x53.e29(BLOCK_ELEMENT_ATTR, appInstance, blockElName);
                    const tempBlockEl = tempCompEl.querySelector(`[${selector}]`);
                    if (tempBlockEl === null)
                        continue;
                    if (null === componentObject.e16(blockElName)) {
                        componentObject.x21(blockElName, 'registered', tempBlockEl.innerHTML);
                    }
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }



    function e82(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allCheckedElements = x53.e14(targetElement, appInstance, CHECK_ELEMENT_ATTR);
                for (let i = 0; i < allCheckedElements.length; i++) {
                    const element = allCheckedElements[i];
                    if (e59(element, appInstance))
                        continue;
                    const argument = x53.a25(element, appInstance.x47().prefix, CHECK_ELEMENT_ATTR);
                    const scopeObject = componentObject.e70();
                    if (scopeObject === null || argument === null)
                        continue;
                    const evalauted = new x115().x43(scopeObject, argument);
                    if (typeof evalauted === 'boolean') {
                        evalauted ? element.setAttribute('checked', '') : element.removeAttribute('checked');
                    }
                    x95(element, appInstance);
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }

    function e62(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allDisabledElements = x53.e14(targetElement, appInstance, DISABLE_ELEMENT_ATTR);
                for (let i = 0; i < allDisabledElements.length; i++) {
                    const element = allDisabledElements[i];
                    const elementName = x53.a25(element, appInstance.x47().prefix, DISABLE_ELEMENT_ATTR);
                    if (elementName === null)
                        continue;
                    if (null === componentObject.e16(elementName)) {
                        componentObject.x21(elementName, 'disabled', '');
                    }
                    element.disabled = (componentObject.e16(elementName) === 'disabled');
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }

    function e63(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allEnabledElements = x53.e14(targetElement, appInstance, ENABLE_ELEMENT_ATTR);
                for (let i = 0; i < allEnabledElements.length; i++) {
                    const element = allEnabledElements[i];
                    const elementName = x53.a25(element, appInstance.x47().prefix, ENABLE_ELEMENT_ATTR);
                    if (elementName === null)
                        continue;
                    if (null === componentObject.e16(elementName)) {
                        componentObject.x21(elementName, 'enabled', '');
                    }
                    element.disabled = (componentObject.e16(elementName) === 'disabled');
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
                /**
                 * This function adds event listener to elements which is bound to a function
                 * within the component scope
                 */
                const e116 = function(scopeObject, eventElement, fnExpression, eventType) {
                    if (new x115().a72(fnExpression) !== 'function')
                        return;
                    eventElement.addEventListener(eventType, () => {
                        new x115().x43(scopeObject, fnExpression, eventElement);
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
                    const allEventElements = x53.e14(targetElement, appInstance, event.attr);
                    for (let k = 0; k < allEventElements.length; k++) {
                        const element = allEventElements[k];
                        const fnExpression = x53.a25(element, appInstance.x47().prefix, event.attr);
                        if (a20(element, event.type, appInstance))
                            continue;
                        const scopeObject = componentObject.e70();
                        if (scopeObject === null || fnExpression == null)
                            continue;
                        e116(componentObject.e70(), element, fnExpression, event.type);
                        x48(element, event.type, appInstance);
                    }
                }
                resolve(null);
            } catch (error) {
                reject(null);
            }
        });
    }



    function e23(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                /** Retrieving all elements with ifs conditional */
                const ifsElements = x53.e14(targetElement, appInstance, IF_ELEMENT_ATTR);
                for (let i = 0; i < ifsElements.length; i++) {
                    const ifsElement = ifsElements[i];
                    if (!e59(ifsElement, appInstance)) {
                        const ifsArgument = x53.a25(ifsElement, appInstance.x47().prefix, IF_ELEMENT_ATTR);
                        const scopeObject = componentObject.e70();
                        if (scopeObject === null || ifsArgument === null)
                            continue;
                        const resolvedIfsValue = new x115().x43(scopeObject, ifsArgument);
                        if (typeof resolvedIfsValue === 'boolean' && !resolvedIfsValue) {
                            e69(ifsElement, 'false');
                        }
                        x95(ifsElement, appInstance);
                    }
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }


    function e83(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                /**
                 * This function attemps to add an undefined model as part of the scope.
                 * For example, if you assign `xmodel="user.firstName"`, but firstName
                 * is not defined in $scope.user, then this function will add firstName
                 * as member property of $scope.user automatically
                 */
                const x51 = (scopeObject, modelExpression, modelValue) => {
                    const parentObj = new x115().x22(scopeObject, modelExpression);
                    const childObjExpression = new x115().e44(modelExpression);
                    if (undefined !== parentObj)
                        parentObj[childObjExpression] = modelValue;
                };
                const e52 = (modelElement, modelState) => {
                    (typeof modelState == 'boolean' && modelState) ?
                    modelElement.setAttribute('checked', ''):
                        modelElement.removeAttribute('checked');
                };
                const allModelElements = x53.e14(targetElement, appInstance, MODEL_ELEMENT_ATTR);
                for (let i = 0; i < allModelElements.length; i++) {
                    const element = allModelElements[i];
                    if (element === null)
                        continue;
                    const argument = x53.a25(element, appInstance.x47().prefix, MODEL_ELEMENT_ATTR);
                    const myScopeObject = componentObject.e70();
                    if (myScopeObject === null || argument === null)
                        continue;
                    const evaluated = new x115().x43(myScopeObject, argument);
                    let isValueStringType = true;
                    if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                        if ((element instanceof HTMLInputElement)) {
                            const elementType = element.type;
                            if (elementType === 'radio' || elementType === 'checkbox') {
                                isValueStringType = false;
                                (evaluated === undefined) ?
                                x51(myScopeObject, argument, false):
                                    e52(element, evaluated);
                            }
                            if (elementType === 'text' || elementType === 'password' || element.type === 'email') {
                                (evaluated === undefined) ?
                                x51(myScopeObject, argument, element.value):
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
                                    x51(myScopeObject, argument, inputDate);
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
                                    x51(myScopeObject, argument, inputDate);
                                }
                                const hours = (inputDate.getHours() < 10) ? '0' + inputDate.getHours() : inputDate.getHours();
                                const minutes = (inputDate.getMinutes() < 10) ? '0' + inputDate.getMinutes() : inputDate.getMinutes();
                                const elementValue = hours + ':' + minutes;
                                element.value = elementValue;
                            }
                        }
                        if ((element instanceof HTMLSelectElement)) {
                            (evaluated === undefined) ?
                            x51(myScopeObject, argument, element.value):
                                element.value = evaluated;
                        }
                        element.addEventListener('change', (event) => {
                            const target = event.target;
                            if (target instanceof HTMLInputElement) {
                                if (target.type === 'date') {
                                    const newevaluated = new x115().x43(myScopeObject, argument);
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
                                    x51(myScopeObject, argument, newevaluated);
                                    return;
                                }
                                if (target.type === 'time') {
                                    const newevaluated = new x115().x43(myScopeObject, argument);
                                    const [shour, sminute] = target.value.split(':');
                                    const hour = parseInt(shour);
                                    const minute = parseInt(sminute);
                                    if (!(newevaluated instanceof Date)) {
                                        throw new Error(`strawberry.js: [RenderError] Models assigned to Date and/or Time elements must be instance of Date object`);
                                    }
                                    newevaluated.setHours(hour);
                                    newevaluated.setMinutes(minute);
                                    x51(myScopeObject, argument, newevaluated);
                                    return;
                                }
                                x51(myScopeObject, argument, (isValueStringType) ? target.value : target.checked);
                            }
                            if (target instanceof HTMLSelectElement) {
                                x51(myScopeObject, argument, target.value);
                            }
                        });
                    }
                    if (element.tagName === 'TEXTAREA' && (element instanceof HTMLTextAreaElement)) {
                        (evaluated === undefined) ?
                        x51(myScopeObject, argument, element.value):
                            element.value = evaluated;
                        element.addEventListener('change', () => {
                            x51(myScopeObject, argument, element.value);
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
    function x11(expression) {
        if (expression.includes('until '))
            return [REPEAT_REFERENCE_TOKEN, expression.split('until')[1].trim()];
        return [
            expression.split(' as ')[0].trim(),
            expression.split(' as ')[1].trim()
        ];
    }

    function a89(targetElement, componentObject, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                /** Retrieving all repeatable elements */
                const repeatableElements = x53.e14(targetElement, appInstance, REPEAT_ELEMENT_ATTR);
                const scopeObject = componentObject.e70();
                if (scopeObject === null)
                    return resolve(null);
                /** Looping through repeatable elements */
                for (let i = 0; i < repeatableElements.length; i++) {
                    let repeatableElement = repeatableElements[i];
                    let htmlTemplate = repeatableElement.innerHTML;
                    repeatableElement.innerHTML = '';
                    let expression = x53.a25(repeatableElement, appInstance.x47().prefix, REPEAT_ELEMENT_ATTR);
                    if (expression === null)
                        continue;
                    let [refObjName, aliasObjName] = x11(expression);
                    if (refObjName === REPEAT_REFERENCE_TOKEN) {
                        // This creates a new object that we can loop through
                        let repetitions = (new x115().x43(scopeObject, aliasObjName));
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
                    const repeatableObject = new x115().x43(scopeObject, refObjName);
                    if (undefined !== repeatableObject && null !== repeatableObject) {
                        let j = 0;
                        for (const [key, value] of Object.entries(repeatableObject)) {
                            // Creating an invidual component for each repititions
                            let childTempComponent = new a26();
                            childTempComponent.a68({
                                $parent: scopeObject,
                                $index: j++,
                                [aliasObjName]: repeatableObject[key]
                            });
                            const childRepeatElement = x13();
                            childRepeatElement.innerHTML = htmlTemplate;
                            await a84(childRepeatElement, childTempComponent, appInstance, true);
                            e58(childRepeatElement, repeatableElement);
                        }
                    }
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }



    function e90(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allStyleElements = x53.e14(targetElement, appInstance, STYLE_ELEMENT_ATTR);
                for (let i = 0; i < allStyleElements.length; i++) {
                    const element = allStyleElements[i];
                    if (e59(element, appInstance))
                        continue;
                    const argument = x53.a25(element, appInstance.x47().prefix, STYLE_ELEMENT_ATTR);
                    const scopeObject = componentObject.e70();
                    if (scopeObject === null || argument === null)
                        continue;
                    let evaulated = new x115().x43(scopeObject, argument);
                    if (evaulated !== null && evaulated !== '' && evaulated !== undefined) {
                        element.classList.add(evaulated);
                    }
                    x95(element, appInstance);
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }




    function a84(targetElement, componentObject, appInstance, skipEvents = false) {
        return new Promise(async (resolve, reject) => {
            try {
                await a89(targetElement, componentObject, appInstance);
                await e23(targetElement, componentObject, appInstance);
                await e27(targetElement, componentObject, appInstance);
                await e82(targetElement, componentObject, appInstance);
                await e90(targetElement, componentObject, appInstance);
                await e83(targetElement, componentObject, appInstance);
                await e62(targetElement, componentObject, appInstance);
                await e63(targetElement, componentObject, appInstance);
                await e87(targetElement, componentObject, appInstance);
                if (!skipEvents) {
                    await a88(targetElement, componentObject, appInstance);
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
            const appInstance = new x80({
                a134: instanceId++,
                a131: name
            });
            if (config !== undefined) {
                appInstance.a50(config);
            }
            StrawberryAppInstances.push(appInstance);
            return {
                component: (name, handler) => {
                    appInstance.e78().e110.x100(`@${name}`, handler);
                },
                factory: (name, handler) => {
                    appInstance.e78().x119.e114(name, handler);
                },
                service: (name, handler) => {
                    appInstance.e78().e118.e114(name, handler);
                },
                helper: (name, handler) => {
                    appInstance.e78().a127.e114(name, handler);
                }
            };
        }
    };
    const strawberry = window['strawberry'] = AppPublicAPI;
    DOMHelper.ready(() => {
        StrawberryAppInstances.forEach(async (appInstance) => {
            try {
                const [appElement, templateElement] = x56(appInstance);
                /** We'll add the App Template HTML content to the appInstance object */
                appInstance.e99(templateElement.innerHTML);
                /** Compiling all components in the App Template, and their dependencies.*/
                const xcomponent = x53.x111(COMPONENT_ELEMENT_ATTR, appInstance);
                let componentEls = appInstance.a94().querySelectorAll(`[${xcomponent}]`);
                let componentId = 0;
                for (let i = 0; i < componentEls.length; i++) {
                    /** Component Element */
                    const componentEl = componentEls[i];
                    const componentName = x53.a25(componentEl, appInstance.x47().prefix, COMPONENT_ELEMENT_ATTR);
                    if (componentName === null) {
                        continue;
                    }
                    /** Component IDs would have to be embedded to the xid attribute */
                    const xid = appInstance.x128().toString() + '.' + (componentId++).toString();
                    const xidAttr = x53.x111('id', appInstance);
                    componentEl.setAttribute(xidAttr, xid);
                    /**
                     * Retrieving component templates, as well as the templates of their dependencies,
                     * and the dependencies of their dependencies.
                     */
                    componentEl.innerHTML = await a15(xid, componentEl, appInstance, [componentName]);
                }
                const componentObjects = appInstance.e66().e110.e133();
                const componentIdsList = [];
                for (const componentId in componentObjects) {
                    componentIdsList.push(componentId);
                    await e18(componentObjects[componentId], appInstance);
                }
                for (const componentId in componentObjects) {
                    const componentTemporaryElement = x13();
                    componentTemporaryElement.innerHTML = componentObjects[componentId].x55();
                    e19(componentTemporaryElement, componentObjects[componentId].x93(), appInstance);
                    componentObjects[componentId].a57(componentTemporaryElement.innerHTML);
                }
                /** Rendering phase */
                for (const componentId in componentObjects) {
                    const targetElement = x53.x54(appInstance.a94(), appInstance, componentId);
                    /**
                     * This happens for the following circumstances:
                     * - When the component is added inside an xif element
                     */
                    if (targetElement === null)
                        continue;
                    const temporaryElement = x13();
                    temporaryElement.innerHTML = targetElement.innerHTML;
                    e19(temporaryElement, componentObjects[componentId].x93(), appInstance);
                    await a84(temporaryElement, componentObjects[componentId], appInstance);
                    a46(temporaryElement, targetElement, appInstance, componentObjects[componentId].x93());
                }
                e58(appInstance.a94(), appElement);
                appInstance.a74();
            } catch (error) {
                console.error(error);
            }
        });
    });
})();