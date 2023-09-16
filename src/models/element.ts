import { ScopeObject } from "./scope";

export class StrawberryElement {
    $element: {scopeOf:ScopeObject} & HTMLElement
    $parent: StrawberryElement
    private state: string | null
    constructor(element,treeCount=null){
        this.$element = element
        this.state = null
        if (treeCount==null) {
            treeCount = 1;
        }
        if (treeCount<4&&element.parentElement!==null) {
            this.$parent = new StrawberryElement(element.parentElement,treeCount++);
        }
    }
    get(){
        return this.$element;
    }
    getState(){
        return this.state
    }
    setState(state:string){
        if (state===null) return
        this.state = state
    }
    referenceScope(scopeObject:ScopeObject){
        this.$element.scopeOf = scopeObject;
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
        let classes = this.listClass();
        for (var i = 0; i < classes.length; i++) {
            let clas = classes[i];
            if (clas===className) {
                this.removeClass(className);
            }
            else {
                this.addClass(className);
            }
        }
    }
}
