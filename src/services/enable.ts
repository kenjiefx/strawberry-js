import { AttributeHelper, DISABLE_ELEMENT_ATTR, ENABLE_ELEMENT_ATTR } from "../helpers/attributes";
import { getLiveAppElement, selectElementsButNotChildOfComponent } from "../helpers/element.helpers";
import { StrawberryComponent } from "../models/component";
import { StrawberryElement } from "../models/element";
import { StrawberryApp } from "../models/strawberry.app";
import { setDisabledElementState } from "./disable";

export function enableService(componentObject:StrawberryComponent,appInstance:StrawberryApp,elementName:string){
    try {
        setDisabledElementState(
            componentObject,
            appInstance,
            elementName,
            'enabled'
        )
    } catch (error) {
        console.error(`strawberry.js: [EnablerService] `+error.message)
    }
}