import { StrawberryComponent } from "../models/component";
import { StrawberryApp } from "../models/strawberry.app";
import { AttributeHelper, DISABLE_ELEMENT_ATTR, ENABLE_ARGUMENT_KEY, ENABLE_ELEMENT_ATTR } from "./attributes";

export function enablersHelpers(targetElement:Element,componentObject:StrawberryComponent,appInstance:StrawberryApp):Promise<null>{
    return new Promise((resolve,reject)=>{
        try {
            const allEnabledElements = AttributeHelper.getElementByXAttribute(
                targetElement,
                appInstance,
                ENABLE_ELEMENT_ATTR
            )
            for (let i = 0; i < allEnabledElements.length; i++) {
                const element = allEnabledElements[i] as HTMLInputElement
                const elementName = AttributeHelper.getXValueFromElAttr(
                    element,
                    appInstance._getAppConfig().prefix,
                    ENABLE_ELEMENT_ATTR
                )
                if (null===componentObject._getNamedElementState(elementName)) {
                    componentObject._registerNamedElement(elementName,'enabled','')
                }
                element.disabled = (componentObject._getNamedElementState(elementName)==='disabled')
            }
            resolve(null)
        } catch (error) {
            reject(error)
        }
    })
}