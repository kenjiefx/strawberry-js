import { TypeofFactory } from "../libraries/factory"
import { __StrawberryComponent } from "../models/component"
import { ScopeObject } from "../models/scope"
import { __StrawberryApp } from "../models/strawberry"
import { __strawberryAppReferenceService } from "../services/$app"
import { __blocksService } from "../services/$block"
import { __childrenReferenceService } from "../services/$children"
import { __disableService } from "../services/$disable"
import { __enableService } from "../services/$enable"
import { __parentReferenceService } from "../services/$parent"
import { __patchEntityService } from "../services/$patch"
import { APP_ARGUMENT_KEY, BLOCK_ARGUMENT_KEY, CHILDREN_ARGUMENT_KEY, COMPONENT_ELEMENT_ATTR, DISABLE_ARGUMENT_KEY, ENABLE_ARGUMENT_KEY, PARENT_ARGUMENT_KEY, PATCH_ARGUMENT_KEY, SCOPE_ARGUMENT_KEY, STRAWBERRY_ATTRIBUTE, __AttributeHelper } from "./attributes"
import { __createComponentId } from "./id.helpers"

const __error = 'strawberry.js: [BootError]'
const __warning = 'strawberry.js: [BootWarning]'

export function __getAppInstances(appInstance:__StrawberryApp): [Element, HTMLTemplateElement]{
    let targetElement:   Element|null = null
    let templateElement: HTMLTemplateElement | null = null
    try {
        const selector = __AttributeHelper.__makeXAttrWithValue(
            STRAWBERRY_ATTRIBUTE,
            appInstance,
            appInstance.__getAppName()
        )
        const domInstances = document.querySelectorAll(`[${selector}]`)

        if (domInstances.length===0) {
            throw new Error(`${__error} Unable to find element ${selector}.`)
        }

        if (domInstances.length>2) {
            throw new Error(`${__error} There are appears to be multiple instances of element ${selector}.`)
        }
        for (let i = 0; i < domInstances.length; i++) {
            const domInstance = domInstances[i]
            if (domInstance.tagName==='TEMPLATE') {
                templateElement = domInstance as HTMLTemplateElement
                continue
            } 
            targetElement = domInstance
        }
    } catch (error) {
        console.error(error)
    }
    if (targetElement===null || templateElement===null) {
        throw new Error()
    }
    return [targetElement,templateElement]
}


export function __bootComponentTemplates(
    componentId:   string,
    component:     Element,
    appInstance:   __StrawberryApp,
    componentTree: Array<string>):Promise<string>{
    return new Promise(async (resolve,reject)=>{
        try {
            let compiledComponentHtml = ''

            // First, we'll check if component has declared template
            const componentName = __AttributeHelper.__getXValueFromElAttr(
                component,
                appInstance.__getConfiguration().prefix,
                COMPONENT_ELEMENT_ATTR
            )

            if (componentName===null) {
                throw new Error(`${__error} a component has no component name attribute.`)
            }

            const componentAttribute = __AttributeHelper.__makeXAttrWithValue(
                COMPONENT_ELEMENT_ATTR,
                appInstance,
                componentName
            )
            const componentSelector         = `template[${componentAttribute}]`
            const componentTemplateElements = document.querySelectorAll(componentSelector)

            if (componentTemplateElements.length===0) {
                throw new Error(`strawberry.js: [BootError] Unable to find Component template ${componentSelector}.`)
            }
            if (componentTemplateElements.length>1) {
                throw new Error(`strawberry.js: [BootError] There are appears to be multiple instances of Component template ${componentSelector}.`)
            }

            /** Creating the Component Object */
            const componentObject          = new __StrawberryComponent()
            const componentTemplateElement = componentTemplateElements[0] as HTMLTemplateElement
            const componentImplementation  = document.implementation.createHTMLDocument()
            componentImplementation.body.innerHTML = componentTemplateElement.innerHTML

            componentObject.__setId(componentId).__setName(componentName)

            /** Registering the Component in the Library */
            appInstance.__getAppLibrary().__component.__setTemplate(
                componentName,
                componentTemplateElement.innerHTML
            )

            /** Registering the Component Object */
            appInstance.__getAppRegistry().__component.__register(
                componentId,
                componentObject
            )

            /** Retrieving and processing of child components **/
            const selector = __AttributeHelper.__makeXAttr(COMPONENT_ELEMENT_ATTR,appInstance)
            const childComponents = componentImplementation.querySelectorAll(`[${selector}]`)
            for (let i = 0; i < childComponents.length; i++) {

                const childComponent     = childComponents[i]
                const childComponentName = __AttributeHelper.__getXValueFromElAttr(
                    childComponent,
                    appInstance.__getConfiguration().prefix,
                    COMPONENT_ELEMENT_ATTR
                )

                if (childComponentName==null) {
                    console.warn(`${__warning} a child component is declared but no name was provided`)
                    continue
                }

                const childComponentId   = __createComponentId(componentId,i.toString())
                childComponent.setAttribute('xid',childComponentId)

                componentObject.__addChildName(childComponentName)
                componentObject.__addChildId(childComponentId)
                
                if (componentTree.includes(childComponentName)) {
                    throw new Error(`${__error} circular dependency in component "${childComponentName}" detected: ${JSON.stringify(componentTree)}`)
                }
                const childComponentTree = [childComponentName,...componentTree]

                childComponent.innerHTML = await __bootComponentTemplates(
                    childComponentId,
                    childComponent,
                    appInstance,
                    childComponentTree
                )
            }

            compiledComponentHtml += componentImplementation.body.innerHTML
            componentObject.__setHtmlTemplate(compiledComponentHtml)
            resolve(compiledComponentHtml)

        } catch (error) {
            reject(error)
        }
    })
    
}

