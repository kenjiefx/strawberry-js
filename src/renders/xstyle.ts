import { __AttributeHelper, STYLE_ELEMENT_ATTR } from "../helpers/attributes"
import { __isElementLocked, __lockElement } from "../helpers/element.helpers"
import { __StrawberryComponent } from "../models/component"
import { __Resolver } from "../models/resolver"
import { __StrawberryApp } from "../models/strawberry"


export function __stylesHelper(targetElement:Element,componentObject:__StrawberryComponent,appInstance:__StrawberryApp):Promise<null>{
    return new Promise((resolve,reject)=>{
        try {
            const allStyleElements = __AttributeHelper.__getElementByXAttribute(
                targetElement,
                appInstance,
                STYLE_ELEMENT_ATTR
            )
            for (let i = 0; i < allStyleElements.length; i++) {
                const element = allStyleElements[i]
                if (__isElementLocked(element,appInstance)) continue
                const argument = __AttributeHelper.__getXValueFromElAttr(
                    element,
                    appInstance.__getConfiguration().prefix,
                    STYLE_ELEMENT_ATTR
                )
                const scopeObject = componentObject.__getScopeObject()
                if (scopeObject===null||argument===null) continue
                let evaulated = new __Resolver().__resolveExpression(
                    scopeObject,
                    argument
                )
                if (evaulated!==null&&evaulated!==''&&evaulated!==undefined) {
                    element.classList.add(evaulated)
                }
                __lockElement(element,appInstance)
            }
            resolve(null)
        } catch (error) {
            reject(error)
        }
    })
}