import { COMPONENT_ELEMENT_ATTR, __AttributeHelper } from "./helpers/attributes";
import { __bootComponentHandler, __bootComponentTemplates, __getAppInstances } from "./helpers/boot";
import { DOMHelper } from "./helpers/domready";
import { __cleanChildComponents, __copyBindElement, __createTemporaryElement, __scopeBindElement } from "./helpers/element.helpers";
import { StrawberryAppConfiguration, __StrawberryApp } from "./models/strawberry";
import { __renderHelper } from "./renders/zrender";

/** 
 * Stores all created StrawberryApp instances
 */
const StrawberryAppInstances: Array<__StrawberryApp> = []

/**
 * This value increments, serving as the unique id 
 * of the StrawberryApp instance.
 */
let instanceId = 0

/**
 * Attached to the window object to provide a simple interface to interact with 
 * the Strawberry framework code. It allows for creating instances of the app, managing
 * components, and more. This aims to simplify and provide a clean and intuitive 
 * interface for working with the application.
 */
const AppPublicAPI = {
    create:(name: string, config?: StrawberryAppConfiguration)=>{
        const appInstance = new __StrawberryApp({
            __id: instanceId++,
            __name: name
        })
        if (config!==undefined) {
            appInstance.__setConfiguration(config)
        }
        StrawberryAppInstances.push(appInstance)
        return {
            component: (name:string, handler:()=>any) => {
                appInstance.__getAppLibrary().__component.__setHandler(`@${name}`,handler)
            },
            factory: (name:string, handler:()=>any) => {
                appInstance.__getAppLibrary().__factory.__register(name,handler)
            },
            service: (name:string, handler:()=>any) => {
                appInstance.__getAppLibrary().__service.__register(name,handler)
            },
            helper: (name:string, handler:()=>any) => {
                appInstance.__getAppLibrary().__helper.__register(name,handler)
            }
        }
    }
}

const strawberry = window['strawberry'] = AppPublicAPI
DOMHelper.ready(()=>{
    StrawberryAppInstances.forEach(async (appInstance) => {
        try {
            const [appElement,templateElement] = __getAppInstances(appInstance)

            /** We'll add the App Template HTML content to the appInstance object */
            appInstance.__setHtmlBody(templateElement.innerHTML)

            /** Compiling all components in the App Template, and their dependencies.*/
            const xcomponent = __AttributeHelper.__makeXAttr(COMPONENT_ELEMENT_ATTR,appInstance)
            let componentEls = appInstance.__getHtmlBody().querySelectorAll(`[${xcomponent}]`)
            let componentId  = 0
            
            for (let i = 0; i < componentEls.length; i++) {

                /** Component Element */
                const componentEl   = componentEls[i]
                const componentName = __AttributeHelper.__getXValueFromElAttr(
                    componentEl,
                    appInstance.__getConfiguration().prefix,
                    COMPONENT_ELEMENT_ATTR
                )

                if (componentName===null) {
                    continue
                }
                

                /** Component IDs would have to be embedded to the xid attribute */
                const xid     = appInstance.__getId().toString()+'.'+(componentId++).toString()
                const xidAttr = __AttributeHelper.__makeXAttr('id',appInstance)
                componentEl.setAttribute(xidAttr,xid)

                /** 
                 * Retrieving component templates, as well as the templates of their dependencies,
                 * and the dependencies of their dependencies.
                 */
                componentEl.innerHTML = await __bootComponentTemplates(
                    xid,
                    componentEl,
                    appInstance,
                    [componentName]
                )

            }

            const componentObjects = appInstance.__getAppRegistry().__component.__get()
            const componentIdsList:Array<string> = []
            for (const componentId in componentObjects) {
                componentIdsList.push(componentId)
                await __bootComponentHandler(
                    componentObjects[componentId],
                    appInstance
                )
            }

            for (const componentId in componentObjects) {
                const componentTemporaryElement = __createTemporaryElement()
                componentTemporaryElement.innerHTML = componentObjects[componentId].__getHtmlTemplate()
                __cleanChildComponents(
                    componentTemporaryElement,
                    componentObjects[componentId].__getChildIds(),
                    appInstance
                )
                componentObjects[componentId].__setHtmlTemplate(componentTemporaryElement.innerHTML)
            }


            /** Rendering phase */
            for (const componentId in componentObjects) {
                const targetElement = __AttributeHelper.__getElementByXId(
                    appInstance.__getHtmlBody(),
                    appInstance,
                    componentId
                )

                /** 
                 * This happens for the following circumstances: 
                 * - When the component is added inside an xif element
                 */
                if (targetElement===null) continue

                const temporaryElement     = __createTemporaryElement()
                temporaryElement.innerHTML = targetElement.innerHTML
                __cleanChildComponents(
                    temporaryElement,
                    componentObjects[componentId].__getChildIds(),
                    appInstance
                )
                await __renderHelper(
                    temporaryElement,
                    componentObjects[componentId],
                    appInstance
                )
                __scopeBindElement(
                    temporaryElement,
                    targetElement,
                    appInstance,
                    componentObjects[componentId].__getChildIds() 
                )
            }

            __copyBindElement(appInstance.__getHtmlBody(),appElement)
            appInstance.__setReadyStatus()
        } catch (error) {
            console.error(error)
        }
    })
})


