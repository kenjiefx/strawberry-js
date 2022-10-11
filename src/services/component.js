$component(){
    return {
        register:function(componentElement){

            // Get the name of the component
            let componentName = strawberry.$getAtElementName(componentElement,COMPONENT_ELEMENT_ATTR);

            // Checking whether the component is declared
            if (App.components.hasOwnProperty(componentName)) {

                // Creating a new element template
                let tempElement = create_element(componentElement.innerHTML);

                // Removing any component element
                let allComponentsInTemplate = strawberry.$getElementsFrom(tempElement,COMPONENT_ELEMENT_ATTR);
                for (var i = 0; i < allComponentsInTemplate.length; i++) {
                    allComponentsInTemplate[i].innerHTML = '';
                }

                // Register component template
                App.components[componentName].setTemplate(tempElement.innerHTML)

                App.components[componentName].build();

            }

            return componentName;

        },
        render:function(componentElement){

            // Create a temporary element where we can safely render the component
            let component = create_element('');

            // Get the component name
            let componentName = strawberry.$getAtElementName(componentElement,COMPONENT_ELEMENT_ATTR);

            // Checking whether the component is declared
            if (App.components.hasOwnProperty(componentName)) {

                // Render the component content
                let _services = new Services();
                component.innerHTML = App.components[componentName].getTemplate();
                _services.$render(App.components[componentName],component);
                return component;

            }

            return null;
        }
    }
}
