import { COMPONENT_ELEMENT_ATTR } from "./helpers/attributes"
import { getAppInstances, bootComponentTemplates, assignComponentHandler } from "./helpers/boot.helper"
import { DOMHelper } from "./helpers/domready"
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
                const componentName = StrawberryElement.getXValue(componentEl,appInstance.getConfig().prefix,COMPONENT_ELEMENT_ATTR)

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
            for (const componentId in componentObjects) {
                await assignComponentHandler({
                    componentObject: componentObjects[componentId],
                    appInstance: appInstance
                })
            }

            // console.log(appInstance.getRegistry().component)
            console.log(appInstance.getLibrary().component)

            //console.log(appInstance.getAppHtmlBody().innerHTML)

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

