import { __AttributeHelper, DISABLE_ELEMENT_ATTR } from "../helpers/attributes"
import { __StrawberryComponent } from "../models/component"
import { __StrawberryApp } from "../models/strawberry"

export function __disablersHelper(targetElement:Element,componentObject:__StrawberryComponent,appInstance:__StrawberryApp):Promise<null>{
    return new Promise((resolve,reject)=>{
        try {
            const allDisabledElements = __AttributeHelper.__getElementByXAttribute(
                targetElement,
                appInstance,
                DISABLE_ELEMENT_ATTR
            )
            for (let i = 0; i < allDisabledElements.length; i++) {
                const element = allDisabledElements[i] as HTMLInputElement
                const elementName = __AttributeHelper.__getXValueFromElAttr(
                    element,
                    appInstance.__getConfiguration().prefix,
                    DISABLE_ELEMENT_ATTR
                )
                if (elementName===null) continue
                if (null===componentObject.__getNamedElementState(elementName)) {
                    componentObject.__registerNamedElement(elementName,'disabled','')
                }
                element.disabled = (componentObject.__getNamedElementState(elementName)==='disabled')
            }
            resolve(null)
        } catch (error) {
            reject(error)
        }
    })
}