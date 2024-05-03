import { __StrawberryComponent } from "../models/component"
import { __StrawberryApp } from "../models/strawberry"
import { __setDisabledElementState } from "./$disable"


export function __enableService(componentObject:__StrawberryComponent,appInstance:__StrawberryApp,elementName:string){
    try {
        __setDisabledElementState(
            componentObject,
            appInstance,
            elementName,
            'enabled'
        )
    } catch (error) {
        console.error(`strawberry.js: [EnablerService] `+error.message)
    }
}