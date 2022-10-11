class Factory {
    constructor(){
        this.name = '';
        this.callBackFn = '';
        this.hasBuilt = false;
    }
    setCallbackFn(callbackFn){
        this.callbackFn = callbackFn;
    }
    build(){
        let injector = new Injector(
            this.callbackFn.toString(),
            {},
            FACTORY_OBJECT
        );
        let args = injector.resolve();
        return this.callbackFn(...args);
    }
}
