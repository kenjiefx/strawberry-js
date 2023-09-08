
import { StrawberryComponent } from "../models/component";
import { StrawberryElement } from "../models/element";
import { ScopeObject } from "../models/scope";
import { StrawberryApp } from "../models/strawberry.app";
import { COMPONENT_ELEMENT_ATTR, SCOPE_ARGUMENT_KEY } from "./attributes";
import { createComponentId } from "./id.generators";

/**
 * Retrieves all the App Element and the App Template Element
 * from the DOM. This function will throw an error when either
 * of the two does not exist. 
 */
export function getAppInstances(appInstance:StrawberryApp):[Element,HTMLTemplateElement]{
    try {
        const selector     = `[${appInstance.getConfig().prefix}strawberry="${appInstance.getName()}"]`
        const domInstances = document.querySelectorAll(selector)

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
            const componentName = StrawberryElement.getXValue(component,appInstance.getConfig().prefix,COMPONENT_ELEMENT_ATTR)
            
            const componentSelector         = `template[x${COMPONENT_ELEMENT_ATTR}="${componentName}"]`
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
            const childComponents = componentImplementation.querySelectorAll('[xcomponent]')
            for (let i = 0; i < childComponents.length; i++) {

                const childComponent     = childComponents[i]
                const childComponentName = StrawberryElement.getXValue(childComponent,appInstance.getConfig().prefix,COMPONENT_ELEMENT_ATTR)

                const childComponentId   = createComponentId(componentId,i.toString())
                childComponent.setAttribute('xid',childComponentId)
                
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


export function assignComponentHandler({componentObject,appInstance}:{componentObject:StrawberryComponent,appInstance:StrawberryApp}):Promise<void>{
    return new Promise((resolve,reject)=>{
        try {
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
            let allArguments = argumentExpression.split(',')
            
            const injectableArguments = []
            for (let i = 0; i < allArguments.length; i++) {
                const argument = allArguments[i]
                if (argument===SCOPE_ARGUMENT_KEY) {
                    injectableArguments.push(scopeObject)
                    continue;
                }
                if (argument.charAt(0)==='$') {
                    continue;
                }
                // Proxy of the component object to be injected
            }

            
        } catch (error) {
            reject(error)
        }
    })
}