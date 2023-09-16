import { ScopeObject } from "./scope"

export class ComponentRegistry {
    private _componentRegistry: {[key:string]:StrawberryComponent}
    constructor(){
        this._componentRegistry = {}
    }
    _registerComponent({key,component}:{key:string,component:StrawberryComponent}){
        this._componentRegistry[key] = component
    }
    _getComponentRegistry(){
        return this._componentRegistry
    }
}

export class ComponentLibrary {
    private _componentLibRegistry: {[componentName:string]:{
        _componentTemplateContent: string|null,
        _componentHandlerFn: (...args: any[])=>any|null
    }}
    constructor(){
        this._componentLibRegistry = {}
    }
    _registerComponentTemplate(componentName:string,template:string) {
        this.__createComponentInstance(componentName)
        if (this._componentLibRegistry[componentName]._componentTemplateContent===null) {
            this._componentLibRegistry[componentName]._componentTemplateContent = template
        }
    }
    _registerComponentHandler(componentName:string,handler:()=>any){
        this.__createComponentInstance(componentName)
        if (this._componentLibRegistry[componentName]._componentHandlerFn===null) {
            this._componentLibRegistry[componentName]._componentHandlerFn = handler
        }
    }
    _getComponentTemplate(componentName:string){
        if (!this._componentLibRegistry.hasOwnProperty(componentName)) return null
        return this._componentLibRegistry[componentName]._componentTemplateContent
    }
    _getComponentHandler(componentName:string){
        if (!this._componentLibRegistry.hasOwnProperty(componentName)) return null
        return this._componentLibRegistry[componentName]._componentHandlerFn
    }
    private __createComponentInstance(componentName:string){
        if (!this._componentLibRegistry.hasOwnProperty(componentName)) {
            this._componentLibRegistry[componentName] = {
                _componentTemplateContent: null,
                _componentHandlerFn: null
            }
        }
    }
}


export class StrawberryComponent {
    private _componentId:string 
    private _componentName:string 
    private _componentChildNames: Array<string>
    private _componentChildIds: Array<string>
    private _componentHandler: {[key:string]:any} | string | boolean | number | Array<unknown> | null
    private _scopeRefObject: ScopeObject | null
    private _namedElementsRegistry: {[key:string]:{_namedElementState:string|null,_namedElementTemplate:string}}
    private _componentHtmlTemplate: string
    constructor(){
        this._componentId = 'unset'
        this._componentName = 'unset'
        this._componentChildNames = []
        this._componentChildIds = []
        this._componentHandler = null
        this._componentHtmlTemplate = '' 
        this._scopeRefObject = null
        this._namedElementsRegistry = {}
    }
    _setComponentId(id:string){
        this._componentId = id
        return this
    }
    _setComponentName(name:string){
        this._componentName = name
        return this
    }
    _getComponentId(){
        return this._componentId
    }
    _getComponentName() {
        return this._componentName
    }
    _addChildName(name:string){
        if (!this._componentChildNames.includes(name)) {
            this._componentChildNames.push(name)
        }
    }
    _addChildId(id:string){
        if (!this._componentChildIds.includes(id)) {
            this._componentChildIds.push(id)
        }
    }
    _getChildNames(){
        return this._componentChildNames
    }
    _getChildIds(){
        return this._componentChildIds
    }
    _setHandler(handler:{[key:string]:any} | string | boolean | number | Array<unknown>){
        if (this._componentHandler===null) {
            this._componentHandler = handler
        }
    }
    _getHandler(){
        return this._componentHandler
    }
    _setScopeObject(scopeObject:ScopeObject){
        if (this._scopeRefObject===null) {
            this._scopeRefObject = scopeObject
        }
    }
    _getScopeObject(){
        return this._scopeRefObject
    }
    _registerNamedElement(name:string,state:string,template:string){
        if (this._namedElementsRegistry.hasOwnProperty(name)) return null
        if (state===null) return null
        this._namedElementsRegistry[name] = {
            _namedElementState: state,
            _namedElementTemplate: template
        }
    }
    _getNamedElementState(name:string) {
        if (!this._namedElementsRegistry.hasOwnProperty(name)) return null
        return this._namedElementsRegistry[name]._namedElementState
    }
    _getNamedElementTemplate(name:string){
        if (!this._namedElementsRegistry.hasOwnProperty(name)) return null
        return this._namedElementsRegistry[name]._namedElementTemplate
    }
    _setNamedElementState(name:string,state:string) {
        if (!this._namedElementsRegistry.hasOwnProperty(name)) return
        this._namedElementsRegistry[name]._namedElementState = state
    }
    _setHtmlTemplate(html:string){
        this._componentHtmlTemplate = html
    }
    _getHtmlTemplate(){
        return this._componentHtmlTemplate
    }
}