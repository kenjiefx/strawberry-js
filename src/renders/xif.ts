import { __AttributeHelper, IF_ELEMENT_ATTR } from "../helpers/attributes"
import { __isElementLocked, __disposeElement, __lockElement } from "../helpers/element.helpers"
import { __StrawberryComponent } from "../models/component"
import { __Resolver } from "../models/resolver"
import { __StrawberryApp } from "../models/strawberry"


export function __ifsConditionalHelper(targetElement:Element,componentObject:__StrawberryComponent,appInstance:__StrawberryApp):Promise<null>{
    return new Promise((resolve,reject)=>{
        try {
            /** Retrieving all elements with ifs conditional */
            const ifsElements = __AttributeHelper.__getElementByXAttribute(
                targetElement,
                appInstance,
                IF_ELEMENT_ATTR
            )
            for (let i = 0; i < ifsElements.length; i++) {
                const ifsElement = ifsElements[i]
                if (!__isElementLocked(ifsElement,appInstance)) {
                    const ifsArgument = __AttributeHelper.__getXValueFromElAttr(
                        ifsElement,
                        appInstance.__getConfiguration().prefix,
                        IF_ELEMENT_ATTR
                    )
                    const scopeObject = componentObject.__getScopeObject()
                    if (scopeObject===null||ifsArgument===null) continue
                    const resolvedIfsValue = new __Resolver().__resolveExpression(
                        scopeObject,
                        ifsArgument
                    )
                    if (typeof resolvedIfsValue ==='boolean' && !resolvedIfsValue) {
                        __disposeElement(ifsElement,'false')
                    }
                    __lockElement(ifsElement,appInstance)
                }
                
            }
            resolve(null)
        } catch (error) {
            reject(error)
        }
    })
}