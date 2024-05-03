import { __StrawberryComponent } from "../models/component"
import { __StrawberryApp } from "../models/strawberry"

export function __childrenReferenceService(componentObject:__StrawberryComponent,appInstance:__StrawberryApp){
    return {
        get:(childName:string)=>{
            if (childName.charAt(0)!=='@') childName = '@'+childName
            let childComponentObject:__StrawberryComponent|null = null
            const childIds = componentObject.__getChildIds()
            for (let i = 0; i < childIds.length; i++) {
                const childId = childIds[i]
                const childComponent = appInstance.__getAppRegistry().__component.__get()[childId]
                if (childComponent.__getName()===childName) {
                    childComponentObject = childComponent
                    break
                }
            }
            if (childComponentObject===null) return null
            return childComponentObject.__getHandler()
        }
    }
}