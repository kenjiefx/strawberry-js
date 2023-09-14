export class ServiceLibrary {
    private registry: {[serviceName:string]:{
        handler: (...args: any[])=>any|null
    }}
    constructor(){
        this.registry = {}
    }
    registerHandler(name:string,handler:(...args: any[])=>any){
        if (handler===null) return 
        this.registry[name] = {
            handler: handler
        }
    }
    getHandler(name:string){
        if (!this.registry.hasOwnProperty(name)) return null 
        return this.registry[name]
    }
    doServiceExist(name:string){
        return this.registry.hasOwnProperty(name)
    }
}

export class ServiceRegistry {
    registry: {[serviceName:string]:{[key:string]:any}}
    constructor(){
        this.registry = {}
    }
    register(serviceName:string,handleOb:{[key:string]:any}){
        if (this.registry.hasOwnProperty(serviceName)) return null
        this.registry[serviceName] = handleOb
    }
    getService(serviceName:string) {
        if (!this.registry.hasOwnProperty(serviceName)) return null
        return this.registry[serviceName]
    }
}

export class StrawberryService {

}