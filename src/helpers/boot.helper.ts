
import { StrawberryComponent } from "../models/component";
import { StrawberryElement } from "../models/element";
import { StrawberryApp } from "../models/strawberry.app";
import { COMPONENT_ELEMENT_ATTR } from "./attributes";
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
 * @param componentId 
 * @param component 
 * @param appInstance 
 * @returns 
 */
export function bootComponentTemplates(componentId:string,component:Element,appInstance:StrawberryApp):string{
    try {

        /**
         * @TODO We need to find a way, so that no circular dependency of component will happen 
         */

        let compiledComponentHtml = ''

        // First, we'll check if component has declared template
        const componentName = StrawberryElement.getXValue(component,appInstance.getConfig().prefix,COMPONENT_ELEMENT_ATTR)
        const componentSelector = `template[x${COMPONENT_ELEMENT_ATTR}="${componentName}"]`
        const componentTemplateElements = document.querySelectorAll(componentSelector)
        if (componentTemplateElements.length===0) {
            throw new Error(`strawberry.js: [BootError] Unable to find Component template ${componentSelector}.`)
        }
        if (componentTemplateElements.length>1) {
            throw new Error(`strawberry.js: [BootError] There are appears to be multiple instances of Component template ${componentSelector}.`)
        }
        const componentObject = new StrawberryComponent()
        const componentTemplateElement = componentTemplateElements[0] as HTMLTemplateElement

        // We will check if that component has a child component 
        const childComponents = componentTemplateElement.content.querySelectorAll('[xcomponent]')
        for (let i = 0; i < childComponents.length; i++) {
            const childComponent     = childComponents[i]
            const childComponentId   = createComponentId(componentId,i.toString())
            childComponent.setAttribute('xid',childComponentId)
            childComponent.innerHTML = bootComponentTemplates(childComponentId,childComponent,appInstance)
        }

        compiledComponentHtml += componentTemplateElement.innerHTML

        return compiledComponentHtml
    } catch (error) {
        console.error(error)
    }
    
}