export function __bootCallbackParser(handler:(...args: any[])=>any,type:'component'|'service'|'factory'|'helper',name:string):Promise<Array<string>>{
    return new Promise((resolve,reject)=>{
        try {
            const handlerStr = handler.toString().split('{')[0]
            const matchedFn  = handlerStr.match(/(?<=\().+?(?=\))/g)
            if (matchedFn===null || /[(={})]/g.test(matchedFn[0])) {
                return resolve([])
            }
            resolve(matchedFn[0].split(','))
        } catch (error) {
            reject(error)
        }
    })
}

function __isServiceOrFactoryOrHelper(name:string,appInstance:__StrawberryApp):'service' | 'factory' | 'helper' | null {
    /** Check if it is a Service */
    let serviceOb = appInstance.__getAppLibrary().__service.__getHandler(name)
    if (serviceOb!==null) return 'service'
    let factorHanlder = appInstance.__getAppLibrary().__factory.__getHandler(name)
    if (factorHanlder!==null) return 'factory'
    const helperObj = appInstance.__getAppLibrary().__helper.__getHandler(name)
    if (helperObj!==null) return 'helper'
    return null
}

export function __bootFactoryHandler(factoryName:string,appInstance:__StrawberryApp):Promise<TypeofFactory>{
    return new Promise(async (resolve,reject)=>{
        try {
            const factoryHandler = appInstance.__getAppLibrary().__factory.__getHandler(factoryName) 
            if (factoryHandler===null) {
                throw new Error(`${__error} unregistered factory callback ${factoryName}.`)
            }
            const args = await __bootCallbackParser(factoryHandler,'service',factoryName)
            const injectableArguments: Array<null|TypeofFactory|{[key: string]: any}> = []
            for (let i = 0; i < args.length; i++) {
                const arg = args[i]
                const handlerType = __isServiceOrFactoryOrHelper(arg,appInstance)
                if (handlerType==='service') {
                    const depService = await __bootServiceHandler(arg,appInstance)
                    injectableArguments.push(depService)
                    continue
                }
                if (handlerType==='factory') {
                    const depFactory = await __bootFactoryHandler(arg,appInstance)
                    injectableArguments.push(depFactory)
                    continue
                }
                if (handlerType==='helper') {
                    throw new Error(`${__error} factories [${factoryName}] are not allowed to have helpers [${arg}] as dependencies.`)
                }
                injectableArguments.push(null)
            }
            const handleInstance = factoryHandler(...injectableArguments)
            if (typeof handleInstance === 'function' && handleInstance.prototype && handleInstance.prototype.constructor === handleInstance) {
                resolve(handleInstance)
                return
            } else {
                throw new Error(`${__error} factory ${factoryName} must return typeof class reference.`)
            }
        } catch (error) {
            reject(error)
        }
    })
}


export function __bootServiceHandler(serviceName:string,appInstance:__StrawberryApp):Promise<{[key:string]:any}|null>{
    return new Promise(async (resolve,reject)=>{
        try {
            let handleOb = appInstance.__getAppRegistry().__service.__getService(serviceName)
            if (handleOb!==null) {
                resolve(handleOb)
                return 
            }
            const serviceLib = appInstance.__getAppLibrary().__service.__getHandler(serviceName)
            if (serviceLib===null) {
                throw new Error(`${__error} Unregistered service callback ${serviceName}.`)
            }

            const serviceHandler = serviceLib.__handler

            const args = await __bootCallbackParser(serviceHandler,'service',serviceName)
            handleOb = {}

            const injectableArguments: Array<null|TypeofFactory|{[key: string]: any}> = []

            for (let i = 0; i < args.length; i++) {
                const arg = args[i]
                const handlerType = __isServiceOrFactoryOrHelper(arg,appInstance)
                if (handlerType==='service') {
                    const depService = await __bootServiceHandler(arg,appInstance)
                    injectableArguments.push(depService)
                    continue
                }
                if (handlerType==='factory') {
                    const depFactory = await __bootFactoryHandler(arg,appInstance)
                    injectableArguments.push(depFactory)
                    continue
                }
                if (handlerType==='helper') {
                    throw new Error(`${__error} services [${serviceName}] are not allowed to have helpers [${arg}] as dependencies.`)
                }
                injectableArguments.push(null)
            }
            
            handleOb = serviceHandler(...injectableArguments)
            if (handleOb===null) {
                return resolve(handleOb)
            }
            appInstance.__getAppRegistry().__service.__register(serviceName,handleOb)

            resolve(handleOb)

        } catch (error) {
            reject(error)
        }
    })
}

