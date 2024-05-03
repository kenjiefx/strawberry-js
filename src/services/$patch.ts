import { __AttributeHelper, BLOCK_ELEMENT_ATTR } from "../helpers/attributes"
import { __createTemporaryElement, __scopeBindElement, __getLiveAppElement, __selectElementsButNotChildOfComponent } from "../helpers/element.helpers"
import { __StrawberryComponent } from "../models/component"
import { __StrawberryApp } from "../models/strawberry"
import { __renderHelper } from "../renders/zrender"


export function __renderPatchableChildComponent(elementToBindTo:Element,componentObject:__StrawberryComponent,appInstance:__StrawberryApp):Promise<null>{
    return new Promise(async (resolve,reject)=>{
        try {
            const elementBindFrom = __createTemporaryElement()
            elementBindFrom.innerHTML = componentObject.__getHtmlTemplate()

            await __renderHelper(elementBindFrom,componentObject,appInstance)

            const childComponentIds = componentObject.__getChildIds()
            for (let i = 0; i < childComponentIds.length; i++) {
                const childComponentId = childComponentIds[i]
                const childComponent = __AttributeHelper.__getElementByXId(
                    elementBindFrom,
                    appInstance,
                    childComponentId
                )
                if (childComponent!==null) {
                    await __renderPatchableChildComponent(
                        childComponent,
                        appInstance.__getAppRegistry().__component.__get()[childComponentId],
                        appInstance
                    )
                }
            }
            __scopeBindElement(elementBindFrom,elementToBindTo,appInstance,componentObject.__getChildIds())
            resolve(null)
        } catch (error) {
            reject(error)
        }
    })
}

export function __patchEntityService(componentObject:__StrawberryComponent,appInstance:__StrawberryApp,blockName?:string|null):Promise<null>{
    return new Promise(async (resolve,reject)=>{
        try {
            if (!appInstance.__isReady()) {
                throw new Error(`invalid invoking of service when boot is not ready`)
            }
            let mode: 'component' | 'block' = 'component'
            let elementsToPatch = [__AttributeHelper.__getElementByXId(
                __getLiveAppElement(appInstance),
                appInstance,
                componentObject.__getId()
            )]
            if (blockName!==undefined&&blockName!==null){
                mode = 'block'
                const elementsButNotChild = __selectElementsButNotChildOfComponent(
                    __AttributeHelper.__makeXAttrWithValue(BLOCK_ELEMENT_ATTR,appInstance,blockName),
                    componentObject,
                    appInstance
                )
                if (elementsButNotChild===null) {
                    return 
                }
                elementsToPatch = Array.from(elementsButNotChild)
            }

            if (elementsToPatch.length===0||elementsToPatch[0]===null) {
                if (!appInstance.__isComplete()) return resolve(null)
                throw new Error(`invalid invoking of service when boot is not complete`)
            }


            for (let i = 0; i < elementsToPatch.length; i++) {
                const elementBindTo = elementsToPatch[i]
                let elementBindFrom = __createTemporaryElement() 
                if (mode==='component') {
                    const template = componentObject.__getHtmlTemplate()
                    elementBindFrom.innerHTML = template
                } else {
                    if (blockName===undefined||blockName===null) continue
                    const template = componentObject.__getNamedElementTemplate(blockName)
                    if (template===null) continue
                    elementBindFrom.innerHTML = template
                }
                await __renderHelper(elementBindFrom,componentObject,appInstance)

                if (elementBindTo===null) continue

                __scopeBindElement(elementBindFrom,elementBindTo,appInstance,componentObject.__getChildIds())

                /**
                 * Find all unrendered child component. This happens usually because of 
                 * conditional statements such xif 
                 */
                const childComponentIds = componentObject.__getChildIds()
                for (let k = 0; k < childComponentIds.length; k++) {
                    const childComponentId = childComponentIds[k]
                    const childComponent = __AttributeHelper.__getElementByXId(
                        elementBindTo,
                        appInstance,
                        childComponentId
                    )
                    if (childComponent===null) continue
                    if (childComponent.innerHTML.trim()==='') {
                        await __renderPatchableChildComponent(
                            childComponent,
                            appInstance.__getAppRegistry().__component.__get()[childComponentId],
                            appInstance
                        )
                    }
                }


            }
            resolve(null)
        } catch (error) {
            console.error(`strawberry.js: [PatchService] `+error.message)
        }
    })
}