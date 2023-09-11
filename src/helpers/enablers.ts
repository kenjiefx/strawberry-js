import { StrawberryComponent } from "../models/component";
import { StrawberryApp } from "../models/strawberry.app";
import { AttributeHelper, DISABLE_ELEMENT_ATTR } from "./attributes";

export function enablersHelpers(targetElement:Element,componentObject:StrawberryComponent,appInstance:StrawberryApp):Promise<null>{
    return new Promise((resolve,reject)=>{
        try {
            const allEnabledElements = AttributeHelper.getElementByXAttribute(
                targetElement,
                appInstance,
                DISABLE_ELEMENT_ATTR
            )
            for (let i = 0; i < allEnabledElements.length; i++) {
                const element = allEnabledElements[i]
                if (!(element instanceof HTMLInputElement)) continue
                const elementName = AttributeHelper.getXValueFromElAttr(
                    element,
                    appInstance.getConfig().prefix,
                    DISABLE_ELEMENT_ATTR
                )
                if (null===componentObject.getNamedElementState(elementName)) {
                    componentObject.registerNamedElement(elementName,'enabled','')
                }
                element.disabled = (componentObject.getNamedElementState(elementName)==='disabled')
            }
            resolve(null)
        } catch (error) {
            reject(error)
        }
    })
}