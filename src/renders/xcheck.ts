import { __AttributeHelper, CHECK_ELEMENT_ATTR } from "../helpers/attributes"
import { __isElementLocked, __lockElement } from "../helpers/element.helpers"
import { __StrawberryComponent } from "../models/component"
import { __Resolver } from "../models/resolver"
import { __StrawberryApp } from "../models/strawberry"


export function __checkedHelper(targetElement:Element,componentObject:__StrawberryComponent,appInstance:__StrawberryApp):Promise<null>{
    return new Promise((resolve,reject)=>{
        try {
            const allCheckedElements = __AttributeHelper.__getElementByXAttribute(
                targetElement,
                appInstance,
                CHECK_ELEMENT_ATTR
            )
            for (let i = 0; i < allCheckedElements.length; i++) {
                const element = allCheckedElements[i]

                if (__isElementLocked(element,appInstance)) continue 

                const argument = __AttributeHelper.__getXValueFromElAttr(
                    element,
                    appInstance.__getConfiguration().prefix,
                    CHECK_ELEMENT_ATTR
                )

                const scopeObject = componentObject.__getScopeObject()
                if (scopeObject===null||argument===null) continue

                const evalauted = new __Resolver().__resolveExpression(scopeObject,argument)
                if (typeof evalauted === 'boolean') {
                    evalauted ? element.setAttribute('checked','') : element.removeAttribute('checked')
                }

                __lockElement(element,appInstance)
                
            }
            resolve(null)
        } catch (error) {
            reject(error)
        }
    })
}