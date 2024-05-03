import { __StrawberryComponent } from "../models/component"
import { __StrawberryApp } from "../models/strawberry"
import { __placeholderRenderer } from "./placeholder"
import { __blockHelpers } from "./xblock"
import { __checkedHelper } from "./xcheck"
import { __disablersHelper } from "./xdisable"
import { __enablersHelpers } from "./xenable"
import { __eventsHelper } from "./xevents"
import { __ifsConditionalHelper } from "./xif"
import { __modelsHelpers } from "./xmodel"
import { __repeatHelper } from "./xrepeat"
import { __stylesHelper } from "./xstyle"

export function __renderHelper(targetElement:Element,componentObject:__StrawberryComponent,appInstance:__StrawberryApp,skipEvents=false):Promise<null>{
    return new Promise(async (resolve,reject)=>{
        try {
            await __repeatHelper(targetElement,componentObject,appInstance)
            await __ifsConditionalHelper(targetElement,componentObject,appInstance)
            await __placeholderRenderer(targetElement,componentObject,appInstance)
            await __checkedHelper(targetElement,componentObject,appInstance)
            await __stylesHelper(targetElement,componentObject,appInstance)
            await __modelsHelpers(targetElement,componentObject,appInstance)
            await __disablersHelper(targetElement,componentObject,appInstance)
            await __enablersHelpers(targetElement,componentObject,appInstance)
            await __blockHelpers(targetElement,componentObject,appInstance)
            
            if (!skipEvents) {
                await __eventsHelper(targetElement,componentObject,appInstance)
            }

            resolve(null)
        } catch (error) {
            reject(error)
        }
    })
}