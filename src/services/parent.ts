import { StrawberryComponent } from "../models/component";
import { StrawberryApp } from "../models/strawberry.app";

export function parentReferenceService(componentObject:StrawberryComponent,appInstance:StrawberryApp){

    class ParentReferenceTree {
        private id: string
        $parent: ParentReferenceTree|null
        constructor(id:string){
            this.id = id
            const grandParentId = id.substring(0,(id.length-2))
            const registry = appInstance._getAppRegistry().component._getComponentRegistry()
            if (!registry.hasOwnProperty(grandParentId)) this.$parent = null
            if (grandParentId!=='0') this.$parent = new ParentReferenceTree(grandParentId)
        }
        get(){
            return registry[parentId]._getHandler()
        }
    }

    const parentId = componentObject._getComponentId().substring(0,componentObject._getComponentId().length-2)
    const registry = appInstance._getAppRegistry().component._getComponentRegistry()
    
    if (!registry.hasOwnProperty(parentId)) {
        return null
    }
    return new ParentReferenceTree(parentId)
}