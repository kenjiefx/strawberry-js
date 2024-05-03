export class __ServiceRegistry {
    private __registry: {[serviceName:string]:{[key:string]:any}}
    constructor(){
        this.__registry = {}
    }
    __register(serviceName:string,handleOb:{[key:string]:any}){
        if (!(serviceName in this.__registry)) return null
        this.__registry[serviceName] = handleOb
    }
    __getService(serviceName:string) {
        if (!(serviceName in this.__registry)) return null
        return this.__registry[serviceName]
    }
}