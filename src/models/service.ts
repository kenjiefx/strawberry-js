export class ServiceLibrary {
    private _serviceRegistry: {[serviceName:string]:{
        _serviceHandler: (...args: any[])=>any|null
    }}
    constructor(){
        this._serviceRegistry = {}
    }
    _registerServiceHandler(name:string,handler:(...args: any[])=>any){
        if (handler===null) return 
        this._serviceRegistry[name] = {
            _serviceHandler: handler
        }
    }
    _getServiceHandler(name:string){
        if (!this._serviceRegistry.hasOwnProperty(name)) return null 
        return this._serviceRegistry[name]
    }
}

export class ServiceRegistry {
    private _serviceRegistry: {[serviceName:string]:{[key:string]:any}}
    constructor(){
        this._serviceRegistry = {}
    }
    _registerService(serviceName:string,handleOb:{[key:string]:any}){
        if (this._serviceRegistry.hasOwnProperty(serviceName)) return null
        this._serviceRegistry[serviceName] = handleOb
    }
    _getService(serviceName:string) {
        if (!this._serviceRegistry.hasOwnProperty(serviceName)) return null
        return this._serviceRegistry[serviceName]
    }
}

export class StrawberryService {

}