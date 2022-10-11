class Service {
    constructor(){
        this.name = '';
        this.callBackFn = '';
        this.hasBuilt = false;
        this.evaled = null;
    }
    setCallbackFn(callbackFn){
        this.callbackFn = callbackFn;
    }
    build(){
        if (!this.hasBuilt) {
            let injector = new Injector(
                this.callbackFn.toString(),
                {},
                SERVICE_OBJECT
            );
            let args = injector.resolve();
            this.evaled = this.callbackFn(...args);
            this.hasBuilt = true;
            return this.evaled;
        }
        return this.evaled;
    }
}
