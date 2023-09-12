import { AttributeHelper, COMPONENT_ELEMENT_ATTR } from "./helpers/attributes"
import { getAppInstances, bootComponentTemplates, bootComponentHandler } from "./helpers/boot.helper"
import { DOMHelper } from "./helpers/domready"
import { cleanChildComponents, copyBindElement, createTemporaryElement, scopeBindElement } from "./helpers/element.helpers"
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
                appInstance.getLibrary().component.registerHandler(
                    '@'+name,
                    handler
                )
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
                const componentName = AttributeHelper.getXValueFromElAttr(
                    componentEl,
                    appInstance.getConfig().prefix,
                    COMPONENT_ELEMENT_ATTR
                )
                

                /** Component IDs would have to be embedded to the xid attribute */
                const xid = appInstance.getId().toString()+'.'+(componentId++).toString()
                componentEl.setAttribute('xid',xid)

                /** 
                 * Retrieving component templates, as well as the templates of their dependencies,
                 * and the dependencies of their dependencies.
                 */
                componentEl.innerHTML = await bootComponentTemplates(
                    xid,
                    componentEl,
                    appInstance,
                    [componentName]
                )

            }

            const componentObjects = appInstance.getRegistry().component.getRegistry()
            const componentIdsList = []
            for (const componentId in componentObjects) {
                componentIdsList.push(componentId)
                await bootComponentHandler(
                    componentObjects[componentId],
                    appInstance
                )
            }

            for (const componentId in componentObjects) {
                const componentTemporaryElement = createTemporaryElement()
                componentTemporaryElement.innerHTML = componentObjects[componentId].getHtmlTemplate()
                cleanChildComponents(
                    componentTemporaryElement,
                    componentObjects[componentId].getChildIds(),
                    appInstance
                )
                componentObjects[componentId].setHtmlTemplate(componentTemporaryElement.innerHTML)
            }


            /** Rendering phase */
            for (const componentId in componentObjects) {
                const targetElement = AttributeHelper.getElementByXId(
                    appInstance.getAppHtmlBody(),
                    appInstance,
                    componentId
                )

                /** 
                 * This happens for the following circumstances: 
                 * - When the component is added inside an xif element
                 */
                if (targetElement===null) continue

                const temporaryElement     = createTemporaryElement()
                temporaryElement.innerHTML = targetElement.innerHTML
                cleanChildComponents(
                    temporaryElement,
                    componentObjects[componentId].getChildIds(),
                    appInstance
                )
                await renderHelper(
                    temporaryElement,
                    componentObjects[componentId],
                    appInstance
                )
                scopeBindElement(
                    temporaryElement,
                    targetElement,
                    appInstance,
                    componentObjects[componentId].getChildIds() 
                )
            }

            


            /**
             * @NOTE Temporary only! 
             * Will need to see how we can transfer properly from DOM implementation
             * to actual HTML
             */
            //appElement.innerHTML = appInstance.getAppHtmlBody().innerHTML
            copyBindElement(appInstance.getAppHtmlBody(),appElement)
            appInstance.setReady()

        } catch (error) {
            console.error(error)
        }
    })
})

