export class TypeofFactory {

}

export class FactoryLibrary<T extends new (...args: any[]) => any> {
    private _factoryRegistry: {[serviceName:string]:{
        _factoryHandler: (...args: any[])=>T
    }}
    constructor(){
        this._factoryRegistry = {}
    }
    _registerFactoryHandler(name:string,handler:()=>T){
        if (handler===null) return 
        this._factoryRegistry[name] = {
            _factoryHandler: handler,
        }
    }
    _getFactoryHandler(name:string){
        if (!this._factoryRegistry.hasOwnProperty(name)) return null 
        return this._factoryRegistry[name]._factoryHandler
    }
}