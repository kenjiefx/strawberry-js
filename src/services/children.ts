import { StrawberryComponent } from "../models/component";
import { StrawberryApp } from "../models/strawberry.app";

export function childrenReferenceService(componentObject:StrawberryComponent,appInstance:StrawberryApp){
    return {
        get:(childName:string)=>{
            if (childName.charAt(0)!=='@') childName = '@'+childName
            let childComponentObject:StrawberryComponent|null = null
            const childIds = componentObject._getChildIds()
            for (let i = 0; i < childIds.length; i++) {
                const childId = childIds[i]
                const childComponent = appInstance._getAppRegistry().component._getComponentRegistry()[childId]
                if (childComponent._getComponentName()===childName) {
                    childComponentObject = childComponent
                    break
                }
            }
            if (childComponentObject===null) return null
            return childComponentObject._getHandler()
        }
    }
}