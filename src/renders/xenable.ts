import { __AttributeHelper, ENABLE_ELEMENT_ATTR } from "../helpers/attributes"
import { __StrawberryComponent } from "../models/component"
import { __StrawberryApp } from "../models/strawberry"


export function __enablersHelpers(targetElement:Element,componentObject:__StrawberryComponent,appInstance:__StrawberryApp):Promise<null>{
    return new Promise((resolve,reject)=>{
        try {
            const allEnabledElements = __AttributeHelper.__getElementByXAttribute(
                targetElement,
                appInstance,
                ENABLE_ELEMENT_ATTR
            )
            for (let i = 0; i < allEnabledElements.length; i++) {
                const element = allEnabledElements[i] as HTMLInputElement
                const elementName = __AttributeHelper.__getXValueFromElAttr(
                    element,
                    appInstance.__getConfiguration().prefix,
                    ENABLE_ELEMENT_ATTR
                )
                if (elementName===null) continue
                if (null===componentObject.__getNamedElementState(elementName)) {
                    componentObject.__registerNamedElement(elementName,'enabled','')
                }
                element.disabled = (componentObject.__getNamedElementState(elementName)==='disabled')
            }
            resolve(null)
        } catch (error) {
            reject(error)
        }
    })
}