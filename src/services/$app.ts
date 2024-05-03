import { __StrawberryComponent } from "../models/component";
import { __StrawberryApp } from "../models/strawberry";

export function __strawberryAppReferenceService(componentObject:__StrawberryComponent,appInstance:__StrawberryApp){
    return appInstance.__getPublicReference()
}