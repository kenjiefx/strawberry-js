import { __StrawberryComponent } from "../models/component"
import { __StrawberryApp } from "../models/strawberry"


export function __parentReferenceService(componentObject:__StrawberryComponent,appInstance:__StrawberryApp){

    class __ParentReferenceTree {
        private id: string
        $parent: __ParentReferenceTree|null
        constructor(id:string){
            this.id = id
            const grandParentId = id.substring(0,(id.length-2))
            const registry = appInstance.__getAppRegistry().__component.__get()
            if (!registry.hasOwnProperty(grandParentId)) this.$parent = null
            if (grandParentId!=='0') this.$parent = new __ParentReferenceTree(grandParentId)
        }
        get(){
            return registry[parentId].__getHandler()
        }
    }

    const parentId = componentObject.__getId().substring(0,componentObject.__getId().length-2)
    const registry = appInstance.__getAppRegistry().__component.__get()
    
    if (!registry.hasOwnProperty(parentId)) {
        return null
    }
    return new __ParentReferenceTree(parentId)
}