import { ComponentLibrary, ComponentRegistry } from "./component"
import { DomImplementationWrapper } from "./dom.implementation.wrapper"

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
    }
    private library: {
        component: ComponentLibrary
    }
    constructor({id, name,config}:{
        id: number
        name: string,
        config?: StrawberryAppConfig
    }){
        this.id = id
        this.name = name
        this.domHtml = new DomImplementationWrapper(name)
        this.registry = {
            component: new ComponentRegistry()
        }
        this.library = {
            component: new ComponentLibrary()
        }
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
}