
import { StrawberryComponent } from "../models/component";
import { StrawberryElement } from "../models/element";
import { TypeofFactory } from "../models/factory";
import { ScopeObject } from "../models/scope";
import { StrawberryApp } from "../models/strawberry.app";
import { strawberryAppReferenceService } from "../services/app";
import { blocksService } from "../services/blocks";
import { disableService } from "../services/disable";
import { enableService } from "../services/enable";
import { parentReferenceService } from "../services/parent";
import { patchEntityService } from "../services/patch";
import { APP_ARGUMENT_KEY, AttributeHelper, BLOCK_ARGUMENT_KEY, COMPONENT_ELEMENT_ATTR, DISABLE_ARGUMENT_KEY, ENABLE_ARGUMENT_KEY, PARENT_ARGUMENT_KEY, PATCH_ARGUMENT_KEY, SCOPE_ARGUMENT_KEY, STRAWBERRY_ATTRIBUTE } from "./attributes";
import { createComponentId } from "./id.generators";

/**
 * Retrieves all the App Element and the App Template Element
 * from the DOM. This function will throw an error when either
 * of the two does not exist. 
 */
export function getAppInstances(appInstance:StrawberryApp):[Element,HTMLTemplateElement]{
    try {
        const selector = AttributeHelper.makeXAttrWithValue(
            STRAWBERRY_ATTRIBUTE,
            appInstance,
            appInstance.getName()
        )
        const domInstances = document.querySelectorAll(`[${selector}]`)

        if (domInstances.length===0) {
            throw new Error(`strawberry.js: [BootError] Unable to find element ${selector}.`)
        }

        if (domInstances.length>2) {
            throw new Error(`strawberry.js: [BootError] There are appears to be multiple instances of element ${selector}.`)
        }
        let appTargetElement: Element
        let appTemplateElement: HTMLTemplateElement
        for (let i = 0; i < domInstances.length; i++) {
            const domInstance = domInstances[i]
            if (domInstance.tagName==='TEMPLATE') {
                appTemplateElement = domInstance as HTMLTemplateElement
                continue
            } 
            appTargetElement = domInstance
        }
        return [appTargetElement,appTemplateElement]
    } catch (error) {
        console.error(error)
    }
}

/**
 * 
 */
