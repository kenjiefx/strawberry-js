import { __AttributeHelper, BLOCK_ELEMENT_ATTR } from "../helpers/attributes"
import { __createTemporaryElement } from "../helpers/element.helpers"
import { __StrawberryComponent } from "../models/component"
import { __StrawberryApp } from "../models/strawberry"


export function __blockHelpers(targetElement:Element,componentObject:__StrawberryComponent,appInstance:__StrawberryApp):Promise<null>{
    return new Promise((resolve,reject)=>{
        try {
            const allBlockElements = __AttributeHelper.__getElementByXAttribute(
                targetElement,
                appInstance,
                BLOCK_ELEMENT_ATTR
            )
            for (let i = 0; i < allBlockElements.length; i++) {
                const element = allBlockElements[i]

                const blockElName = __AttributeHelper.__getXValueFromElAttr(
                    element,
                    appInstance.__getConfiguration().prefix,
                    BLOCK_ELEMENT_ATTR
                )

                if (blockElName===null) continue

                /** Retrieving and registering the template */
                const componentTemplate = componentObject.__getHtmlTemplate()
                const tempCompEl        = __createTemporaryElement()
                tempCompEl.innerHTML    = componentTemplate
                const selector = __AttributeHelper.__makeXAttrWithValue(
                    BLOCK_ELEMENT_ATTR,
                    appInstance,
                    blockElName
                )

                const tempBlockEl = tempCompEl.querySelector(`[${selector}]`)
                if (tempBlockEl===null) continue

                if (null===componentObject.__getNamedElementState(blockElName)) {
                    componentObject.__registerNamedElement(blockElName,'registered',tempBlockEl.innerHTML)
                }
            }

            resolve(null)
            
        } catch (error) {
            reject(error)
        }
    })
}