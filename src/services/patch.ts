import { AttributeHelper, BLOCK_ELEMENT_ATTR } from "../helpers/attributes";
import { createTemporaryElement, getLiveAppElement, scopeBindElement, selectElementsButNotChildOfComponent } from "../helpers/element.helpers";
import { renderHelper } from "../helpers/render";
import { StrawberryComponent } from "../models/component";
import { StrawberryApp } from "../models/strawberry.app";

export function renderPatchableChildComponent(elementToBindTo:Element,componentObject:StrawberryComponent,appInstance:StrawberryApp):Promise<null>{
    return new Promise(async (resolve,reject)=>{
        try {
            const elementBindFrom = createTemporaryElement()
            elementBindFrom.innerHTML = componentObject.getHtmlTemplate()

            await renderHelper(elementBindFrom,componentObject,appInstance)

            const childComponentIds = componentObject.getChildIds()
            for (let i = 0; i < childComponentIds.length; i++) {
                const childComponentId = childComponentIds[i]
                const childComponent = AttributeHelper.getElementByXId(
                    elementBindFrom,
                    appInstance,
                    childComponentId
                )
                if (childComponent!==null) {
                    await renderPatchableChildComponent(
                        childComponent,
                        appInstance.getRegistry().component.getRegistry()[childComponentId],
                        appInstance
                    )
                }
            }
            scopeBindElement(elementBindFrom,elementToBindTo,appInstance,componentObject.getChildIds())
            resolve(null)
        } catch (error) {
            reject(error)
        }
    })
}

export function patchEntityService(componentObject:StrawberryComponent,appInstance:StrawberryApp,blockName?:string|null):Promise<null>{
    return new Promise(async (resolve,reject)=>{
        try {
            if (!appInstance.isReady()) {
                throw new Error(`Invalid invoking of service when boot is not complete`)
            }
            let mode: 'component' | 'block' = 'component'
            let elementsToPatch = [AttributeHelper.getElementByXId(
                getLiveAppElement(appInstance),
                appInstance,
                componentObject.getId()
            )]
            if (blockName!==undefined&&blockName!==null){
                mode = 'block'
                elementsToPatch = Array.from(selectElementsButNotChildOfComponent(
                    AttributeHelper.makeXAttrWithValue(BLOCK_ELEMENT_ATTR,appInstance,blockName),
                    componentObject,
                    appInstance
                ))
            }
            if (elementsToPatch.length===0||elementsToPatch[0]===null) {
                throw new Error(`Unable to select element to patch`)
            }

            for (let i = 0; i < elementsToPatch.length; i++) {
                const elementBindTo = elementsToPatch[i]
                let elementBindFrom = createTemporaryElement() 
                if (mode==='component') {
                    const template = componentObject.getHtmlTemplate()
                    elementBindFrom.innerHTML = template
                } else {
                    const template = componentObject.getNamedElementTemplate(blockName)
                    elementBindFrom.innerHTML = template
                }
                await renderHelper(elementBindFrom,componentObject,appInstance)

                scopeBindElement(elementBindFrom,elementBindTo,appInstance,componentObject.getChildIds())

                /**
                 * Find all unrendered child component. This happens usually because of 
                 * conditional statements such xif 
                 */
                const childComponentIds = componentObject.getChildIds()
                for (let k = 0; k < childComponentIds.length; k++) {
                    const childComponentId = childComponentIds[k]
                    const childComponent = AttributeHelper.getElementByXId(
                        elementBindTo,
                        appInstance,
                        childComponentId
                    )
                    if (childComponent===null) continue
                    if (childComponent.innerHTML.trim()==='') {
                        await renderPatchableChildComponent(
                            childComponent,
                            appInstance.getRegistry().component.getRegistry()[childComponentId],
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