$patch:function(args,contextObj){

    let patchSvc = function(){

        let patchTemplate = create_component(contextObj.getName(),contextObj.getTemplate());

        let components = strawberry.$getElementsFrom(patchTemplate,COMPONENT_ELEMENT_ATTR);

        let late_binder = [];


        // Looping through all declared components in the DOM
        for (var i = 0; i < components.length; i++) {

            // Get the name of the component
            let componentName = strawberry.$getAtElementName(components[i],COMPONENT_ELEMENT_ATTR);


            // We do not patch any other component, but since the DOM has to be updated
            // when patch is called, the child component, if there is any, has to be copied
            // directly, whatever the state of component, to the component elements.
            if (i>0) {
                if (null===strawberry.$getComponentFrom(document,componentName)) {
                    late_binder.push(()=>{
                        if(null===strawberry.$getComponentFrom(document,componentName)) return;
                        let new_services = new Services();
                        new_services.$public().$patch('',App.components[componentName]);
                    });
                } else {
                    bind_element(
                        strawberry.$getComponentFrom(document,componentName),
                        strawberry.$getComponentFrom(patchTemplate,componentName)
                    );
                }
                continue;
            }

            let _services = new Services();
            let component = _services.$component().render(components[i]);

            // Deactivate element when it's not declared
            if (null===component) {
                strawberry.$disposeElement(
                    strawberry.$getComponentFrom(patchTemplate,componentName),
                    'No component declared'
                );
                continue;
            }

            // Render element when it's declared
            if (null!==strawberry.$getComponentFrom(patchTemplate,componentName)) {
                strawberry.$getComponentFrom(patchTemplate,componentName).innerHTML = '';
                bind_element(component,strawberry.$getComponentFrom(patchTemplate,componentName));
            }

        }

        let appElement = document.querySelector('[xstrawberry="'+App.name+'"]');

        strawberry.$getComponentFrom(appElement,contextObj.getName()).innerHTML = '';

        // Apends the template to the DOM
        bind_element(patchTemplate.childNodes[0],strawberry.$getComponentFrom(appElement,contextObj.getName()));

        for (var s = 0; s < late_binder.length; s++) {
            late_binder[s]();
        }


    }


    if (!App.isReady) {
        App.onReady.push(function(){
            patchSvc();
        });
    } else {
        patchSvc();
    }


}
