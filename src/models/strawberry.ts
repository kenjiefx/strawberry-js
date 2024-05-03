import { __AppLibrary } from "../libraries/zlib"
import { __AppRegistry } from "../registries/zreg"
import { __DocumentImplementationProxy } from "./document"

export class __AppPublicReference {
    __afterBootCallbacks:Array<()=>any>
    constructor(){
        this.__afterBootCallbacks = []
    }
    onReady(callBack:()=>any){
        this.__afterBootCallbacks.push(callBack)
        return (this.__afterBootCallbacks.length)-1
    }
}

/**
 * The internal version of the Strawberry application
 */
export class __StrawberryApp {
    private __id: number
    private __name: string
    private __configuration: StrawberryAppConfiguration
    private __html: __DocumentImplementationProxy
    private __appLibrary: __AppLibrary
    private __appRegistry: __AppRegistry
    private __readyStatus: boolean
    private __completeStatus: boolean
    private __publicReference: __AppPublicReference

    constructor({__name,__id}:StrawberryAppConstructor){
        this.__html = new __DocumentImplementationProxy(__name)
        this.__appLibrary = new __AppLibrary
        this.__appRegistry = new __AppRegistry
        this.__configuration = {
            prefix: 'x'
        }
        this.__id = __id
        this.__name = __name
        this.__publicReference = new __AppPublicReference
        this.__readyStatus = false
        this.__completeStatus = false
    }

    public __getId(){
        return this.__id;
    }

    /**
     * Returns the name of the strawberry app instance
     */
    public __getAppName(){
        return this.__name
    }

    /**
     * Sets the raw HTML body of the Strawberry app instance
     * @param content 
     */
    public __setHtmlBody(content:string){
        this.__html.__implementation.body.innerHTML = content
    }

    public __getHtmlBody(){
        return this.__html.__implementation.body
    }
    
    /**
     * Sets the Configuration of the Strawberry app instance
     * @param configuration 
     */
    public __setConfiguration(configuration:StrawberryAppConfiguration) {
        this.__configuration = configuration
    }

    public __getConfiguration(): StrawberryAppConfiguration {
        return this.__configuration
    }

    /**
     * Retreieves the App Library 
     * @see __AppLibrary
     */
    public __getAppLibrary(){
        return this.__appLibrary
    }

    /**
     * Retreieves the App Registry 
     * @see __AppRegistry
     */
    public __getAppRegistry(){
        return this.__appRegistry
    }

    public __setReadyStatus(){
        this.__readyStatus = true
        this.__publicReference.__afterBootCallbacks.forEach(async (callback)=>{
            await Promise.resolve(callback())
        })
        this.__completeStatus = true
    }

    public __getPublicReference(){
        return this.__publicReference
    }

    public __isReady(){
        return this.__readyStatus
    }

    public __isComplete(){
        return this.__completeStatus
    }
}

export type StrawberryAppConfiguration = {
    prefix: string
}

export type StrawberryAppConstructor = {
    __name: string,
    __id: number
}