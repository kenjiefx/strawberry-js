import { AttributeHelper, DISABLE_ELEMENT_ATTR } from "../helpers/attributes";
import { getLiveAppElement, selectElementsButNotChildOfComponent } from "../helpers/element.helpers";
import { StrawberryComponent } from "../models/component";
import { StrawberryElement } from "../models/element";
import { StrawberryApp } from "../models/strawberry.app";

export function enableService(componentObject:StrawberryComponent,appInstance:StrawberryApp,elementName:string){
    try {
        const elementState = componentObject.getNamedElementState(elementName)
        if (elementState===null) {
            throw new Error('Unregistered componenet member named "'+elementName+'"')
        }
        if (elementState==='enabled') return
        const allDisabledElements = selectElementsButNotChildOfComponent(
            AttributeHelper.makeXAttrWithValue(DISABLE_ELEMENT_ATTR,appInstance,elementName),
            componentObject,
            appInstance
        )
        for (let i = 0; i < allDisabledElements.length; i++) {
            const element = allDisabledElements[i]
            if (element instanceof HTMLInputElement) {
                element.disabled = false
            } else {
                throw new Error('Component member named "'+elementName+'" must be an instance of HTMLInputElement')
            }
        }
        componentObject.setNamedElementState(elementName,'enabled')
    } catch (error) {
        console.error(`strawberry.js: [EnablerService] `+error.message)
    }
    
}