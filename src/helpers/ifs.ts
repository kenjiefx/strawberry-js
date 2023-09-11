import { StrawberryComponent } from "../models/component";
import { Resolver } from "../models/resolver";
import { StrawberryApp } from "../models/strawberry.app";
import { AttributeHelper, IF_ELEMENT_ATTR } from "./attributes";
import { disposeElement, isElementLocked, lockElement } from "./element.helpers";

export function ifsConditionalHelper(targetElement:Element,componentObject:StrawberryComponent,appInstance:StrawberryApp):Promise<null>{
    return new Promise((resolve,reject)=>{
        try {
            /** Retrieving all elements with ifs conditional */
            const ifsElements = AttributeHelper.getElementByXAttribute(
                targetElement,
                appInstance,
                IF_ELEMENT_ATTR
            )
            for (let i = 0; i < ifsElements.length; i++) {
                const ifsElement = ifsElements[i]
                if (!isElementLocked(ifsElement,appInstance)) {
                    const ifsArgument = AttributeHelper.getXValueFromElAttr(
                        ifsElement,
                        appInstance.getConfig().prefix,
                        IF_ELEMENT_ATTR
                    )
                    const resolvedIfsValue = new Resolver().expression(
                        componentObject.getScopeObject(),
                        ifsArgument
                    )
                    if (typeof resolvedIfsValue ==='boolean' && !resolvedIfsValue) {
                        disposeElement(ifsElement,'false')
                    }
                    lockElement(ifsElement,appInstance)
                }
                
            }
            resolve(null)
        } catch (error) {
            reject(error)
        }
    })
}