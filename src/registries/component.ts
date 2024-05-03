import { __StrawberryComponent } from "../models/component"

export class __ComponentRegistry {
    private __registry: {[key:string]:__StrawberryComponent}
    constructor(){
        this.__registry = {}
    }
    __register(key:string,component:__StrawberryComponent){
        this.__registry[key] = component
    }
    __get(){
        return this.__registry
    }
}