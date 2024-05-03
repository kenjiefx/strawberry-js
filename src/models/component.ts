import { ScopeObject } from "./scope"

export class __StrawberryComponent {
    private _componentId: string 
    private _componentName: string 
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
    __setId(id:string){
        this._componentId = id
        return this
    }
    __setName(name:string){
        this._componentName = name
        return this
    }
    __getId(){
        return this._componentId
    }
    __getName() {
        return this._componentName
    }
    __addChildName(name:string){
        if (!this._componentChildNames.includes(name)) {
            this._componentChildNames.push(name)
        }
    }
    __addChildId(id:string){
        if (!this._componentChildIds.includes(id)) {
            this._componentChildIds.push(id)
        }
    }
    __getChildNames(){
        return this._componentChildNames
    }
    __getChildIds(){
        return this._componentChildIds
    }
    __setHandler(handler:{[key:string]:any} | string | boolean | number | Array<unknown>){
        if (this._componentHandler===null) {
            this._componentHandler = handler
        }
    }
    __getHandler(){
        return this._componentHandler
    }
    __setScopeObject(scopeObject:ScopeObject){
        if (this._scopeRefObject===null) {
            this._scopeRefObject = scopeObject
        }
    }
    __getScopeObject(): ScopeObject {
        return this._scopeRefObject as ScopeObject
    }
    __registerNamedElement(name:string,state:string,template:string){
        if (this._namedElementsRegistry.hasOwnProperty(name)) return null
        if (state===null) return null
        this._namedElementsRegistry[name] = {
            _namedElementState: state,
            _namedElementTemplate: template
        }
    }
    __getNamedElementState(name:string) {
        if (!this._namedElementsRegistry.hasOwnProperty(name)) return null
        return this._namedElementsRegistry[name]._namedElementState
    }
    __getNamedElementTemplate(name:string){
        if (!this._namedElementsRegistry.hasOwnProperty(name)) return null
        return this._namedElementsRegistry[name]._namedElementTemplate
    }
    __setNamedElementState(name:string,state:string) {
        if (!this._namedElementsRegistry.hasOwnProperty(name)) return
        this._namedElementsRegistry[name]._namedElementState = state
    }
    __setHtmlTemplate(html:string){
        this._componentHtmlTemplate = html
    }
    __getHtmlTemplate(){
        return this._componentHtmlTemplate
    }
}