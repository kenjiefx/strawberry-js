
/**
 * Registers and stores all the Service callbacks/handlers
 */
export class __ServiceLibrary {

    private __registry: {[name:string]:{
        __handler: (...args: any[])=>any|null
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
    __getHandler (name:string){
        this.__registry[name] ?? null
    }

}