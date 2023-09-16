export class TypeofFactory {

}

export class FactoryLibrary<T extends new (...args: any[]) => any> {
    private registry: {[serviceName:string]:{
        handler: (...args: any[])=>T
    }}
    constructor(){
        this.registry = {}
    }
    registerHandler(name:string,handler:()=>T){
        if (handler===null) return 
        this.registry[name] = {
            handler: handler,
        }
    }
    getHandler(name:string){
        if (!this.registry.hasOwnProperty(name)) return null 
        return this.registry[name].handler
    }
}