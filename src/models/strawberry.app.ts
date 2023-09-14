import { ComponentLibrary, ComponentRegistry } from "./component"
import { DomImplementationWrapper } from "./dom.implementation.wrapper"
import { ServiceLibrary, ServiceRegistry } from "./service"

export type StrawberryAppConfig = {
    prefix: string
}

/**
 * The Strawberry app instance created using the
 * `strawberry.create` function
 */
export class StrawberryApp {
    private name: string 
    private config: StrawberryAppConfig
    private id: number
    private domHtml: DomImplementationWrapper
    private registry: {
        component: ComponentRegistry
        service: ServiceRegistry
    }
    private library: {
        component: ComponentLibrary,
        service: ServiceLibrary
    }
    private ready: boolean
    constructor({id, name,config}:{
        id: number
        name: string,
        config?: StrawberryAppConfig
    }){
        this.id = id
        this.name = name
        this.domHtml = new DomImplementationWrapper(name)
        this.registry = {
            component: new ComponentRegistry(),
            service: new ServiceRegistry()
        }
        this.library = {
            component: new ComponentLibrary(),
            service: new ServiceLibrary()
        }
        this.ready = false
        if (config===undefined) {
            this.config = {
                prefix: 'x'
            }
            return
        }
        this.config = config
    }
    setConfig(config:StrawberryAppConfig){
        this.config = config
    }
    getConfig():StrawberryAppConfig {
        return this.config
    }
    getName(){
        return this.name
    }
    getId(){
        return this.id
    }
    setAppHtmlBody(htmlContent:string){
        this.domHtml.implementation.body.innerHTML = htmlContent
    }
    getAppHtmlBody(){
        return this.domHtml.implementation.body
    }
    getRegistry(){
        return this.registry
    }
    getLibrary(){
        return this.library
    }
    isReady(){
        return this.ready
    }
    setReady(){
        this.ready = true
    }
}