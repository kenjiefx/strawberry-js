/*
==========================================
Strawberry JS (Beta Version 0.9.12)
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
    class e46 {
        constructor() {
            this.a113 = {};
        }
        /** Registers a template */
        e92(name, template) {
            this.x127(name);
            if (this.a113[name].x114 !== null)
                return;
            this.a113[name].x114 = template;
        }
        /** Registers a callback handler */
        a101(name, handler) {
            this.x127(name);
            if (this.a113[name].e118 !== null)
                return;
            this.a113[name].e118 = handler;
        }
        /** Retrieves the template */
        e93(name) {
            if (!(name in this.a113))
                return null;
            return this.a113[name].x114;
        }
        /** Retrievs the handler */
        a102(name) {
            if (!(name in this.a113))
                return null;
            return this.a113[name].e118;
        }
        x127(name) {
            if (!(name in this.a113)) {
                this.a113[name] = {
                    x114: null,
                    e118: null
                };
            }
        }
    }
    class TypeofFactory {}
    /**
     * Registers and stores all the Factory callbacks/handlers
     */
    class a65 {
        constructor() {
            this.a113 = {};
        }
        /** Register a new callback/handler */
        a115(name, handler) {
            if (handler === null)
                return;
            this.a113[name] = {
                e118: handler
            };
        }
        /** Retrievs a handler */
        a102(name) {
            if (!(name in this.a113))
                return null;
            return this.a113[name].e118;
        }
    }
    /**
     * Registers and stores all the Service callbacks/handlers
     */
    class a76 {
        constructor() {
            this.a113 = {};
        }
        /** Register a new callback/handler */
        a115(name, handler) {
            if (handler === null)
                return;
            this.a113[name] = {
                e118: handler
            };
        }
        /** Retrievs a handler */
        a102(name) {
            if (!(name in this.a113))
                return null;
            return this.a113[name];
        }
    }
    /**
     * Registers and stores all the Service callbacks/handlers
     */
    class a66 {
        constructor() {
            this.a113 = {};
        }
        /** Register a new callback/handler */
        a115(name, handler) {
            if (handler === null)
                return;
            this.a113[name] = {
                e118: handler
            };
        }
        /** Retrievs a handler */
        a102(name) {
            if (!(name in this.a113))
                return null;
            return this.a113[name];
        }
    }




    /**
     * The App library contains all the usable Components, Services,
     * and Factories declared from the frontend.
     */
    class a103 {
        constructor() {
            this.e111 = new e46;
            this.a119 = new a66;
            this.a120 = new a65;
            this.e128 = new a76;
        }
    }

    function x2(componentObject, appInstance) {
        return appInstance.e29();
    }



    function x77(componentObject, appInstance, blockName, callback) {
        const blockAttrNameAndValue = a54.a30(BLOCK_ELEMENT_ATTR, appInstance, blockName);
        const componentElement = a54.e55(e39(appInstance), appInstance, componentObject.x129());
        if (componentElement === null) {
            throw new Error('strawberry.js unknown component element');
        }
        const refElementAttrAndValue = a54.a30(ELEMENT_REFERENCE_ATTR, appInstance, componentObject.x129());
        const allBlockElements = componentElement.querySelectorAll(`[${blockAttrNameAndValue}][${refElementAttrAndValue}]`);
        for (let i = 0; i < allBlockElements.length; i++) {
            const element = allBlockElements[i];
            const strawberryElement = new a40(element);
            callback(strawberryElement);
        }
    }

    function x9(componentObject, appInstance) {
        return {
            get: (childName) => {
                if (childName.charAt(0) !== '@')
                    childName = '@' + childName;
                let childComponentObject = null;
                const childIds = componentObject.a94();
                for (let i = 0; i < childIds.length; i++) {
                    const childId = childIds[i];
                    const childComponent = appInstance.a67().e111.x134()[childId];
                    if (childComponent.e121() === childName) {
                        childComponentObject = childComponent;
                        break;
                    }
                }
                if (childComponentObject === null)
                    return null;
                return childComponentObject.a102();
            }
        };
    }


    function a10(componentObject, appInstance, elementName, state) {
        try {
            const elementState = componentObject.x17(elementName);
            if (elementState === null) {
                throw new Error('unregistered componenet member named "' + elementName + '"');
            }
            if (elementState === state)
                return;
            const allDisabledElements = a1(a54.a30(DISABLE_ELEMENT_ATTR, appInstance, elementName), componentObject, appInstance);
            if (allDisabledElements === null)
                return;
            const allElements = Array.from(allDisabledElements);
            const allEnabledElements = a1(a54.a30(ENABLE_ELEMENT_ATTR, appInstance, elementName), componentObject, appInstance);
            if (allEnabledElements === null)
                return;
            allEnabledElements.forEach(allEnabledElement => {
                allElements.push(allEnabledElement);
            });
            for (let i = 0; i < allElements.length; i++) {
                const element = allElements[i];
                element.disabled = (state === 'disabled');
            }
            componentObject.e18(elementName, state);
        } catch (error) {
            console.error(`strawberry.js: [DisablerService] ` + error.message);
        }
    }

    function a68(componentObject, appInstance, elementName) {
        try {
            a10(componentObject, appInstance, elementName, 'disabled');
        } catch (error) {
            console.error(`strawberry.js: [EnablerService] ` + error.message);
        }
    }

    function e78(componentObject, appInstance, elementName) {
        try {
            a10(componentObject, appInstance, elementName, 'enabled');
        } catch (error) {
            console.error(`strawberry.js: [EnablerService] ` + error.message);
        }
    }

    function a13(componentObject, appInstance) {
        class a25 {
            constructor(id) {
                this.id = id;
                const grandParentId = id.substring(0, (id.length - 2));
                const registry = appInstance.a67().e111.x134();
                if (!registry.hasOwnProperty(grandParentId))
                    this.$parent = null;
                if (grandParentId !== '0')
                    this.$parent = new a25(grandParentId);
            }
            get() {
                return registry[parentId].a102();
            }
        }
        const parentId = componentObject.x129().substring(0, componentObject.x129().length - 2);
        const registry = appInstance.a67().e111.x134();
        if (!registry.hasOwnProperty(parentId)) {
            return null;
        }
        return new a25(parentId);
    }



    function a3(elementToBindTo, componentObject, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                const elementBindFrom = x14();
                elementBindFrom.innerHTML = componentObject.x56();
                await x85(elementBindFrom, componentObject, appInstance);
                const childComponentIds = componentObject.a94();
                for (let i = 0; i < childComponentIds.length; i++) {
                    const childComponentId = childComponentIds[i];
                    const childComponent = a54.e55(elementBindFrom, appInstance, childComponentId);
                    if (childComponent !== null) {
                        await a3(childComponent, appInstance.a67().e111.x134()[childComponentId], appInstance);
                    }
                }
                x47(elementBindFrom, elementToBindTo, appInstance, componentObject.a94());
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }

    function a31(componentObject, appInstance, blockName) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!appInstance.e122()) {
                    throw new Error(`invalid invoking of service when boot is not ready`);
                }
                let mode = 'component';
                let elementsToPatch = [a54.e55(e39(appInstance), appInstance, componentObject.x129())];
                if (blockName !== undefined && blockName !== null) {
                    mode = 'block';
                    const elementsButNotChild = a1(a54.a30(BLOCK_ELEMENT_ATTR, appInstance, blockName), componentObject, appInstance);
                    if (elementsButNotChild === null) {
                        return;
                    }
                    elementsToPatch = Array.from(elementsButNotChild);
                }
                if (elementsToPatch.length === 0 || elementsToPatch[0] === null) {
                    if (!appInstance.e104())
                        return resolve(null);
                    throw new Error(`invalid invoking of service when boot is not complete`);
                }
                for (let i = 0; i < elementsToPatch.length; i++) {
                    const elementBindTo = elementsToPatch[i];
                    let elementBindFrom = x14();
                    if (mode === 'component') {
                        const template = componentObject.x56();
                        elementBindFrom.innerHTML = template;
                    } else {
                        if (blockName === undefined || blockName === null)
                            continue;
                        const template = componentObject.e11(blockName);
                        if (template === null)
                            continue;
                        elementBindFrom.innerHTML = template;
                    }
                    await x85(elementBindFrom, componentObject, appInstance);
                    if (elementBindTo === null)
                        continue;
                    x47(elementBindFrom, elementBindTo, appInstance, componentObject.a94());
                    /**
                     * Find all unrendered child component. This happens usually because of
                     * conditional statements such xif
                     */
                    const childComponentIds = componentObject.a94();
                    for (let k = 0; k < childComponentIds.length; k++) {
                        const childComponentId = childComponentIds[k];
                        const childComponent = a54.e55(elementBindTo, appInstance, childComponentId);
                        if (childComponent === null)
                            continue;
                        if (childComponent.innerHTML.trim() === '') {
                            await a3(childComponent, appInstance.a67().e111.x134()[childComponentId], appInstance);
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
    const ELEMENT_REFERENCE_ATTR = 'rid';
    class a54 {
        /**
         * Creates a component attribute with value. Example: `xcomponent="@ComponentName"`
         */
        static e32(name, appInstance) {
            return appInstance.e48().prefix + COMPONENT_ELEMENT_ATTR + '="@' + name + '"';
        }
        /**
         * Creates an attribute with any key. Example: `xsomekeyhere`
         */
        static x112(attributeName, appInstance) {
            return appInstance.e48().prefix + attributeName;
        }
        /**
         * Creates an attribute with any key, with any value. Example: `xsomekeyhere="value"`
         */
        static a30(attributeName, appInstance, value) {
            return appInstance.e48().prefix + attributeName + '="' + value + '"';
        }
        static a26(element, prefix, attributeName) {
            const resolvedAttrName = prefix + attributeName;
            return element.getAttribute(resolvedAttrName);
        }
        static e55(element, appInstance, xid) {
            const resolvedXidAttr = appInstance.e48().prefix + STRAWBERRY_ID_ATTR + '="' + xid + '"';
            return element.querySelector(`[${resolvedXidAttr}]`);
        }
        static a15(element, appInstance, attributeName) {
            const resolvedAttrName = this.x112(attributeName, appInstance);
            return element.querySelectorAll(`[${resolvedAttrName}]`);
        }
        static e4(element, appInstance, componentObject, childComponentName) {
            if (!childComponentName.includes('@'))
                childComponentName = '@' + childComponentName;
            const resultXids = [];
            // Making sure we are only getting direct siblings
            const childIds = componentObject.a94();
            for (let i = 0; i < childIds.length; i++) {
                const childId = childIds[i];
                const xidAttr = this.a30(STRAWBERRY_ID_ATTR, appInstance, childId);
                const xidElement = element.querySelector(`[${xidAttr}]`);
                if (xidElement === null)
                    continue;
                const componentName = xidElement.getAttribute(appInstance.e48().prefix + COMPONENT_ELEMENT_ATTR);
                if (componentName === childComponentName) {
                    resultXids.push(childId);
                }
            }
            return resultXids;
        }
    }




    const x130 = 'strawberry.js: [BootError]';
    const a123 = 'strawberry.js: [BootWarning]';

    function x57(appInstance) {
        let targetElement = null;
        let templateElement = null;
        try {
            const selector = a54.a30(STRAWBERRY_ATTRIBUTE, appInstance, appInstance.x105());
            const domInstances = document.querySelectorAll(`[${selector}]`);
            if (domInstances.length === 0) {
                throw new Error(`${x130} Unable to find element ${selector}.`);
            }
            if (domInstances.length > 2) {
                throw new Error(`${x130} There are appears to be multiple instances of element ${selector}.`);
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

    function e6(componentId, componentImplementation, appInstance) {
        const refElementAttr = a54.x112(ELEMENT_REFERENCE_ATTR, appInstance);
        /** Registering Ids to Block, Disabled, and Enabled elements */
        const elementAttrs = [BLOCK_ELEMENT_ATTR, DISABLE_ELEMENT_ATTR, ENABLE_ELEMENT_ATTR];
        const allElements = [];
        for (let i = 0; i < elementAttrs.length; i++) {
            const elementAttr = elementAttrs[i];
            const elements = Array.from(componentImplementation.body.querySelectorAll(`[${a54.x112(elementAttr, appInstance)}]`));
            allElements.push(...elements);
        }
        for (let j = 0; j < allElements.length; j++) {
            const element = allElements[j];
            element.setAttribute(refElementAttr, componentId);
        }
    }

    function e16(componentId, component, appInstance, componentTree) {
        return new Promise(async (resolve, reject) => {
            try {
                let compiledComponentHtml = '';
                // First, we'll check if component has declared template
                const componentName = a54.a26(component, appInstance.e48().prefix, COMPONENT_ELEMENT_ATTR);
                if (componentName === null) {
                    throw new Error(`${x130} a component has no component name attribute.`);
                }
                const componentAttribute = a54.a30(COMPONENT_ELEMENT_ATTR, appInstance, componentName);
                const componentSelector = `template[${componentAttribute}]`;
                const componentTemplateElements = document.querySelectorAll(componentSelector);
                if (componentTemplateElements.length === 0) {
                    throw new Error(`strawberry.js: [BootError] Unable to find Component template ${componentSelector}.`);
                }
                if (componentTemplateElements.length > 1) {
                    throw new Error(`strawberry.js: [BootError] There are appears to be multiple instances of Component template ${componentSelector}.`);
                }
                /** Creating the Component Object */
                const componentObject = new a27();
                const componentTemplateElement = componentTemplateElements[0];
                const componentImplementation = document.implementation.createHTMLDocument();
                componentImplementation.body.innerHTML = componentTemplateElement.innerHTML;
                componentObject.e131(componentId).a124(componentName);
                e6(componentId, componentImplementation, appInstance);
                /** Registering the Component in the Library */
                appInstance.e79().e111.e92(componentName, componentTemplateElement.innerHTML);
                /** Registering the Component Object */
                appInstance.a67().e111.a115(componentId, componentObject);
                /** Retrieving and processing of child components **/
                const selector = a54.x112(COMPONENT_ELEMENT_ATTR, appInstance);
                const childComponents = componentImplementation.querySelectorAll(`[${selector}]`);
                for (let i = 0; i < childComponents.length; i++) {
                    const childComponent = childComponents[i];
                    const childComponentName = a54.a26(childComponent, appInstance.e48().prefix, COMPONENT_ELEMENT_ATTR);
                    if (childComponentName == null) {
                        console.warn(`${a123} a child component is declared but no name was provided`);
                        continue;
                    }
                    const childComponentId = x41(componentId, i.toString());
                    childComponent.setAttribute('xid', childComponentId);
                    componentObject.a86(childComponentName);
                    componentObject.x106(childComponentId);
                    if (componentTree.includes(childComponentName)) {
                        throw new Error(`${x130} circular dependency in component "${childComponentName}" detected: ${JSON.stringify(componentTree)}`);
                    }
                    const childComponentTree = [childComponentName, ...componentTree];
                    childComponent.innerHTML = await e16(childComponentId, childComponent, appInstance, childComponentTree);
                }
                compiledComponentHtml += componentImplementation.body.innerHTML;
                componentObject.x58(compiledComponentHtml);
                resolve(compiledComponentHtml);
            } catch (error) {
                reject(error);
            }
        });
    }

    function x33(handler, type, name) {
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

    function e7(name, appInstance) {
        /** Check if it is a Service */
        let serviceOb = appInstance.e79().a119.a102(name);
        if (serviceOb !== null)
            return 'service';
        let factorHanlder = appInstance.e79().a120.a102(name);
        if (factorHanlder !== null)
            return 'factory';
        const helperObj = appInstance.e79().e128.a102(name);
        if (helperObj !== null)
            return 'helper';
        return null;
    }

    function a34(factoryName, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                const factoryHandler = appInstance.e79().a120.a102(factoryName);
                if (factoryHandler === null) {
                    throw new Error(`${x130} unregistered factory callback ${factoryName}.`);
                }
                const args = await x33(factoryHandler, 'service', factoryName);
                const injectableArguments = [];
                for (let i = 0; i < args.length; i++) {
                    const arg = args[i];
                    const handlerType = e7(arg, appInstance);
                    if (handlerType === 'service') {
                        const depService = await x35(arg, appInstance);
                        injectableArguments.push(depService);
                        continue;
                    }
                    if (handlerType === 'factory') {
                        const depFactory = await a34(arg, appInstance);
                        injectableArguments.push(depFactory);
                        continue;
                    }
                    if (handlerType === 'helper') {
                        throw new Error(`${x130} factories [${factoryName}] are not allowed to have helpers [${arg}] as dependencies.`);
                    }
                    injectableArguments.push(null);
                }
                const handleInstance = factoryHandler(...injectableArguments);
                if (typeof handleInstance === 'function' && handleInstance.prototype && handleInstance.prototype.constructor === handleInstance) {
                    resolve(handleInstance);
                    return;
                } else {
                    throw new Error(`${x130} factory ${factoryName} must return typeof class reference.`);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    function x35(serviceName, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                let handleOb = appInstance.a67().a119.e107(serviceName);
                if (handleOb !== null) {
                    resolve(handleOb);
                    return;
                }
                const serviceLib = appInstance.e79().a119.a102(serviceName);
                if (serviceLib === null) {
                    throw new Error(`${x130} Unregistered service callback ${serviceName}.`);
                }
                const serviceHandler = serviceLib.e118;
                const args = await x33(serviceHandler, 'service', serviceName);
                handleOb = {};
                const injectableArguments = [];
                for (let i = 0; i < args.length; i++) {
                    const arg = args[i];
                    const handlerType = e7(arg, appInstance);
                    if (handlerType === 'service') {
                        const depService = await x35(arg, appInstance);
                        injectableArguments.push(depService);
                        continue;
                    }
                    if (handlerType === 'factory') {
                        const depFactory = await a34(arg, appInstance);
                        injectableArguments.push(depFactory);
                        continue;
                    }
                    if (handlerType === 'helper') {
                        throw new Error(`${x130} services [${serviceName}] are not allowed to have helpers [${arg}] as dependencies.`);
                    }
                    injectableArguments.push(null);
                }
                handleOb = serviceHandler(...injectableArguments);
                if (handleOb === null) {
                    return resolve(handleOb);
                }
                appInstance.a67().a119.a115(serviceName, handleOb);
                resolve(handleOb);
            } catch (error) {
                reject(error);
            }
        });
    }
    const x42 = (helperName, scopeObject, componentObject, appInstance) => {
        return new Promise(async (resolve, reject) => {
            try {
                const helperHandler = appInstance.e79().e128.a102(helperName);
                if (helperHandler === null) {
                    throw new Error(`${x130} unregistered helper callback ${helperHandler}.`);
                }
                const handler = helperHandler.e118;
                const args = await x33(handler, 'helper', helperName);
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
                                    return x77(componentObject, appInstance, blockName, callback);
                                });
                                break;
                            case ENABLE_ARGUMENT_KEY:
                                injectableArguments.push((elementName) => {
                                    return e78(componentObject, appInstance, elementName);
                                });
                                break;
                            case DISABLE_ARGUMENT_KEY:
                                injectableArguments.push((elementName) => {
                                    return a68(componentObject, appInstance, elementName);
                                });
                                break;
                            case PATCH_ARGUMENT_KEY:
                                injectableArguments.push((elementName) => {
                                    return a31(componentObject, appInstance, elementName !== null && elementName !== void 0 ? elementName : null);
                                });
                                break;
                            case PARENT_ARGUMENT_KEY:
                                injectableArguments.push(a13(componentObject, appInstance));
                                break;
                            case APP_ARGUMENT_KEY:
                                injectableArguments.push(x2(componentObject, appInstance));
                                break;
                            case CHILDREN_ARGUMENT_KEY:
                                injectableArguments.push(x9(componentObject, appInstance));
                                break;
                            default:
                                break;
                        }
                        continue;
                    }
                    const handlerType = e7(arg, appInstance);
                    if (handlerType === 'service') {
                        const depService = await x35(arg, appInstance);
                        injectableArguments.push(depService);
                        continue;
                    }
                    if (handlerType === 'factory') {
                        const depFactory = await a34(arg, appInstance);
                        injectableArguments.push(depFactory);
                        continue;
                    }
                    if (handlerType === 'helper') {
                        const depHelper = await x42(arg, scopeObject, componentObject, appInstance);
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
    function e19(componentObject, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                if (componentObject.a102() !== null) {
                    resolve();
                    return;
                }
                const componentName = componentObject.e121();
                const componentLibrary = appInstance.e79().e111;
                const componentHandler = componentLibrary.a102(componentName);
                if (componentHandler === null) {
                    throw new Error(`${x130} Unregistered component callback ${componentName}.`);
                }
                const allArguments = await x33(componentHandler, 'component', componentName);
                const scopeObject = {};
                const allChildComponentNames = componentObject.x80().map(childName => childName.substring(1, childName.length));
                const injectableArguments = [];
                for (let i = 0; i < allArguments.length; i++) {
                    const argument = allArguments[i];
                    if (argument === SCOPE_ARGUMENT_KEY) {
                        injectableArguments.push(scopeObject);
                        componentObject.x69(scopeObject);
                        continue;
                    }
                    if (argument.charAt(0) === '$') {
                        switch (argument) {
                            case BLOCK_ARGUMENT_KEY:
                                injectableArguments.push((blockName, callback) => {
                                    return x77(componentObject, appInstance, blockName, callback);
                                });
                                break;
                            case ENABLE_ARGUMENT_KEY:
                                injectableArguments.push((elementName) => {
                                    return e78(componentObject, appInstance, elementName);
                                });
                                break;
                            case DISABLE_ARGUMENT_KEY:
                                injectableArguments.push((elementName) => {
                                    return a68(componentObject, appInstance, elementName);
                                });
                                break;
                            case PATCH_ARGUMENT_KEY:
                                injectableArguments.push((elementName) => {
                                    return a31(componentObject, appInstance, elementName !== null && elementName !== void 0 ? elementName : null);
                                });
                                break;
                            case PARENT_ARGUMENT_KEY:
                                injectableArguments.push(a13(componentObject, appInstance));
                                break;
                            case APP_ARGUMENT_KEY:
                                injectableArguments.push(x2(componentObject, appInstance));
                                break;
                            case CHILDREN_ARGUMENT_KEY:
                                injectableArguments.push(x9(componentObject, appInstance));
                                break;
                            default:
                                break;
                        }
                        continue;
                    }
                    /** Service injection */
                    const service = appInstance.e79().a119.a102(argument);
                    if (service !== null) {
                        injectableArguments.push(await x35(argument, appInstance));
                        continue;
                    }
                    /** Factory injection */
                    const factory = appInstance.e79().a120.a102(argument);
                    if (factory !== null) {
                        injectableArguments.push(await a34(argument, appInstance));
                        continue;
                    }
                    /** Helper injection */
                    const helper = appInstance.e79().e128.a102(argument);
                    if (helper !== null) {
                        injectableArguments.push(await x42(argument, scopeObject, componentObject, appInstance));
                        continue;
                    }
                    /** Component Injection */
                    if (!allChildComponentNames.includes(argument)) {
                        throw new Error(`${x130} @${argument} is not a child component of ${componentName}`);
                    }
                    /** Get all children with that child component names */
                    const componentElementImplementation = a54.e55(appInstance.a95(), appInstance, componentObject.x129());
                    if (componentElementImplementation === null) {
                        console.warn(`${a123} unable to find element with xid "${componentObject.x129()}"`);
                        continue;
                    }
                    const childXids = a54.e4(componentElementImplementation, appInstance, componentObject, argument);
                    const wrapper = {};
                    for (let n = 0; n < childXids.length; n++) {
                        const childXid = childXids[n];
                        const childComponentObject = appInstance.a67().e111.x134()[childXid];
                        await e19(childComponentObject, appInstance);
                        wrapper[childXid] = childComponentObject;
                    }
                    const componentProxy = new Proxy(wrapper, {
                        get: function get(target, name) {
                            return function wrapper() {
                                const args = Array.prototype.slice.call(arguments);
                                const returns = [];
                                for (const xid in target) {
                                    const componentInstance = target[xid];
                                    const handler = componentInstance.a102();
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
                                            console.warn(`strawberry.js calling undefined member property or method "${name.toString()}" from component "${componentInstance.e121()}"`);
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
                componentObject.a101(handler);
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

    function x20(component, childComponentIds, appInstance) {
        for (let i = 0; i < childComponentIds.length; i++) {
            const childComponentId = childComponentIds[i];
            const element = a54.e55(component, appInstance, childComponentId);
            if (element !== null) {
                element.innerHTML = '';
            }
        }
    }

    function x14() {
        return document.implementation.createHTMLDocument().body;
    }

    function e59(bindFrom, bindTo) {
        if (bindFrom === null)
            return;
        while (bindFrom.childNodes.length > 0) {
            bindTo.appendChild(bindFrom.childNodes[0]);
        }
    }

    function x47(bindFromEl, bindToEl, appInstance, childComponentIds) {
        const temporaryChildren = {};
        for (let i = 0; i < childComponentIds.length; i++) {
            const childComponentId = childComponentIds[i];
            const childTemporaryElement = x14();
            const childActualComponent = a54.e55(bindToEl, appInstance, childComponentId);
            if (childActualComponent !== null) {
                e59(childActualComponent, childTemporaryElement);
                temporaryChildren[childComponentId] = childTemporaryElement;
            }
        }
        bindToEl.innerHTML = '';
        e59(bindFromEl, bindToEl);
        for (const childComponentId in temporaryChildren) {
            const childActualComponent = a54.e55(bindToEl, appInstance, childComponentId);
            if (childActualComponent === null)
                continue;
            e59(temporaryChildren[childComponentId], childActualComponent);
        }
    }

    function a70(element, comment) {
        if (null !== element) {
            element.innerHTML = '';
            if (element.parentNode !== null) {
                element.outerHTML = '<!-- strawberry.js: ' + element.outerHTML + ' | ' + comment + ' -->';
            }
        }
    }

    function a96(element, appInstance) {
        const lockAttrName = a54.x112(LOCK_ID_ATTR_KEY, appInstance);
        element.setAttribute(lockAttrName, LOCK_ID_ATTR_VALUE);
    }

    function x60(element, appInstance) {
        const lockAttrName = a54.x112(LOCK_ID_ATTR_KEY, appInstance);
        return (element.getAttribute(lockAttrName) !== null);
    }

    function x21(element, eventName, appInstance) {
        const lockAttrName = a54.x112(EVENT_ELEMENT_ATTR, appInstance);
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

    function a49(element, eventName, appInstance) {
        const lockAttrName = a54.x112(EVENT_ELEMENT_ATTR, appInstance);
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

    function e39(appInstance) {
        const xAppElements = a54.a15(document.body, appInstance, STRAWBERRY_ATTRIBUTE);
        let appElement = null;
        for (let i = 0; i < xAppElements.length; i++) {
            const element = xAppElements[i];
            if (element.tagName !== 'TEMPLATE') {
                appElement = element;
            }
        }
        if (appElement === null) {
            throw new Error(`strawberry.js no live app element found for ${appInstance.x105()}`);
        }
        return appElement;
    }

    function a1(attributeWithValue, componentObject, appInstance) {
        const componentChildIds = componentObject.a94();
        let selector = '';
        for (let i = 0; i < componentChildIds.length; i++) {
            const childId = componentChildIds[i];
            const childXidAttrName = a54.a30(STRAWBERRY_ID_ATTR, appInstance, childId);
            selector += ':not([' + childXidAttrName + '])';
        }
        selector += ` > [${attributeWithValue}]`;
        if (componentChildIds.length === 0) {
            const xidAttrName = a54.a30(STRAWBERRY_ID_ATTR, appInstance, componentObject.x129());
            selector = `[${xidAttrName}] [${attributeWithValue}]`;
        }
        const componentElement = a54.e55(e39(appInstance), appInstance, componentObject.x129());
        if (componentElement === null)
            return null;
        return componentElement.querySelectorAll(selector);
    }

    function a8(componentObject, appInstance) {
        const temporaryElement = x14();
        const componentElement = a54.e55(e39(appInstance), appInstance, componentObject.x129());
        if (componentElement === null)
            return null;
        temporaryElement.innerHTML = componentElement.innerHTML;
        const componentChildIds = componentObject.a94();
        for (let i = 0; i < componentChildIds.length; i++) {
            const componentChildId = componentChildIds[i];
            const childComponentElement = a54.e55(temporaryElement, appInstance, componentChildId);
            if (childComponentElement !== null) {
                childComponentElement.innerHTML = '';
            }
        }
        return temporaryElement.innerHTML;
    }
    const x41 = (existingComponentId, currentId) => {
        return existingComponentId + '.' + currentId;
    };
    const a50 = (Ids) => {
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
    class e43 {
        constructor() {
            this.a113 = {};
        }
        a115(key, component) {
            this.a113[key] = component;
        }
        x134() {
            return this.a113;
        }
    }
    class a61 {
        constructor() {
            this.a113 = {};
        }
        a115(serviceName, handleOb) {
            if (serviceName in this.a113)
                return null;
            this.a113[serviceName] = handleOb;
        }
        e107(serviceName) {
            if (!(serviceName in this.a113))
                return null;
            return this.a113[serviceName];
        }
    }


    /**
     * The App library contains all the registered Components, Services,
     * and Factories declared from the frontend.
     */
    class x97 {
        constructor() {
            this.e111 = new e43;
            this.a119 = new a61;
        }
    }
    class a27 {
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
        e131(id) {
            this._componentId = id;
            return this;
        }
        a124(name) {
            this._componentName = name;
            return this;
        }
        x129() {
            return this._componentId;
        }
        e121() {
            return this._componentName;
        }
        a86(name) {
            if (!this._componentChildNames.includes(name)) {
                this._componentChildNames.push(name);
            }
        }
        x106(id) {
            if (!this._componentChildIds.includes(id)) {
                this._componentChildIds.push(id);
            }
        }
        x80() {
            return this._componentChildNames;
        }
        a94() {
            return this._componentChildIds;
        }
        a101(handler) {
            if (this._componentHandler === null) {
                this._componentHandler = handler;
            }
        }
        a102() {
            return this._componentHandler;
        }
        x69(scopeObject) {
            if (this._scopeRefObject === null) {
                this._scopeRefObject = scopeObject;
            }
        }
        a71() {
            return this._scopeRefObject;
        }
        a22(name, state, template) {
            if (this._namedElementsRegistry.hasOwnProperty(name))
                return null;
            if (state === null)
                return null;
            this._namedElementsRegistry[name] = {
                _namedElementState: state,
                _namedElementTemplate: template
            };
        }
        x17(name) {
            if (!this._namedElementsRegistry.hasOwnProperty(name))
                return null;
            return this._namedElementsRegistry[name]._namedElementState;
        }
        e11(name) {
            if (!this._namedElementsRegistry.hasOwnProperty(name))
                return null;
            return this._namedElementsRegistry[name]._namedElementTemplate;
        }
        e18(name, state) {
            if (!this._namedElementsRegistry.hasOwnProperty(name))
                return;
            this._namedElementsRegistry[name]._namedElementState = state;
        }
        x58(html) {
            this._componentHtmlTemplate = html;
        }
        x56() {
            return this._componentHtmlTemplate;
        }
    }
    /**
     * Serves as a proxy or intermediary for interacting with a HTML document implementation,
     * abstract the details of creating, modifying, or managing documents.
     */
    class a5 {
        constructor(name) {
            this.x72 = document.implementation.createHTMLDocument(name);
        }
    }
    /**
     * The `StrawberryElement` class provides a wrapper around the Element object,
     * offering additional abstraction for managing states, scope, and other
     * non-default features.
     */
    class a40 {
        /**
         * @param element - The Element
         * @param pcount - The number of iteration of parent created
         */
        constructor(element, pcount = null) {
            this.$element = element;
            this.x87 = null;
            this.e108(pcount !== null && pcount !== void 0 ? pcount : 1);
        }
        /** Wraps the parent element within `StrawberryElement` object */
        e108(count) {
            const parentElement = this.$element.parentElement;
            if (count > 3 || parentElement === null)
                return;
            this.$parent = new a40(parentElement, count++);
        }
        /** Retrieves the $element */
        get() {
            return this.$element;
        }
        /** Retrieves the state */
        getState() {
            return this.x87;
        }
        setState(state) {
            if (state === null)
                return;
            this.x87 = state;
        }
        setScope(scope) {
            this.a125 = scope;
        }
        getScope() {
            return this.a125;
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

    class a116 {
        /**
         * @method _resolveExpression
         * Resolves an expression based on a given object
         * @param object baseObj
         * @param string expression
         *
         * @returns the value of the resolved expression
         */
        x44(baseObj, expression, element = null) {
            // We first determine what type of expression we will need to resolve.
            // This will be based on the structure of the operation
            let resolveType = this.a73(expression);
            // This is where the actual resolve process takes place
            return this.a126(baseObj, expression, resolveType, element);
        }
        /**
         * @method _getResolveType
         * Determines the type of an expression
         * @param string expression
         * @returns type of expression
         *
         * @NOTE: the expression should always have to be a string!
         */
        a73(expression) {
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
        a126(scopeObj, expression, resolveType, element = null) {
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
                    return this.a109(scopeObj, expression);
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
                                argObj.push(this.x44(argScope, splitFunctionArguments[i]));
                            }
                            if (element !== null) {
                                argObj.push(new a40(element));
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
                            argObj.push(new a40(element));
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
                        let refObject = this.x44(scopeObj, this.x36(funcStruct[0]));
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
                        return isNotTheSame(this.x44(scopeObj, comparables[0].trim()), this.x44(scopeObj, comparables[1].trim()));
                    } else if (expression.includes('==')) {
                        let comparables = expression.split('==');
                        return isTheSame(this.x44(scopeObj, comparables[0].trim()), this.x44(scopeObj, comparables[1].trim()));
                    } else if (expression.includes('is not ')) {
                        let comparables = expression.split('is not');
                        return isNotTheSame(this.x44(scopeObj, comparables[0].trim()), this.x44(scopeObj, comparables[1].trim()));
                    } else if (expression.includes('is ')) {
                        let comparables = expression.split('is');
                        return isTheSame(this.x44(scopeObj, comparables[0].trim()), this.x44(scopeObj, comparables[1].trim()));
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
                            let left = this.x44(scopeObj, exp[0].trim());
                            var right = this.x44(scopeObj, exp[1].trim());
                            finalExpression = left + operations[i] + right;
                        }
                    }
                    return eval(finalExpression);
                    break;
            }
        }
        a109(scopeObj, objectExpression) {
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
        x36(expression) {
            let expressionPieces = expression.split('.');
            if (expressionPieces.length < 2)
                return '$scope';
            expressionPieces.pop();
            return expressionPieces.join('.');
        }
        e45(expression) {
            let expressionPieces = expression.split('.');
            return expressionPieces[expressionPieces.length - 1];
        }
        a23(baseObj, objExpression) {
            let parentObjExpression = this.x36(objExpression);
            return this.x44(baseObj, parentObjExpression);
        }
    } {};



    class a37 {
        constructor() {
            this.e38 = [];
        }
        onReady(callBack) {
            this.e38.push(callBack);
            return (this.e38.length) - 1;
        }
    }
    /**
     * The internal version of the Strawberry application
     */
    class e81 {
        constructor({
            e132,
            x135
        }) {
            this.a133 = new a5(e132);
            this.e110 = new a103;
            this.a98 = new x97;
            this.a82 = {
                prefix: 'x'
            };
            this.x135 = x135;
            this.e132 = e132;
            this.a62 = new a37;
            this.x99 = false;
            this.x74 = false;
        }
        x129() {
            return this.x135;
        }
        /**
         * Returns the name of the strawberry app instance
         */
        x105() {
            return this.e132;
        }
        /**
         * Sets the raw HTML body of the Strawberry app instance
         * @param content
         */
        e100(content) {
            this.a133.x72.body.innerHTML = content;
        }
        a95() {
            return this.a133.x72.body;
        }
        /**
         * Sets the Configuration of the Strawberry app instance
         * @param configuration
         */
        e51(configuration) {
            this.a82 = configuration;
        }
        e48() {
            return this.a82;
        }
        /**
         * Retreieves the App Library
         * @see a103
         */
        e79() {
            return this.e110;
        }
        /**
         * Retreieves the App Registry
         * @see x97
         */
        a67() {
            return this.a98;
        }
        x75() {
            this.x99 = true;
            this.a62.e38.forEach(async (callback) => {
                await Promise.resolve(callback());
            });
            this.x74 = true;
        }
        e29() {
            return this.a62;
        }
        e122() {
            return this.x99;
        }
        e104() {
            return this.x74;
        }
    }

    function e28(targetElement, componentObject, appInstance) {
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
                        const scopeObject = componentObject.a71();
                        if (scopeObject === null)
                            return;
                        let resolvedExpression = new a116().x44(scopeObject, allMatchedData[i].trim());
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


    function a88(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allBlockElements = a54.a15(targetElement, appInstance, BLOCK_ELEMENT_ATTR);
                for (let i = 0; i < allBlockElements.length; i++) {
                    const element = allBlockElements[i];
                    const blockElName = a54.a26(element, appInstance.e48().prefix, BLOCK_ELEMENT_ATTR);
                    if (blockElName === null)
                        continue;
                    if (blockElName.includes("\\")) {
                        throw new Error('Invalid character within the block element name');
                    }
                    /** Retrieving and registering the template */
                    const componentTemplate = componentObject.x56();
                    const tempCompEl = x14();
                    tempCompEl.innerHTML = componentTemplate;
                    const selector = a54.a30(BLOCK_ELEMENT_ATTR, appInstance, blockElName);
                    const tempBlockEl = tempCompEl.querySelector(`[${selector}]`);
                    if (tempBlockEl === null)
                        continue;
                    if (null === componentObject.x17(blockElName)) {
                        componentObject.a22(blockElName, 'registered', tempBlockEl.innerHTML);
                    }
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }



    function a83(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allCheckedElements = a54.a15(targetElement, appInstance, CHECK_ELEMENT_ATTR);
                for (let i = 0; i < allCheckedElements.length; i++) {
                    const element = allCheckedElements[i];
                    if (x60(element, appInstance))
                        continue;
                    const argument = a54.a26(element, appInstance.e48().prefix, CHECK_ELEMENT_ATTR);
                    const scopeObject = componentObject.a71();
                    if (scopeObject === null || argument === null)
                        continue;
                    const evalauted = new a116().x44(scopeObject, argument);
                    if (typeof evalauted === 'boolean') {
                        evalauted ? element.setAttribute('checked', '') : element.removeAttribute('checked');
                    }
                    a96(element, appInstance);
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }

    function a63(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allDisabledElements = a54.a15(targetElement, appInstance, DISABLE_ELEMENT_ATTR);
                for (let i = 0; i < allDisabledElements.length; i++) {
                    const element = allDisabledElements[i];
                    const elementName = a54.a26(element, appInstance.e48().prefix, DISABLE_ELEMENT_ATTR);
                    if (elementName === null)
                        continue;
                    if (elementName.includes("\\")) {
                        throw new Error('Invalid character within the disabled element name');
                    }
                    if (null === componentObject.x17(elementName)) {
                        componentObject.a22(elementName, 'disabled', '');
                    }
                    element.disabled = (componentObject.x17(elementName) === 'disabled');
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }

    function a64(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allEnabledElements = a54.a15(targetElement, appInstance, ENABLE_ELEMENT_ATTR);
                for (let i = 0; i < allEnabledElements.length; i++) {
                    const element = allEnabledElements[i];
                    const elementName = a54.a26(element, appInstance.e48().prefix, ENABLE_ELEMENT_ATTR);
                    if (elementName === null)
                        continue;
                    if (elementName.includes("\\")) {
                        throw new Error('Invalid character within the enabled element name');
                    }
                    if (null === componentObject.x17(elementName)) {
                        componentObject.a22(elementName, 'enabled', '');
                    }
                    element.disabled = (componentObject.x17(elementName) === 'disabled');
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }



    function e89(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                /**
                 * This function adds event listener to elements which is bound to a function
                 * within the component scope
                 */
                const x117 = function(scopeObject, eventElement, fnExpression, eventType) {
                    if (new a116().a73(fnExpression) !== 'function')
                        return;
                    eventElement.addEventListener(eventType, () => {
                        new a116().x44(scopeObject, fnExpression, eventElement);
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
                    const allEventElements = a54.a15(targetElement, appInstance, event.attr);
                    for (let k = 0; k < allEventElements.length; k++) {
                        const element = allEventElements[k];
                        const fnExpression = a54.a26(element, appInstance.e48().prefix, event.attr);
                        if (x21(element, event.type, appInstance))
                            continue;
                        const scopeObject = componentObject.a71();
                        if (scopeObject === null || fnExpression == null)
                            continue;
                        x117(componentObject.a71(), element, fnExpression, event.type);
                        a49(element, event.type, appInstance);
                    }
                }
                resolve(null);
            } catch (error) {
                reject(null);
            }
        });
    }



    function e24(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                /** Retrieving all elements with ifs conditional */
                const ifsElements = a54.a15(targetElement, appInstance, IF_ELEMENT_ATTR);
                for (let i = 0; i < ifsElements.length; i++) {
                    const ifsElement = ifsElements[i];
                    if (!x60(ifsElement, appInstance)) {
                        const ifsArgument = a54.a26(ifsElement, appInstance.e48().prefix, IF_ELEMENT_ATTR);
                        const scopeObject = componentObject.a71();
                        if (scopeObject === null || ifsArgument === null)
                            continue;
                        const resolvedIfsValue = new a116().x44(scopeObject, ifsArgument);
                        if (typeof resolvedIfsValue === 'boolean' && !resolvedIfsValue) {
                            a70(ifsElement, 'false');
                        }
                        a96(ifsElement, appInstance);
                    }
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }


    function a84(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                /**
                 * This function attemps to add an undefined model as part of the scope.
                 * For example, if you assign `xmodel="user.firstName"`, but firstName
                 * is not defined in $scope.user, then this function will add firstName
                 * as member property of $scope.user automatically
                 */
                const e52 = (scopeObject, modelExpression, modelValue) => {
                    const parentObj = new a116().a23(scopeObject, modelExpression);
                    const childObjExpression = new a116().e45(modelExpression);
                    if (undefined !== parentObj)
                        parentObj[childObjExpression] = modelValue;
                };
                const a53 = (modelElement, modelState) => {
                    (typeof modelState == 'boolean' && modelState) ?
                    modelElement.setAttribute('checked', ''):
                        modelElement.removeAttribute('checked');
                };
                const allModelElements = a54.a15(targetElement, appInstance, MODEL_ELEMENT_ATTR);
                for (let i = 0; i < allModelElements.length; i++) {
                    const element = allModelElements[i];
                    if (element === null)
                        continue;
                    const argument = a54.a26(element, appInstance.e48().prefix, MODEL_ELEMENT_ATTR);
                    const myScopeObject = componentObject.a71();
                    if (myScopeObject === null || argument === null)
                        continue;
                    const evaluated = new a116().x44(myScopeObject, argument);
                    let isValueStringType = true;
                    if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                        if ((element instanceof HTMLInputElement)) {
                            const elementType = element.type;
                            if (elementType === 'radio' || elementType === 'checkbox') {
                                isValueStringType = false;
                                (evaluated === undefined) ?
                                e52(myScopeObject, argument, false):
                                    a53(element, evaluated);
                            }
                            if (elementType === 'text' || elementType === 'password' || element.type === 'email') {
                                (evaluated === undefined) ?
                                e52(myScopeObject, argument, element.value):
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
                                    e52(myScopeObject, argument, inputDate);
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
                                    e52(myScopeObject, argument, inputDate);
                                }
                                const hours = (inputDate.getHours() < 10) ? '0' + inputDate.getHours() : inputDate.getHours();
                                const minutes = (inputDate.getMinutes() < 10) ? '0' + inputDate.getMinutes() : inputDate.getMinutes();
                                const elementValue = hours + ':' + minutes;
                                element.value = elementValue;
                            }
                        }
                        if ((element instanceof HTMLSelectElement)) {
                            (evaluated === undefined) ?
                            e52(myScopeObject, argument, element.value):
                                element.value = evaluated;
                        }
                        element.addEventListener('change', (event) => {
                            const target = event.target;
                            if (target instanceof HTMLInputElement) {
                                if (target.type === 'date') {
                                    const newevaluated = new a116().x44(myScopeObject, argument);
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
                                    e52(myScopeObject, argument, newevaluated);
                                    return;
                                }
                                if (target.type === 'time') {
                                    const newevaluated = new a116().x44(myScopeObject, argument);
                                    const [shour, sminute] = target.value.split(':');
                                    const hour = parseInt(shour);
                                    const minute = parseInt(sminute);
                                    if (!(newevaluated instanceof Date)) {
                                        throw new Error(`strawberry.js: [RenderError] Models assigned to Date and/or Time elements must be instance of Date object`);
                                    }
                                    newevaluated.setHours(hour);
                                    newevaluated.setMinutes(minute);
                                    e52(myScopeObject, argument, newevaluated);
                                    return;
                                }
                                e52(myScopeObject, argument, (isValueStringType) ? target.value : target.checked);
                            }
                            if (target instanceof HTMLSelectElement) {
                                e52(myScopeObject, argument, target.value);
                            }
                        });
                    }
                    if (element.tagName === 'TEXTAREA' && (element instanceof HTMLTextAreaElement)) {
                        (evaluated === undefined) ?
                        e52(myScopeObject, argument, element.value):
                            element.value = evaluated;
                        element.addEventListener('change', () => {
                            e52(myScopeObject, argument, element.value);
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
    function e12(expression) {
        if (expression.includes('until '))
            return [REPEAT_REFERENCE_TOKEN, expression.split('until')[1].trim()];
        return [
            expression.split(' as ')[0].trim(),
            expression.split(' as ')[1].trim()
        ];
    }

    function a90(targetElement, componentObject, appInstance) {
        return new Promise(async (resolve, reject) => {
            try {
                /** Retrieving all repeatable elements */
                const repeatableElements = a54.a15(targetElement, appInstance, REPEAT_ELEMENT_ATTR);
                const scopeObject = componentObject.a71();
                if (scopeObject === null)
                    return resolve(null);
                /** Looping through repeatable elements */
                for (let i = 0; i < repeatableElements.length; i++) {
                    let repeatableElement = repeatableElements[i];
                    let htmlTemplate = repeatableElement.innerHTML;
                    repeatableElement.innerHTML = '';
                    let expression = a54.a26(repeatableElement, appInstance.e48().prefix, REPEAT_ELEMENT_ATTR);
                    if (expression === null)
                        continue;
                    let [refObjName, aliasObjName] = e12(expression);
                    if (refObjName === REPEAT_REFERENCE_TOKEN) {
                        // This creates a new object that we can loop through
                        let repetitions = (new a116().x44(scopeObject, aliasObjName));
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
                    const repeatableObject = new a116().x44(scopeObject, refObjName);
                    if (undefined !== repeatableObject && null !== repeatableObject) {
                        let j = 0;
                        for (const [key, value] of Object.entries(repeatableObject)) {
                            // Creating an invidual component for each repititions
                            let childTempComponent = new a27();
                            childTempComponent.x69({
                                $parent: scopeObject,
                                $index: j++,
                                [aliasObjName]: repeatableObject[key]
                            });
                            const childRepeatElement = x14();
                            childRepeatElement.innerHTML = htmlTemplate;
                            await x85(childRepeatElement, childTempComponent, appInstance, true);
                            e59(childRepeatElement, repeatableElement);
                        }
                    }
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }



    function e91(targetElement, componentObject, appInstance) {
        return new Promise((resolve, reject) => {
            try {
                const allStyleElements = a54.a15(targetElement, appInstance, STYLE_ELEMENT_ATTR);
                for (let i = 0; i < allStyleElements.length; i++) {
                    const element = allStyleElements[i];
                    if (x60(element, appInstance))
                        continue;
                    const argument = a54.a26(element, appInstance.e48().prefix, STYLE_ELEMENT_ATTR);
                    const scopeObject = componentObject.a71();
                    if (scopeObject === null || argument === null)
                        continue;
                    let evaulated = new a116().x44(scopeObject, argument);
                    if (evaulated !== null && evaulated !== '' && evaulated !== undefined) {
                        element.classList.add(evaulated);
                    }
                    a96(element, appInstance);
                }
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    }




    function x85(targetElement, componentObject, appInstance, skipEvents = false) {
        return new Promise(async (resolve, reject) => {
            try {
                await a90(targetElement, componentObject, appInstance);
                await e24(targetElement, componentObject, appInstance);
                await e28(targetElement, componentObject, appInstance);
                await a83(targetElement, componentObject, appInstance);
                await e91(targetElement, componentObject, appInstance);
                await a84(targetElement, componentObject, appInstance);
                await a63(targetElement, componentObject, appInstance);
                await a64(targetElement, componentObject, appInstance);
                await a88(targetElement, componentObject, appInstance);
                if (!skipEvents) {
                    await e89(targetElement, componentObject, appInstance);
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
            const appInstance = new e81({
                x135: instanceId++,
                e132: name
            });
            if (config !== undefined) {
                appInstance.e51(config);
            }
            StrawberryAppInstances.push(appInstance);
            return {
                component: (name, handler) => {
                    appInstance.e79().e111.a101(`@${name}`, handler);
                },
                factory: (name, handler) => {
                    appInstance.e79().a120.a115(name, handler);
                },
                service: (name, handler) => {
                    appInstance.e79().a119.a115(name, handler);
                },
                helper: (name, handler) => {
                    appInstance.e79().e128.a115(name, handler);
                }
            };
        }
    };
    const strawberry = window['strawberry'] = AppPublicAPI;
    DOMHelper.ready(() => {
        StrawberryAppInstances.forEach(async (appInstance) => {
            try {
                const [appElement, templateElement] = x57(appInstance);
                /** We'll add the App Template HTML content to the appInstance object */
                appInstance.e100(templateElement.innerHTML);
                /** Compiling all components in the App Template, and their dependencies.*/
                const xcomponent = a54.x112(COMPONENT_ELEMENT_ATTR, appInstance);
                let componentEls = appInstance.a95().querySelectorAll(`[${xcomponent}]`);
                let componentId = 0;
                for (let i = 0; i < componentEls.length; i++) {
                    /** Component Element */
                    const componentEl = componentEls[i];
                    const componentName = a54.a26(componentEl, appInstance.e48().prefix, COMPONENT_ELEMENT_ATTR);
                    if (componentName === null) {
                        continue;
                    }
                    /** Component IDs would have to be embedded to the xid attribute */
                    const xid = appInstance.x129().toString() + '.' + (componentId++).toString();
                    const xidAttr = a54.x112('id', appInstance);
                    componentEl.setAttribute(xidAttr, xid);
                    /**
                     * Retrieving component templates, as well as the templates of their dependencies,
                     * and the dependencies of their dependencies.
                     */
                    componentEl.innerHTML = await e16(xid, componentEl, appInstance, [componentName]);
                }
                const componentObjects = appInstance.a67().e111.x134();
                const componentIdsList = [];
                for (const componentId in componentObjects) {
                    componentIdsList.push(componentId);
                    await e19(componentObjects[componentId], appInstance);
                }
                for (const componentId in componentObjects) {
                    const componentTemporaryElement = x14();
                    componentTemporaryElement.innerHTML = componentObjects[componentId].x56();
                    x20(componentTemporaryElement, componentObjects[componentId].a94(), appInstance);
                    componentObjects[componentId].x58(componentTemporaryElement.innerHTML);
                }
                /** Rendering phase */
                for (const componentId in componentObjects) {
                    const targetElement = a54.e55(appInstance.a95(), appInstance, componentId);
                    /**
                     * This happens for the following circumstances:
                     * - When the component is added inside an xif element
                     */
                    if (targetElement === null)
                        continue;
                    const temporaryElement = x14();
                    temporaryElement.innerHTML = targetElement.innerHTML;
                    x20(temporaryElement, componentObjects[componentId].a94(), appInstance);
                    await x85(temporaryElement, componentObjects[componentId], appInstance);
                    x47(temporaryElement, targetElement, appInstance, componentObjects[componentId].a94());
                }
                e59(appInstance.a95(), appElement);
                appInstance.x75();
            } catch (error) {
                console.error(error);
            }
        });
    });
})();