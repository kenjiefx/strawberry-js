import { AttributeHelper, DISABLE_ELEMENT_ATTR, ENABLE_ELEMENT_ATTR } from "../helpers/attributes";
import { selectElementsButNotChildOfComponent } from "../helpers/element.helpers";
import { StrawberryComponent } from "../models/component";
import { StrawberryApp } from "../models/strawberry.app";

export function setDisabledElementState(componentObject:StrawberryComponent,appInstance:StrawberryApp,elementName:string,state:'disabled'|'enabled'){
    try {
        const elementState = componentObject.getNamedElementState(elementName)
        if (elementState===null) {
            throw new Error('Unregistered componenet member named "'+elementName+'"')
        }
        if (elementState===state) return
        const allDisabledElements = selectElementsButNotChildOfComponent(
            AttributeHelper.makeXAttrWithValue(DISABLE_ELEMENT_ATTR,appInstance,elementName),
            componentObject,
            appInstance
        )
        
        const allElements = Array.from(allDisabledElements)
        const allEnabledElements = selectElementsButNotChildOfComponent(
            AttributeHelper.makeXAttrWithValue(ENABLE_ELEMENT_ATTR,appInstance,elementName),
            componentObject,
            appInstance
        )

        allEnabledElements.forEach(allEnabledElement=>{
            allElements.push(allEnabledElement)
        })
        for (let i = 0; i < allElements.length; i++) {
            const element = allElements[i] as HTMLInputElement | HTMLSelectElement
            element.disabled = (state==='disabled')
        }
        componentObject.setNamedElementState(elementName,state)
    } catch (error) {
        console.error(`strawberry.js: [DisablerService] `+error.message)
    }
}

export function disableService(componentObject:StrawberryComponent,appInstance:StrawberryApp,elementName:string){
    try {
        setDisabledElementState(
            componentObject,
            appInstance,
            elementName,
            'disabled'
        )
    } catch (error) {
        console.error(`strawberry.js: [EnablerService] `+error.message)
    }
}