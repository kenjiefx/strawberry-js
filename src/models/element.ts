import { ScopeObject } from "./scope";

export class StrawberryElement {
    $element: {scopeOf:ScopeObject} & HTMLElement
    $parent: StrawberryElement
    constructor(element,treeCount=null){
        this.$element = element
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
    referenceScope(scopeObject){
        this.$element.scopeOf = scopeObject;
    }
    addClass(className){
        this.$element.classList.add(className);
    }
    listClass(){
        return this.$element.className.split(' ');
    }
    removeClass(className){
        this.$element.classList.remove(className);
    }
    toggleClass(className){
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
