import { StrawberryComponent } from "../models/component";
import { StrawberryApp } from "../models/strawberry.app";

export function strawberryAppReferenceService(componentObject:StrawberryComponent,appInstance:StrawberryApp){
    return appInstance._getAppPublicReference()
}