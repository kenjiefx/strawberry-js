

export class TypeofFactory {}

/**
 * Registers and stores all the Factory callbacks/handlers
 */
export class __FactoryLibrary<T extends new (...args: any[]) => any> {

    private __registry: {[name:string]:{
        __handler: (...args: any[])=>T
    }}

    constructor(){
        this.__registry = {}
    }

    /** Register a new callback/handler */
    __register (name:string,handler:(...args: any[])=>any){
        if (handler===null) return 
        this.__registry[name] = {
            __handler: handler
        }
    }

    /** Retrievs a handler */
    __getHandler (name:string): ((...args: any[])=>T) | null {
        if (!(name in this.__registry)) return null 
        return this.__registry[name].__handler
    }
}