import { StrawberryComponent } from "../models/component";
import { StrawberryApp } from "../models/strawberry.app";
import { AttributeHelper, BLOCK_ELEMENT_ATTR } from "./attributes";
import { createTemporaryElement } from "./element.helpers";

export function blockHelpers(targetElement:Element,componentObject:StrawberryComponent,appInstance:StrawberryApp):Promise<null>{
    return new Promise((resolve,reject)=>{
        try {
            const allBlockElements = AttributeHelper.getElementByXAttribute(
                targetElement,
                appInstance,
                BLOCK_ELEMENT_ATTR
            )
            for (let i = 0; i < allBlockElements.length; i++) {
                const element = allBlockElements[i]

                const blockElName = AttributeHelper.getXValueFromElAttr(
                    element,
                    appInstance._getAppConfig().prefix,
                    BLOCK_ELEMENT_ATTR
                )

                /** Retrieving and registering the template */
                const componentTemplate = componentObject._getHtmlTemplate()
                const tempCompEl        = createTemporaryElement()
                tempCompEl.innerHTML    = componentTemplate
                const selector = AttributeHelper.makeXAttrWithValue(
                    BLOCK_ELEMENT_ATTR,
                    appInstance,
                    blockElName
                )
                const tempBlockEl = tempCompEl.querySelector(`[${selector}]`)
                if (null===componentObject._getNamedElementState(blockElName)) {
                    componentObject._registerNamedElement(blockElName,'registered',tempBlockEl.innerHTML)
                }
            }

            resolve(null)
            
        } catch (error) {
            reject(error)
        }
    })
}