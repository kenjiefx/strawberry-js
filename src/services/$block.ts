import { __AttributeHelper, BLOCK_ELEMENT_ATTR, ELEMENT_REFERENCE_ATTR } from "../helpers/attributes"
import { __getLiveAppElement } from "../helpers/element.helpers"
import { __StrawberryComponent } from "../models/component"
import { __StrawberryElement } from "../models/element"
import { __StrawberryApp } from "../models/strawberry"


export function __blocksService(componentObject:__StrawberryComponent,appInstance:__StrawberryApp,blockName:string,callback:(e:__StrawberryElement)=>any){
    const blockAttrNameAndValue = __AttributeHelper.__makeXAttrWithValue(
        BLOCK_ELEMENT_ATTR,
        appInstance,
        blockName
    )
    const componentElement = __AttributeHelper.__getElementByXId(
        __getLiveAppElement(appInstance),
        appInstance,
        componentObject.__getId()
    )
    if (componentElement===null) {
        throw new Error('strawberry.js unknown component element')
    }
    const refElementAttrAndValue = __AttributeHelper.__makeXAttrWithValue(
        ELEMENT_REFERENCE_ATTR,
        appInstance,
        componentObject.__getId()
    )
    const allBlockElements = componentElement.querySelectorAll(`[${blockAttrNameAndValue}][${refElementAttrAndValue}]`)
    for (let i = 0; i < allBlockElements.length; i++) {
        const element = allBlockElements[i]
        const strawberryElement = new __StrawberryElement(element)
        callback(strawberryElement)
    }
}