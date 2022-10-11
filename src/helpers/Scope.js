class Scope {
    constructor(name){
        this.typeRef = SCOPE_OBJECT;
        this.name = name;
        this.props = {};
    }
    export(){
        return this.props;
    }
    getName(){
        return this.name;
    }
    addProp(componentName){
        this.props[componentName] = {};
    }
    getElement(){
        return strawberry.$getScopeElementByName(this.name);
    }
}
