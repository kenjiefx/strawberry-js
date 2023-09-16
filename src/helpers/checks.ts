import { StrawberryComponent } from "../models/component";
import { Resolver } from "../models/resolver";
import { StrawberryApp } from "../models/strawberry.app";
import { AttributeHelper, CHECK_ELEMENT_ATTR } from "./attributes";
import { isElementLocked, lockElement } from "./element.helpers";

export function checkedHelper(targetElement:Element,componentObject:StrawberryComponent,appInstance:StrawberryApp):Promise<null>{
    return new Promise((resolve,reject)=>{
        try {
            const allCheckedElements = AttributeHelper.getElementByXAttribute(
                targetElement,
                appInstance,
                CHECK_ELEMENT_ATTR
            )
            for (let i = 0; i < allCheckedElements.length; i++) {
                const element = allCheckedElements[i]

                if (isElementLocked(element,appInstance)) continue 

                const argument = AttributeHelper.getXValueFromElAttr(
                    element,
                    appInstance._getAppConfig().prefix,
                    CHECK_ELEMENT_ATTR
                )

                const evalauted = new Resolver()._resolveExpression(componentObject._getScopeObject(),argument)
                if (typeof evalauted === 'boolean') {
                    evalauted ? element.setAttribute('checked','') : element.removeAttribute('checked')
                }

                lockElement(element,appInstance)
                
            }
            resolve(null)
        } catch (error) {
            reject(error)
        }
    })
}