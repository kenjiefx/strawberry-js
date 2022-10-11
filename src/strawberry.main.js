/*
==========================================
Strawberry JS
Created by Ken Terrado, 2021
==========================================
*/

const App = {
    name: 'app',
    isReady: false,
    prefix: 'x',
    components: {},
    factories: {},
    services:{},
    onReady:[]
}

const SERVICE_OBJECT = 'service_object';
const FACTORY_OBJECT = 'factory_object';
const COMPONENT_OBJECT = 'component_object';
const COMPONENT_ELEMENT_ATTR = 'component';
const REPEAT_ELEMENT_ATTR = 'repeat';
const IF_ELEMENT_ATTR = 'if';
const HIDE_ELEMENT_ATTR = 'hide';
const SHOW_ELEMENT_ATTR = 'show';
const CHECK_ELEMENT_ATTR = 'check';
const STYLE_ELEMENT_ATTR = 'style';
const MODEL_ELEMENT_ATTR = 'model';
const DISABLE_ELEMENT_ATTR = 'disable';
const ENABLE_ELEMENT_ATTR = 'enable';
const CLICK_EVENT_ATTR = 'click';
const CHANGE_EVENT_ATTR = 'change';
const TOUCH_EVENT_ATTR = 'touch';
const BLOCK_ELEMENT_ATTR = 'block';

const strawberry = window.strawberry = {
    create:function(appName,callbackFn){
        if (callbackFn instanceof Function)
            callbackFn();
        App.name = appName;
        return new StrawberryApp();
    },
    $getElementsFrom:function(element,attrName){
        let resolvedAttrName = '['+App.prefix+attrName+']';
        return element.querySelectorAll(resolvedAttrName);
    },
    $getComponentFrom:function(element,componentName){
        let resolvedAttrName = '['+App.prefix+COMPONENT_ELEMENT_ATTR+'="@'+componentName+'"]';
        return element.querySelector(resolvedAttrName);
    },
    $getXValue:function(element,attrName){
        let resolvedAttrName = App.prefix+attrName;
        return element.getAttribute(resolvedAttrName);
    },
    $getAtElementFrom:function(element,atElementAttr,atElementName){
        let resolvedAtElementName = '@'+atElementName;
        let resolvedAtElementAttr = App.prefix+atElementAttr;
        let resolvedSelector = '['+resolvedAtElementAttr+'="'+resolvedAtElementName+'"]';
        return element.querySelectorAll(resolvedSelector);
    },
    $isScopeOfComponent:function(element,componentName){
        let scopeAttrName = '$'+componentName;
        let scopeAttrValue = element.getAttribute('xscope');
        return (scopeAttrValue===scopeAttrName);
    },
    $getAtElementName:function(element,attrName){
        let xValue = strawberry.$getXValue(element,attrName);
        return xValue.substring(1);
    },
    $disposeElement:function(element,comment=null){
        if (null!==element) {
            element.innerHTML = '';
            element.outerHTML  = '<!-- strawberry.js: '+element.outerHTML+' | '+comment+' -->';
        }
    },
    $resolver:function(){
        return new Resolver();
    }
};

const create_element = function(template){
    let element = document.createElement('div');
    element.innerHTML = template;
    return element;
}

const create_component = function(componentName,template){
    let element = document.createElement('div');
    //element.setAttribute(App.prefix+'component','@'+componentName);
    element.innerHTML = '<div '+App.prefix+'component="@'+componentName+'">'+template+'</div>';
    return element;
}

const bind_element = function(bindWith,bindTo){
    if (bindWith===null) return;
    while (bindWith.childNodes.length > 0) {
        bindTo.appendChild(bindWith.childNodes[0]);
    }
}

// Boot Strawberry.js
DomReady.ready(function(){

    let _app  = document.querySelector('['+App.prefix+'strawberry="'+App.name+'"]');

    if (null===_app) return;

    let template = create_element(_app.innerHTML);

    // Removing the contents of the DOM innerHTML
    _app.innerHTML = '';

    // Registering all the components in the application
    let components = strawberry.$getElementsFrom(template,COMPONENT_ELEMENT_ATTR);

    // Looping through all declared components in the DOM
    for (var i = 0; i < components.length; i++) {

        let _services = new Services();
        let componentName = _services.$component().register(components[i]);
        let component = _services.$component().render(components[i]);

        // Deactivate element when it's not declared
        if (null===component) {
            strawberry.$disposeElement(
                strawberry.$getComponentFrom(template,componentName),
                'No component declared'
            );
            continue;
        }

        // Render element when it's declared
        if (null!==strawberry.$getComponentFrom(template,componentName)) {
            strawberry.$getComponentFrom(template,componentName).innerHTML = '';
            bind_element(component,strawberry.$getComponentFrom(template,componentName));
        }
    }


    // Apends the template to the DOM
    bind_element(template,_app);

    App.isReady = true;

    for (var z = 0; z < App.onReady.length; z++) {
        App.onReady[z]();
    }

});
