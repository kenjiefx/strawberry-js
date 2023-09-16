import { ComponentLibrary, ComponentRegistry } from "./component"
import { DomImplementationWrapper } from "./dom.implementation.wrapper"
import { FactoryLibrary, TypeofFactory } from "./factory"
import { ServiceLibrary, ServiceRegistry } from "./service"

export type StrawberryAppConfig = {
    prefix: string
}


export class AppPublicReference {
    _afterBootCallbacks:Array<()=>any>
    constructor(){
        this._afterBootCallbacks = []
    }
    onReady(callBack:()=>any){
        this._afterBootCallbacks.push(callBack)
        return (this._afterBootCallbacks.length)-1
    }
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
    private publicRef: AppPublicReference
    private library: {
        component: ComponentLibrary,
        service: ServiceLibrary,
        factory: FactoryLibrary<typeof TypeofFactory>
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
            service: new ServiceLibrary(),
            factory: new FactoryLibrary()
        }
        this.publicRef = new AppPublicReference()
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
        this.publicRef._afterBootCallbacks.forEach(callback=>{
            callback()
        })
    }
    getPublicReference(){
        return this.publicRef
    }
}