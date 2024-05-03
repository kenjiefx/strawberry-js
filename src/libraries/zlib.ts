import { __ComponentLibrary } from "./component"
import { TypeofFactory, __FactoryLibrary } from "./factory"
import { __ServiceLibrary } from "./service"

/**
 * The App library contains all the usable Components, Services, 
 * and Factories declared from the frontend.
 */
export class __AppLibrary {

    public __component: __ComponentLibrary 
    public __service: __ServiceLibrary
    public __factory: __FactoryLibrary<typeof TypeofFactory>

    constructor(){
        this.__component = new __ComponentLibrary
        this.__service = new __ServiceLibrary
        this.__factory = new __FactoryLibrary
    }

}