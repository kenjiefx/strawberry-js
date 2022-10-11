class StrawberryApp {
    constructor(){}
    component(componentName,callbackFn){
        let component = new Component (componentName);
        component.setCallbackFn(callbackFn);
        App.components[componentName] = component;
    }
    factory(objectName,callbackFn){
        let factory = new Factory (objectName);
        factory.setCallbackFn(callbackFn);
        App.factories[objectName] = factory;

    }
    service(objectName,callbackFn){
        let service = new Service (objectName);
        service.setCallbackFn(callbackFn);
        App.services[objectName] = service;
    }
}
