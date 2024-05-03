import { ScopeObject } from "./scope";

/**
 * The `StrawberryElement` class provides a wrapper around the Element object,
 * offering additional abstraction for managing states, scope, and other
 * non-default features.
 */
export class __StrawberryElement {
    
    /**
     * A reference to the element itself.
     * (Shouldn't be minified, as publicly-accessible)
     */
    $element: Element

    /**
     * A reference to parent element, wrapped in this `StrawberryElement` object
     * (Shouldn't be minified, as publicly-accessible)
     */
    $parent: __StrawberryElement

    /** The state of the element */
    private __elementState: string | null

    /** The scope/context this element belongs to */
    private __scopeOf: ScopeObject

    /**
     * @param element - The Element
     * @param pcount - The number of iteration of parent created
     */
    constructor(element:Element, pcount:null|number=null){
        this.$element = element
        this.__elementState = null
        this.__wrapParent(pcount ?? 1)
    }

    /** Wraps the parent element within `StrawberryElement` object */
    private __wrapParent(count:number){
        const parentElement = this.$element.parentElement
        if (count>3 || parentElement===null) return 
        this.$parent = new __StrawberryElement(parentElement,count++);
    }

    /** Retrieves the $element */
    get(){
        return this.$element;
    }

    /** Retrieves the state */
    getState(){
        return this.__elementState
    }

    setState(state:string){
        if (state===null) return
        this.__elementState = state
    }
    
    setScope (scope:ScopeObject){
        this.__scopeOf = scope
    }

    getScope(){
        return this.__scopeOf;
    }

    addClass(className:string){
        this.$element.classList.add(className);
    }

    listClass(){
        return this.$element.className.split(' ');
    }

    removeClass(className:string){
        this.$element.classList.remove(className);
    }

    toggleClass(className:string){
        const classes = this.listClass()
        for (var i = 0; i < classes.length; i++) {
            let aclass = classes[i];
            (aclass===className) ? 
                this.removeClass(className) :
                this.addClass(className)
        }
    }
}