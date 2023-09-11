import { StrawberryComponent } from "../models/component";
import { Resolver } from "../models/resolver";
import { StrawberryApp } from "../models/strawberry.app";
import { AttributeHelper, STYLE_ELEMENT_ATTR } from "./attributes";
import { isElementLocked, lockElement } from "./element.helpers";

export function stylesHelper(targetElement:Element,componentObject:StrawberryComponent,appInstance:StrawberryApp):Promise<null>{
    return new Promise((resolve,reject)=>{
        try {
            const allStyleElements = AttributeHelper.getElementByXAttribute(
                targetElement,
                appInstance,
                STYLE_ELEMENT_ATTR
            )
            for (let i = 0; i < allStyleElements.length; i++) {
                const element = allStyleElements[i]
                if (isElementLocked(element,appInstance)) continue
                const argument = AttributeHelper.getXValueFromElAttr(
                    element,
                    appInstance.getConfig().prefix,
                    STYLE_ELEMENT_ATTR
                )
                let evaulated = new Resolver().expression(
                    componentObject.getScopeObject(),
                    argument
                )
                if (evaulated!==null&&evaulated!==''&&evaulated!==undefined) {
                    element.classList.add(evaulated)
                }
                lockElement(element,appInstance)
            }
            resolve(null)
        } catch (error) {
            reject(error)
        }
    })
}