
import { StrawberryComponent } from "../models/component";
import { StrawberryElement } from "../models/element";
import { ScopeObject } from "../models/scope";
import { StrawberryApp } from "../models/strawberry.app";
import { AttributeHelper, COMPONENT_ELEMENT_ATTR, SCOPE_ARGUMENT_KEY, STRAWBERRY_ATTRIBUTE } from "./attributes";
import { createComponentId } from "./id.generators";

/**
 * Retrieves all the App Element and the App Template Element
 * from the DOM. This function will throw an error when either
 * of the two does not exist. 
 */
export function getAppInstances(appInstance:StrawberryApp):[Element,HTMLTemplateElement]{
    try {
        const selector = AttributeHelper.makeXAttrWithValue({
            attributeName: STRAWBERRY_ATTRIBUTE,
            appInstance: appInstance,
            value: appInstance.getName()
        })
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
export function bootComponentTemplates({componentId,component,appInstance,componentTree}:{componentId:string,component:Element,appInstance:StrawberryApp,componentTree:Array<string>}):Promise<string>{
    return new Promise(async (resolve,reject)=>{
        try {
            let compiledComponentHtml = ''

            // First, we'll check if component has declared template
            const componentName = AttributeHelper.getXValueFromElAttr({
                element: component,
                prefix: appInstance.getConfig().prefix,
                attributeName: COMPONENT_ELEMENT_ATTR
            })
            
            const componentAttribute = AttributeHelper.makeXAttrWithValue({
                attributeName: COMPONENT_ELEMENT_ATTR,
                appInstance: appInstance,
                value: componentName
            })
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
            appInstance.getLibrary().component.registerTemplate({
                componentName: componentName,
                template: componentTemplateElement.innerHTML
            })

            /** Registering the Component Object */
            appInstance.getRegistry().component.register({
                key: componentId,
                component: componentObject
            })

            /** Retrieving and processing of child components **/
            const selector = AttributeHelper.makeXAttr({
                attributeName: COMPONENT_ELEMENT_ATTR,
                appInstance: appInstance
            })
            const childComponents = componentImplementation.querySelectorAll(`[${selector}]`)
            for (let i = 0; i < childComponents.length; i++) {

                const childComponent     = childComponents[i]
                const childComponentName = AttributeHelper.getXValueFromElAttr({
                    element: childComponent,
                    prefix: appInstance.getConfig().prefix,
                    attributeName: COMPONENT_ELEMENT_ATTR
                })

                const childComponentId   = createComponentId(componentId,i.toString())
                childComponent.setAttribute('xid',childComponentId)

                componentObject.addChildName(childComponentName)
                componentObject.addChildId(childComponentId)
                
                if (componentTree.includes(childComponentName)) {
                    throw new Error(`strawberry.js: [BootError] Circular dependency in component "${childComponentName}" detected: ${JSON.stringify(componentTree)}`)
                }
                const childComponentTree = [childComponentName,...componentTree]

                childComponent.innerHTML = await bootComponentTemplates({
                    componentId: childComponentId,
                    component: childComponent,
                    appInstance: appInstance,
                    componentTree: childComponentTree
                })
            }

            compiledComponentHtml += componentImplementation.body.innerHTML
            resolve(compiledComponentHtml)

        } catch (error) {
            reject(error)
        }
    })
    
}

function parseHandlerArguments(){

}

/** This is where callback functions to components are being executed */
export function bootComponentHandler({componentObject,appInstance}:{componentObject:StrawberryComponent,appInstance:StrawberryApp}):Promise<void>{
    return new Promise(async (resolve,reject)=>{
        try {

            if (componentObject.getHandler()!==null) {
                resolve(null)
                return 
            }

            const componentName = componentObject.getName()
            const componentLibrary = appInstance.getLibrary().component
            
            const componentHandler = componentLibrary.getHandler(componentName)
            if (componentHandler===null) {
                throw new Error(`strawberry.js: [BootError] Unregistered component callback ${componentName}.`)
            }

            const handlerStr = componentHandler.toString()
            const matchedFn  = handlerStr.match(/(?<=\().+?(?=\))/g)

            const scopeObject:ScopeObject = {}

            if (matchedFn===null) {
                throw new Error(`strawberry.js: [BootError] Invalid component callback ${componentName}.`)
            }
            if (/[(={})]/g.test(matchedFn[0])) {
                throw new Error(`strawberry.js: [BootError] Invalid component callback ${componentName}.`)
            }

            let argumentExpression = matchedFn[0]
            let allArguments       = argumentExpression.split(',')

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
                    continue
                }

                /** @TODO Service injection */

                /** @TODO Factory injection */

                /** Component Injection */
                if (!allChildComponentNames.includes(argument)) {
                    throw new Error(`strawberry.js: [BootError] @${argument} is not a child component of ${componentName}`)
                }
                /** Get all children with that child component names */
                const componentElementImplementation = AttributeHelper.getElementByXId({
                    element: appInstance.getAppHtmlBody(),
                    appInstance: appInstance,
                    xid: componentObject.getId()
                })
                const childXids = AttributeHelper.getXidsOfChildComponentByName({
                    element: componentElementImplementation,
                    appInstance: appInstance,
                    componentObject: componentObject,
                    childComponentName: argument
                })

                const wrapper:{[key:string]:StrawberryComponent} = {}
                for (let n = 0; n < childXids.length; n++) {
                    const childXid = childXids[n]
                    const childComponentObject = appInstance.getRegistry().component.getRegistry()[childXid]
                    await bootComponentHandler({
                        componentObject: childComponentObject,
                        appInstance: appInstance
                    })
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