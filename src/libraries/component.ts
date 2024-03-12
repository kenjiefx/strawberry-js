
/**
 * Registers and stores all the Component template and 
 * callback handlers.
 */
export class __ComponentLibrary {

    /** The library itself */
    private __registry: {[name:string]:{

        /** The template, or the content of HTMLTemplate element */
        __template: string|null,

        /** The callback handler, set from the frontend */
        __handler: ((...args: any[])=>any) | null
    }}
    constructor(){
        this.__registry = {}
    }

    /** Registers a template */
    __setTemplate(name:string,template:string) {
        this.__preReg(name)
        if (this.__registry[name].__template!==null) return 
        this.__registry[name].__template = template
    }

    /** Registers a callback handler */
    __setHandler(name:string,handler:()=>any){
        this.__preReg(name)
        if (this.__registry[name].__handler!==null) return 
        this.__registry[name].__handler = handler
    }

    /** Retrieves the template */
    __getTemplate(name:string): string| null {
        if (!(name in this.__registry)) return null
        return this.__registry[name].__template
    }

    /** Retrievs the handler */
    __getHandler(name:string): ((...args: any[])=>any) | null{
        if (!(name in this.__registry)) return null
        return this.__registry[name].__handler
    }
    private __preReg(name:string){
        if (!(name in this.__registry)) {
            this.__registry[name] = {
                __template: null,
                __handler: null
            }
        }
    }
}