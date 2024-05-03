import { __ComponentRegistry } from "./component"
import { __ServiceRegistry } from "./service"

/**
 * The App library contains all the registered Components, Services, 
 * and Factories declared from the frontend.
 */
export class __AppRegistry {

    public __component: __ComponentRegistry 
    public __service: __ServiceRegistry

    constructor(){
        this.__component = new __ComponentRegistry
        this.__service = new __ServiceRegistry
    }

}