import { __AttributeHelper, DISABLE_ELEMENT_ATTR, ENABLE_ELEMENT_ATTR } from "../helpers/attributes"
import { __selectElementsButNotChildOfComponent } from "../helpers/element.helpers"
import { __StrawberryComponent } from "../models/component"
import { __StrawberryApp } from "../models/strawberry"

export function __setDisabledElementState(componentObject:__StrawberryComponent,appInstance:__StrawberryApp,elementName:string,state:'disabled'|'enabled'){
    try {
        const elementState = componentObject.__getNamedElementState(elementName)
        if (elementState===null) {
            throw new Error('unregistered componenet member named "'+elementName+'"')
        }
        if (elementState===state) return
        const allDisabledElements = __selectElementsButNotChildOfComponent(
            __AttributeHelper.__makeXAttrWithValue(DISABLE_ELEMENT_ATTR,appInstance,elementName),
            componentObject,
            appInstance
        )

        if (allDisabledElements===null) return
        
        const allElements = Array.from(allDisabledElements)
        const allEnabledElements = __selectElementsButNotChildOfComponent(
            __AttributeHelper.__makeXAttrWithValue(ENABLE_ELEMENT_ATTR,appInstance,elementName),
            componentObject,
            appInstance
        )

        if (allEnabledElements===null) return

        allEnabledElements.forEach(allEnabledElement=>{
            allElements.push(allEnabledElement)
        })
        for (let i = 0; i < allElements.length; i++) {
            const element = allElements[i] as HTMLInputElement | HTMLSelectElement
            element.disabled = (state==='disabled')
        }
        componentObject.__setNamedElementState(elementName,state)
    } catch (error) {
        console.error(`strawberry.js: [DisablerService] `+error.message)
    }
}

export function __disableService(componentObject:__StrawberryComponent,appInstance:__StrawberryApp,elementName:string){
    try {
        __setDisabledElementState(
            componentObject,
            appInstance,
            elementName,
            'disabled'
        )
    } catch (error) {
        console.error(`strawberry.js: [EnablerService] `+error.message)
    }
}