const __bootHelperHandler = (helperName:string, scopeObject: ScopeObject, componentObject:__StrawberryComponent, appInstance:__StrawberryApp):Promise<{[key:string]:any}|null> => {
    return new Promise (async (resolve,reject)=>{
        try {
            const helperHandler = appInstance.__getAppLibrary().__helper.__getHandler(helperName) 
            if (helperHandler===null) {
                throw new Error(`${__error} unregistered helper callback ${helperHandler}.`)
            }
            const handler = helperHandler.__handler
            const args = await __bootCallbackParser(handler,'helper',helperName)
            const injectableArguments: Array<null|TypeofFactory|{[key: string]: any}> = []

            for (let i = 0; i < args.length; i++) {
                const arg = args[i]
                if (arg===SCOPE_ARGUMENT_KEY) {
                    injectableArguments.push(scopeObject)
                    continue
                }
                if (arg.charAt(0)==='$') {
                    switch(arg) {
                        case BLOCK_ARGUMENT_KEY: 
                            injectableArguments.push((blockName:string,callback:()=>any)=>{
                                return __blocksService(componentObject,appInstance,blockName,callback)
                            })
                        break;
                        case ENABLE_ARGUMENT_KEY: 
                            injectableArguments.push((elementName:string)=>{
                                return __enableService(componentObject,appInstance,elementName)
                            })
                        break;
                        case DISABLE_ARGUMENT_KEY: 
                            injectableArguments.push((elementName:string)=>{
                                return __disableService(componentObject,appInstance,elementName)
                            })
                        break;
                        case PATCH_ARGUMENT_KEY: 
                            injectableArguments.push((elementName?:string|null)=>{
                                return __patchEntityService(componentObject,appInstance,elementName??null)
                            })
                        break;
                        case PARENT_ARGUMENT_KEY: 
                            injectableArguments.push(__parentReferenceService(componentObject,appInstance))
                        break;
                        case APP_ARGUMENT_KEY: 
                            injectableArguments.push(__strawberryAppReferenceService(componentObject,appInstance))
                        break;
                        case CHILDREN_ARGUMENT_KEY: 
                            injectableArguments.push(__childrenReferenceService(componentObject,appInstance))
                        break;
                        default: 
                        break;
                    }
                    continue
                }
                const handlerType = __isServiceOrFactoryOrHelper(arg,appInstance)
                if (handlerType==='service') {
                    const depService = await __bootServiceHandler(arg,appInstance)
                    injectableArguments.push(depService)
                    continue
                }
                if (handlerType==='factory') {
                    const depFactory = await __bootFactoryHandler(arg,appInstance)
                    injectableArguments.push(depFactory)
                    continue
                }
                if (handlerType==='helper') {
                    const depHelper = await __bootHelperHandler(arg,scopeObject,componentObject,appInstance)
                    injectableArguments.push(depHelper)
                    continue
                }
                injectableArguments.push(null)
            }
            
            const handleObj = handler(...injectableArguments)
            resolve(handleObj)
        } catch (error) {
            reject(error)
        }
    })
}