export function bootComponentTemplates(
    componentId:string,
    component:Element,
    appInstance:StrawberryApp,
    componentTree:Array<string>):Promise<string>{
    return new Promise(async (resolve,reject)=>{
        try {
            let compiledComponentHtml = ''

            // First, we'll check if component has declared template
            const componentName = AttributeHelper.getXValueFromElAttr(
                component,
                appInstance.getConfig().prefix,
                COMPONENT_ELEMENT_ATTR
            )
            const componentAttribute = AttributeHelper.makeXAttrWithValue(
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
            const componentObject          = new StrawberryComponent()
            const componentTemplateElement = componentTemplateElements[0] as HTMLTemplateElement
            const componentImplementation  = document.implementation.createHTMLDocument()
            componentImplementation.body.innerHTML = componentTemplateElement.innerHTML

            componentObject.setId(componentId).setName(componentName)

            /** Registering the Component in the Library */
            appInstance.getLibrary().component.registerTemplate(
                componentName,
                componentTemplateElement.innerHTML
            )

            /** Registering the Component Object */
            appInstance.getRegistry().component.register({
                key: componentId,
                component: componentObject
            })

            /** Retrieving and processing of child components **/
            const selector = AttributeHelper.makeXAttr(COMPONENT_ELEMENT_ATTR,appInstance)
            const childComponents = componentImplementation.querySelectorAll(`[${selector}]`)
            for (let i = 0; i < childComponents.length; i++) {

                const childComponent     = childComponents[i]
                const childComponentName = AttributeHelper.getXValueFromElAttr(childComponent,appInstance.getConfig().prefix,COMPONENT_ELEMENT_ATTR)

                const childComponentId   = createComponentId(componentId,i.toString())
                childComponent.setAttribute('xid',childComponentId)

                componentObject.addChildName(childComponentName)
                componentObject.addChildId(childComponentId)
                
                if (componentTree.includes(childComponentName)) {
                    throw new Error(`strawberry.js: [BootError] Circular dependency in component "${childComponentName}" detected: ${JSON.stringify(componentTree)}`)
                }
                const childComponentTree = [childComponentName,...componentTree]

                childComponent.innerHTML = await bootComponentTemplates(
                    childComponentId,
                    childComponent,
                    appInstance,
                    childComponentTree
                )
            }

            compiledComponentHtml += componentImplementation.body.innerHTML
            componentObject.setHtmlTemplate(compiledComponentHtml)
            resolve(compiledComponentHtml)

        } catch (error) {
            reject(error)
        }
    })
    
}

export function bootCallbackParser(handler:(...args: any[])=>any,type:'component'|'service'|'factory',name:string):Promise<Array<string>>{
    return new Promise((resolve,reject)=>{
        try {
            const handlerStr = handler.toString().split('{')[0]
            const matchedFn  = handlerStr.match(/(?<=\().+?(?=\))/g)
            if (matchedFn===null || /[(={})]/g.test(matchedFn[0])) {
                resolve([])
            }
            resolve(matchedFn[0].split(','))
        } catch (error) {
            reject(error)
        }
    })
}

function isServiceOrFactory(name:string,appInstance:StrawberryApp):'service' | 'factory' | null {
    /** Check if it is a Service */
    let serviceOb = appInstance.getLibrary().service.getHandler(name)
    if (serviceOb!==null) return 'service'
    let factorHanlder = appInstance.getLibrary().factory.getHandler(name)
    if (factorHanlder!==null) return 'factory'
    return null
}

export function bootFactoryHandler(factoryName:string,appInstance:StrawberryApp):Promise<TypeofFactory>{
    return new Promise(async (resolve,reject)=>{
        try {
            const factoryHandler = appInstance.getLibrary().factory.getHandler(factoryName) 
            if (factoryHandler===null) {
                throw new Error(`strawberry.js: [BootError] Unregistered factory callback ${factoryName}.`)
            }
            const args = await bootCallbackParser(factoryHandler,'service',factoryName)
            const injectableArguments = []
            for (let i = 0; i < args.length; i++) {
                const arg = args[i]
                if (isServiceOrFactory(arg,appInstance)==='service') {
                    const depService = await bootServiceHandler(arg,appInstance)
                    injectableArguments.push(depService)
                    continue
                }
                if (isServiceOrFactory(arg,appInstance)==='factory') {
                    const depFactory = await bootFactoryHandler(arg,appInstance)
                    injectableArguments.push(depFactory)
                    continue
                }
                injectableArguments.push(null)
            }
            const handleInstance = factoryHandler(...injectableArguments)
            if (typeof handleInstance === 'function' && handleInstance.prototype && handleInstance.prototype.constructor === handleInstance) {
                resolve(new handleInstance)
                return
            } else {
                throw new Error(`strawberry.js: [BootError] Factory ${factoryName} must return typeof class reference.`)
            }
        } catch (error) {
            reject(error)
        }
    })
}


export function bootServiceHandler(serviceName:string,appInstance:StrawberryApp):Promise<{[key:string]:any}|null>{
    return new Promise(async (resolve,reject)=>{
        try {
            let handleOb = appInstance.getRegistry().service.getService(serviceName)
            if (handleOb!==null) {
                resolve(handleOb)
                return 
            }
            const serviceLib = appInstance.getLibrary().service.getHandler(serviceName)
            if (serviceLib===null) {
                throw new Error(`strawberry.js: [BootError] Unregistered service callback ${serviceName}.`)
            }

            const serviceHandler = serviceLib.handler

            const args = await bootCallbackParser(serviceHandler,'service',serviceName)
            handleOb = {}

            const injectableArguments = []

            for (let i = 0; i < args.length; i++) {
                const arg = args[i]
                if (isServiceOrFactory(arg,appInstance)==='service') {
                    const depService = await bootServiceHandler(arg,appInstance)
                    injectableArguments.push(depService)
                    continue
                }
                if (isServiceOrFactory(arg,appInstance)==='factory') {
                    const depFactory = await bootFactoryHandler(arg,appInstance)
                    injectableArguments.push(depFactory)
                    continue
                }
                injectableArguments.push(null)
            }
            
            handleOb = serviceHandler(...injectableArguments)
            appInstance.getRegistry().service.register(serviceName,handleOb)

            resolve(handleOb)

        } catch (error) {
            reject(error)
        }
    })
}


/** This is where callback functions to components are being executed */
export function bootComponentHandler(componentObject:StrawberryComponent,appInstance:StrawberryApp):Promise<void>{
    return new Promise(async (resolve,reject)=>{
        try {

            if (componentObject.getHandler()!==null) {
                resolve(null)
                return 
            }

            const componentName    = componentObject.getName()
            const componentLibrary = appInstance.getLibrary().component
            
            const componentHandler = componentLibrary.getHandler(componentName)
            if (componentHandler===null) {
                throw new Error(`strawberry.js: [BootError] Unregistered component callback ${componentName}.`)
            }

            const allArguments = await bootCallbackParser(componentHandler,'component',componentName)

            const scopeObject:ScopeObject = {}
            const allChildComponentNames = componentObject.getChildNames().map(childName=>childName.substring(1,childName.length))
            
            const injectableArguments = []

            for (let i = 0; i < allArguments.length; i++) {
                const argument = allArguments[i]
                if (argument===SCOPE_ARGUMENT_KEY) {
                    injectableArguments.push(scopeObject)
                    componentObject.setScopeObject(scopeObject)
                    continue
                }
                if (argument.charAt(0)==='$') {
                    switch(argument) {
                        case BLOCK_ARGUMENT_KEY: 
                            injectableArguments.push((blockName:string,callback:()=>any)=>{
                                return blocksService(componentObject,appInstance,blockName,callback)
                            })
                        break;
                        case ENABLE_ARGUMENT_KEY: 
                            injectableArguments.push((elementName:string)=>{
                                return enableService(componentObject,appInstance,elementName)
                            })
                        break;
                        case DISABLE_ARGUMENT_KEY: 
                            injectableArguments.push((elementName:string)=>{
                                return disableService(componentObject,appInstance,elementName)
                            })
                        break;
                        case PATCH_ARGUMENT_KEY: 
                            injectableArguments.push((elementName?:string|null)=>{
                                return patchEntityService(componentObject,appInstance,elementName??null)
                            })
                        break;
                        case PARENT_ARGUMENT_KEY: 
                            injectableArguments.push(parentReferenceService(componentObject,appInstance))
                        break;
                        case APP_ARGUMENT_KEY: 
                            injectableArguments.push(strawberryAppReferenceService(componentObject,appInstance))
                        break;
                        default: 
                        break;
                    }
                    continue
                }

                /** Service injection */
                const service = appInstance.getLibrary().service.getHandler(argument)
                if (service!==null) {
                    injectableArguments.push(await bootServiceHandler(argument,appInstance))
                    continue
                }

                /** Factory injection */
                const factory = appInstance.getLibrary().factory.getHandler(argument)
                if (factory!==null) {
                    injectableArguments.push(await bootFactoryHandler(argument,appInstance))
                    continue
                }

                /** Component Injection */
                if (!allChildComponentNames.includes(argument)) {
                    throw new Error(`strawberry.js: [BootError] @${argument} is not a child component of ${componentName}`)
                }
                
                /** Get all children with that child component names */
                const componentElementImplementation = AttributeHelper.getElementByXId(
                    appInstance.getAppHtmlBody(),
                    appInstance,
                    componentObject.getId()
                )
                const childXids = AttributeHelper.getXidsOfChildComponentByName(
                    componentElementImplementation,
                    appInstance,
                    componentObject,
                    argument
                )

                const wrapper:{[key:string]:StrawberryComponent} = {}
                for (let n = 0; n < childXids.length; n++) {
                    const childXid = childXids[n]
                    const childComponentObject = appInstance.getRegistry().component.getRegistry()[childXid]
                    await bootComponentHandler(
                        childComponentObject,
                        appInstance
                    )
                    wrapper[childXid] = childComponentObject
                }
                const componentProxy = new Proxy(wrapper, {
                    get: function get(target, name) {
                        return function wrapper() {
                            // const args = Array.prototype.slice.call(arguments)
                            const returns = []
                            for (const xid in target) {
                                const componentInstance = target[xid]
                                const handler = componentInstance.getHandler()
                                if (typeof handler==='string'
                                || typeof handler==='number'
                                || typeof handler==='boolean'
                                ) {
                                    returns.push(handler)
                                    continue
                                }
                                if (typeof handler==='object') {
                                    if (handler.hasOwnProperty(name)) {
                                        const handlerInstance = handler[name]
                                        if (handlerInstance instanceof Function) {
                                            returns.push(handlerInstance())
                                        } else {
                                            returns.push(handlerInstance)
                                        }
                                        continue
                                    } else {
                                        console.warn(`strawberry.js [ComponentError] Calling undefined member property or method "${name.toString()}" from component "${componentInstance.getName()}"`)
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
            componentObject.setHandler(handler)

            resolve(null)

            
        } catch (error) {
            reject(error)
        }
    })
}