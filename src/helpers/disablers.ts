import { StrawberryComponent } from "../models/component";
import { StrawberryApp } from "../models/strawberry.app";
import { AttributeHelper, DISABLE_ELEMENT_ATTR } from "./attributes";

export function disablersHelper(targetElement:Element,componentObject:StrawberryComponent,appInstance:StrawberryApp):Promise<null>{
    return new Promise((resolve,reject)=>{
        try {
            const allDisabledElements = AttributeHelper.getElementByXAttribute(
                targetElement,
                appInstance,
                DISABLE_ELEMENT_ATTR
            )
            for (let i = 0; i < allDisabledElements.length; i++) {
                const element = allDisabledElements[i]
                if (!(element instanceof HTMLInputElement)) continue
                const elementName = AttributeHelper.getXValueFromElAttr(
                    element,
                    appInstance.getConfig().prefix,
                    DISABLE_ELEMENT_ATTR
                )
                if (null===componentObject.getNamedElementState(elementName)) {
                    componentObject.registerNamedElement(elementName,'disabled','')
                }
                element.disabled = (componentObject.getNamedElementState(elementName)==='disabled')
            }
            resolve(null)
        } catch (error) {
            reject(error)
        }
    })
}