/** This is where callback functions to components are being executed */
export function __bootComponentHandler(componentObject:__StrawberryComponent,appInstance:__StrawberryApp):Promise<void>{
    return new Promise(async (resolve,reject)=>{
        try {

            if (componentObject.__getHandler()!==null) {
                resolve()
                return 
            }

            const componentName    = componentObject.__getName()
            const componentLibrary = appInstance.__getAppLibrary().__component
            
            const componentHandler = componentLibrary.__getHandler(componentName)
            if (componentHandler===null) {
                throw new Error(`${__error} Unregistered component callback ${componentName}.`)
            }

            const allArguments = await __bootCallbackParser(componentHandler,'component',componentName)

            const scopeObject:ScopeObject = {}
            const allChildComponentNames = componentObject.__getChildNames().map(childName=>childName.substring(1,childName.length))
            
            const injectableArguments: Array<null|TypeofFactory|{[key: string]: any}> = []

            for (let i = 0; i < allArguments.length; i++) {
                const argument = allArguments[i]
                if (argument===SCOPE_ARGUMENT_KEY) {
                    injectableArguments.push(scopeObject)
                    componentObject.__setScopeObject(scopeObject)
                    continue
                }
                if (argument.charAt(0)==='$') {
                    switch(argument) {
                        case BLOCK_ARGUMENT_KEY: 
                            injectableArguments.push((blockName:string,callback:()=>any)=>{
                                return __blocksService(componentObject,appInstance,blockName,callback)
                            })
                        break;
                        case ENABLE_ARGUMENT_KEY: 
                            injectableArguments.push((elementName:string)=>{
                                return __enableService(componentObject,appInstance,elementName)
                            })
                        break;
                        case DISABLE_ARGUMENT_KEY: 
                            injectableArguments.push((elementName:string)=>{
                                return __disableService(componentObject,appInstance,elementName)
                            })
                        break;
                        case PATCH_ARGUMENT_KEY: 
                            injectableArguments.push((elementName?:string|null)=>{
                                return __patchEntityService(componentObject,appInstance,elementName??null)
                            })
                        break;
                        case PARENT_ARGUMENT_KEY: 
                            injectableArguments.push(__parentReferenceService(componentObject,appInstance))
                        break;
                        case APP_ARGUMENT_KEY: 
                            injectableArguments.push(__strawberryAppReferenceService(componentObject,appInstance))
                        break;
                        case CHILDREN_ARGUMENT_KEY: 
                            injectableArguments.push(__childrenReferenceService(componentObject,appInstance))
                        break;
                        default: 
                        break;
                    }
                    continue
                }

                /** Service injection */
                const service = appInstance.__getAppLibrary().__service.__getHandler(argument)
                if (service!==null) {
                    injectableArguments.push(await __bootServiceHandler(argument,appInstance))
                    continue
                }

                /** Factory injection */
                const factory = appInstance.__getAppLibrary().__factory.__getHandler(argument)
                if (factory!==null) {
                    injectableArguments.push(await __bootFactoryHandler(argument,appInstance))
                    continue
                }

                /** Helper injection */
                const helper = appInstance.__getAppLibrary().__helper.__getHandler(argument)
                if (helper!==null) {
                    injectableArguments.push(await __bootHelperHandler(argument,scopeObject,componentObject,appInstance))
                    continue
                }

                /** Component Injection */
                if (!allChildComponentNames.includes(argument)) {
                    throw new Error(`${__error} @${argument} is not a child component of ${componentName}`)
                }
                
                /** Get all children with that child component names */
                const componentElementImplementation = __AttributeHelper.__getElementByXId(
                    appInstance.__getHtmlBody(),
                    appInstance,
                    componentObject.__getId()
                )

                if (componentElementImplementation===null) {
                    console.warn(`${__warning} unable to find element with xid "${componentObject.__getId()}"`)
                    continue
                }


                const childXids = __AttributeHelper.__getXidsOfChildComponentByName(
                    componentElementImplementation,
                    appInstance,
                    componentObject,
                    argument
                )

                const wrapper:{[key:string]:__StrawberryComponent} = {}
                for (let n = 0; n < childXids.length; n++) {
                    const childXid = childXids[n]
                    const childComponentObject = appInstance.__getAppRegistry().__component.__get()[childXid]
                    await __bootComponentHandler(
                        childComponentObject,
                        appInstance
                    )
                    wrapper[childXid] = childComponentObject
                }
                const componentProxy = new Proxy(wrapper, {
                    get: function get(target, name) {
                        return function wrapper() {
                            const args = Array.prototype.slice.call(arguments)
                            const returns:Array<any> = []
                            for (const xid in target) {
                                const componentInstance = target[xid]
                                const handler = componentInstance.__getHandler()
                                if (handler===null) {
                                    continue
                                }
                                if (typeof handler==='string'
                                || typeof handler==='number'
                                || typeof handler==='boolean'
                                ) {
                                    returns.push(handler)
                                    continue
                                }
                                if (typeof handler==='object') {
                                    if (name in handler) {
                                        const handlerInstance = handler[name]
                                        if (handlerInstance instanceof Function) {
                                            returns.push(handlerInstance(...args))
                                        } else {
                                            returns.push(handlerInstance)
                                        }
                                        continue
                                    } else {
                                        console.warn(`strawberry.js calling undefined member property or method "${name.toString()}" from component "${componentInstance.__getName()}"`)
                                    }
                                }
                            }
                            return returns[0]
                        }
                    }
                })
                // Proxy of the component object to be injected
                injectableArguments.push(componentProxy)
            }

            const handler = componentHandler(...injectableArguments)
            componentObject.__setHandler(handler)

            resolve()

            
        } catch (error) {
            reject(error)
        }
    })
}