import { AttributeHelper, BLOCK_ELEMENT_ATTR } from "../helpers/attributes";
import { getLiveAppElement } from "../helpers/element.helpers";
import { StrawberryComponent } from "../models/component";
import { StrawberryElement } from "../models/element";
import { StrawberryApp } from "../models/strawberry.app";

export function blocksService(componentObject:StrawberryComponent,appInstance:StrawberryApp,blockName:string,callback:(e:StrawberryElement)=>any){
    const blockAttrNameAndValue = AttributeHelper.makeXAttrWithValue(
        BLOCK_ELEMENT_ATTR,
        appInstance,
        blockName
    )
    const componentElement = AttributeHelper.getElementByXId(
        getLiveAppElement(appInstance),
        appInstance,
        componentObject.getId()
    )
    const allBlockElements = componentElement.querySelectorAll(`[${blockAttrNameAndValue}]`)
    for (let i = 0; i < allBlockElements.length; i++) {
        const element = allBlockElements[i]
        const strawberryElement = new StrawberryElement(element)
        callback(strawberryElement)
    }
}