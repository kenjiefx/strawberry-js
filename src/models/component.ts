import { ScopeObject } from "./scope"

export class ComponentRegistry {
    private registry: {[key:string]:StrawberryComponent}
    constructor(){
        this.registry = {}
    }
    register({key,component}:{key:string,component:StrawberryComponent}){
        this.registry[key] = component
    }
    getRegistry(){
        return this.registry
    }
}

export class ComponentLibrary {
    registry: {[componentName:string]:{
        template: string|null,
        handler: (...args: any[])=>any|null
    }}
    constructor(){
        this.registry = {}
    }
    registerTemplate(componentName:string,template:string) {
        this.createInstance(componentName)
        if (this.registry[componentName].template===null) {
            this.registry[componentName].template = template
        }
    }
    registerHandler(componentName:string,handler:()=>any){
        this.createInstance(componentName)
        if (this.registry[componentName].handler===null) {
            this.registry[componentName].handler = handler
        }
    }
    getTemplate(componentName:string){
        if (!this.registry.hasOwnProperty(componentName)) return null
        return this.registry[componentName].template
    }
    getHandler(componentName:string){
        if (!this.registry.hasOwnProperty(componentName)) return null
        return this.registry[componentName].handler
    }
    private createInstance(componentName:string){
        if (!this.registry.hasOwnProperty(componentName)) {
            this.registry[componentName] = {
                template: null,
                handler: null
            }
        }
    }
}


export class StrawberryComponent {
    private id:string 
    private name:string 
    private childNames: Array<string>
    private childIds: Array<string>
    private handler: {[key:string]:any} | string | boolean | number | Array<unknown> | null
    private scopeObject: ScopeObject | null
    private namedElements: {[key:string]:{state:string|null,template:string}}
    constructor(){
        this.id = 'unset'
        this.name = 'unset'
        this.childNames = []
        this.childIds = []
        this.handler = null 
        this.scopeObject = null
        this.namedElements = {}
    }
    setId(id:string){
        this.id = id
        return this
    }
    setName(name:string){
        this.name = name
        return this
    }
    getId(){
        return this.id
    }
    getName() {
        return this.name
    }
    addChildName(name:string){
        if (!this.childNames.includes(name)) {
            this.childNames.push(name)
        }
    }
    addChildId(id:string){
        if (!this.childIds.includes(id)) {
            this.childIds.push(id)
        }
    }
    getChildNames(){
        return this.childNames
    }
    getChildIds(){
        return this.childIds
    }
    setHandler(handler:{[key:string]:any} | string | boolean | number | Array<unknown>){
        if (this.handler===null) {
            this.handler = handler
        }
    }
    getHandler(){
        return this.handler
    }
    setScopeObject(scopeObject:ScopeObject){
        if (this.scopeObject===null) {
            this.scopeObject = scopeObject
        }
    }
    getScopeObject(){
        return this.scopeObject
    }
    registerNamedElement(name:string,state:string,template:string){
        if (this.namedElements.hasOwnProperty(name)) return null
        if (state===null) return null
        this.namedElements[name] = {
            state: state,
            template: template
        }
    }
    getNamedElementState(name:string) {
        if (!this.namedElements.hasOwnProperty(name)) return null
        return this.namedElements[name].state
    }
    setNamedElementState(name:string,state:string) {
        if (!this.namedElements.hasOwnProperty(name)) return
        this.namedElements[name].state = state
    }
}