import { getAppInstances, bootComponentTemplates } from "./helpers/boot.helper"
import { DOMHelper } from "./helpers/domready"
import { StrawberryApp, StrawberryAppConfig } from "./models/strawberry.app"

const BootableApps:Array<StrawberryApp> = []
let instanceId = 0
const strawberry = window['strawberry'] = {
    create:(appName:string,config?:StrawberryAppConfig)=>{
        const appInstance = new StrawberryApp({id:instanceId++,name:appName})
        if (config!==undefined) appInstance.setConfig(config)
        BootableApps.push(appInstance)
        return {
            component:()=>{

            },
            factory:()=>{

            },
            service:()=>{

            }
        }
    }
}

DOMHelper.ready(()=>{
    BootableApps.forEach((appInstance)=>{
        const [appElement,templateElement] = getAppInstances(appInstance)

        /** We'll add the app template HTML content to the appInstance object */
        appInstance.setAppHtmlBody(templateElement.innerHTML)

        let components = templateElement.content.querySelectorAll('[xcomponent]')
        let componentId = 0
        for (let i = 0; i < components.length; i++) {
            const component = components[i]
            const xid = appInstance.getId().toString()+'.'+(componentId++).toString()
            component.setAttribute('xid',xid)
            component.innerHTML = bootComponentTemplates(xid,component,appInstance)
        }
        console.log(templateElement.innerHTML)
    })
})

