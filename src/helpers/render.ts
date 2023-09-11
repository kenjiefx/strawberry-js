import { StrawberryComponent } from "../models/component";
import { StrawberryApp } from "../models/strawberry.app";
import { blockHelpers } from "./blocks";
import { checkedHelper } from "./checks";
import { disablersHelper } from "./disablers";
import { enablersHelpers } from "./enablers";
import { eventsHelper } from "./events";
import { ifsConditionalHelper } from "./ifs";
import { modelsHelpers } from "./models";
import { placeholderHelper } from "./placeholders";
import { repeatHelper } from "./repeater";
import { stylesHelper } from "./styles";

export function renderHelper(targetElement:Element,componentObject:StrawberryComponent,appInstance:StrawberryApp,skipEvents=false):Promise<null>{
    return new Promise(async (resolve,reject)=>{
        try {
            await repeatHelper(targetElement,componentObject,appInstance)
            await ifsConditionalHelper(targetElement,componentObject,appInstance)
            await placeholderHelper(targetElement,componentObject,appInstance)
            await checkedHelper(targetElement,componentObject,appInstance)
            await stylesHelper(targetElement,componentObject,appInstance)
            await modelsHelpers(targetElement,componentObject,appInstance)
            await disablersHelper(targetElement,componentObject,appInstance)
            await enablersHelpers(targetElement,componentObject,appInstance)
            await blockHelpers(targetElement,componentObject,appInstance)
            
            if (!skipEvents) {
                await eventsHelper(targetElement,componentObject,appInstance)
            }

            resolve(null)
        } catch (error) {
            reject(error)
        }
    })
}