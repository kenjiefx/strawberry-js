class Component {
    constructor(name){
        this.name = name;
        this.props = {};
        this.parents = [];
        this.children = [];
        this.template = '';
        this.hidden = {};
        this.formState = {};
        this.callbackFn = '';
        this.hasBuilt = false;
    }
    export(){
        return this.props;
    }
    getName(){
        return this.name;
    }
    setCallable(callable){
        this.callable = callable;
        return this;
    }
    getCallable(){
        if (!this.hasBuilt)
            this.build();
        return this.callable;
    }
    setTemplate(template){
        this.template = template;
        return this;
    }
    setProps(key,value){
        this.props[key] = value;
        return this;
    }
    getTemplate(){
        return this.template;
    }
    addHidden(elementName,template,state){
        this.hidden[elementName] = {
            template: template,
            state: state
        };
    }
    getHidden(elementName){
        return this.hidden[elementName] ?? null;
    }
    addFormState(elementName,state){
        this.formState[elementName] = state;
    }
    getFormState(elementName){
        return this.formState[elementName] ?? null;
    }
    setCallbackFn(callbackFn){
        this.callbackFn = callbackFn;
    }
    build(){

        if (this.hasBuilt)
            return this.callable;

        // Injecting dependencies to the callback function
        let injector = new Injector(
            this.callbackFn.toString(),
            this,
            COMPONENT_OBJECT
        );
        // Resolving dependency injection
        let args = injector.resolve();

        // Parking the callback function
        this.setCallable(this.callbackFn(...args));

        this.hasBuilt = true;
    }
}
