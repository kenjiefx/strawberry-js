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
    private _appName: string 
    private _appConfig: StrawberryAppConfig
    private _appId: number
    private _domHtml: DomImplementationWrapper
    private _appRegistry: {
        component: ComponentRegistry
        service: ServiceRegistry
    }
    private _appPublicRef: AppPublicReference
    private _appLibrary: {
        component: ComponentLibrary,
        service: ServiceLibrary,
        factory: FactoryLibrary<typeof TypeofFactory>
    }
    private _appReadyStatus: boolean
    constructor({id, name,config}:{
        id: number
        name: string,
        config?: StrawberryAppConfig
    }){
        this._appId = id
        this._appName = name
        this._domHtml = new DomImplementationWrapper(name)
        this._appRegistry = {
            component: new ComponentRegistry(),
            service: new ServiceRegistry()
        }
        this._appLibrary = {
            component: new ComponentLibrary(),
            service: new ServiceLibrary(),
            factory: new FactoryLibrary()
        }
        this._appPublicRef = new AppPublicReference()
        this._appReadyStatus = false
        if (config===undefined) {
            this._appConfig = {
                prefix: 'x'
            }
            return
        }
        this._appConfig = config
    }
    _setAppConfig(config:StrawberryAppConfig){
        this._appConfig = config
    }
    _getAppConfig():StrawberryAppConfig {
        return this._appConfig
    }
    _getAppName(){
        return this._appName
    }
    _getAppId(){
        return this._appId
    }
    _setAppHtmlBody(htmlContent:string){
        this._domHtml.implementation.body.innerHTML = htmlContent
    }
    _getAppHtmlBody(){
        return this._domHtml.implementation.body
    }
    _getAppRegistry(){
        return this._appRegistry
    }
    _getAppLibrary(){
        return this._appLibrary
    }
    _isAppReady(){
        return this._appReadyStatus
    }
    _setAppReadyStatus(){
        this._appReadyStatus = true
        this._appPublicRef._afterBootCallbacks.forEach(callback=>{
            callback()
        })
    }
    _getAppPublicReference(){
        return this._appPublicRef
    }
}