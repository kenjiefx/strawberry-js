import { StrawberryComponent } from "../models/component";
import { StrawberryApp } from "../models/strawberry.app";
import { repeatHelper } from "./repeater";

export function renderHelper(args:{targetElement:Element,componentObject:StrawberryComponent,appInstance:StrawberryApp}):Promise<null>{
    return new Promise(async (resolve,reject)=>{
        try {
            await repeatHelper({
                targetElement: args.targetElement,
                componentObject: args.componentObject,
                appInstance: args.appInstance
            })
            //console.log(args.targetElement.innerHTML)
            resolve(null)
        } catch (error) {
            reject(error)
        }
    })
}