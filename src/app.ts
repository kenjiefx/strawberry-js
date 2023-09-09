import { AttributeHelper, COMPONENT_ELEMENT_ATTR } from "./helpers/attributes"
import { getAppInstances, bootComponentTemplates, bootComponentHandler } from "./helpers/boot.helper"
import { DOMHelper } from "./helpers/domready"
import { cleanChildComponents, copyBindElement, createTemporaryElement } from "./helpers/element.helpers"
import { sortComponentIds } from "./helpers/id.generators"
import { renderHelper } from "./helpers/render"
import { ComponentRegistry } from "./models/component"
import { StrawberryElement } from "./models/element"
import { StrawberryApp, StrawberryAppConfig } from "./models/strawberry.app"

const BootableApps:Array<StrawberryApp> = []
let instanceId = 0
const strawberry = window['strawberry'] = {
    create:(appName:string,config?:StrawberryAppConfig)=>{
        const appInstance = new StrawberryApp({id:instanceId++,name:appName})
        if (config!==undefined) appInstance.setConfig(config)
        BootableApps.push(appInstance)
        return {
            component:(name:string,handler:()=>any)=>{
                appInstance.getLibrary().component.registerHandler({
                    componentName: '@'+name,
                    handler: handler
                })
            },
            factory:()=>{

            },
            service:()=>{

            }
        }
    }
}

DOMHelper.ready(()=>{
    BootableApps.forEach(async (appInstance)=>{
        try {
            const [appElement,templateElement] = getAppInstances(appInstance)

            /** We'll add the App Template HTML content to the appInstance object */
            appInstance.setAppHtmlBody(templateElement.innerHTML)

            /** Compiling all components in the App Template, and their dependencies.*/
            let componentEls = appInstance.getAppHtmlBody().querySelectorAll('[xcomponent]')
            let componentId  = 0

            for (let i = 0; i < componentEls.length; i++) {

                /** Component Element */
                const componentEl   = componentEls[i]
                const componentName = AttributeHelper.getXValueFromElAttr({
                    element: componentEl,
                    prefix: appInstance.getConfig().prefix,
                    attributeName: COMPONENT_ELEMENT_ATTR
                })
                

                /** Component IDs would have to be embedded to the xid attribute */
                const xid = appInstance.getId().toString()+'.'+(componentId++).toString()
                componentEl.setAttribute('xid',xid)

                /** 
                 * Retrieving component templates, as well as the templates of their dependencies,
                 * and the dependencies of their dependencies.
                 */
                componentEl.innerHTML = await bootComponentTemplates({
                    componentId: xid,
                    component: componentEl,
                    appInstance: appInstance,
                    componentTree: [componentName]
                })
            }

            const componentObjects = appInstance.getRegistry().component.getRegistry()
            const componentIdsList = []
            for (const componentId in componentObjects) {
                componentIdsList.push(componentId)
                await bootComponentHandler({
                    componentObject: componentObjects[componentId],
                    appInstance: appInstance
                })
            }

            const sortedKeys = sortComponentIds(componentIdsList)
            const sortedComponentRegistry = new ComponentRegistry
            let b = 0
            sortedKeys.forEach(key => {
                sortedComponentRegistry.register({key:b+'.'+key,component:componentObjects[key]})
                b++
            })

            /** Rendering phase */
            for (const sortedComponentId in sortedComponentRegistry.getRegistry()) {
                const componentId = (sortedComponentRegistry.getRegistry())[sortedComponentId].getId()
                const targetElement = AttributeHelper.getElementByXId({
                    element: appInstance.getAppHtmlBody(),
                    appInstance: appInstance,
                    xid: componentId
                })
                const temporaryElement = createTemporaryElement()
                temporaryElement.innerHTML = targetElement.innerHTML
                cleanChildComponents({
                    component: temporaryElement,
                    childComponentIds: componentObjects[componentId].getChildIds(),
                    appInstance: appInstance
                })
                await renderHelper({
                    targetElement: temporaryElement,
                    componentObject: componentObjects[componentId],
                    appInstance: appInstance
                })
                // targetElement.innerHTML = ''
                // copyBindElement({
                //     bindFrom: temporaryElement,
                //     bindTo: targetElement
                // })
                console.log('asdasdasd')
                console.log(temporaryElement.innerHTML)
            }

            


            /**
             * @NOTE Temporary only! 
             * Will need to see how we can transfer properly from DOM implementation
             * to actual HTML
             */
            appElement.innerHTML = appInstance.getAppHtmlBody().innerHTML

        } catch (error) {
            console.error(error)
        }
    })
})

