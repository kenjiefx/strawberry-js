$enablers(renderObj,renderElement){

    // Finds all elements with ENABLE attributes
    let allToEnableElements = strawberry.$getElementsFrom(renderElement,ENABLE_ELEMENT_ATTR);

    // Looping through the elements
    for (var i = 0; i < allToEnableElements.length; i++) {

        let toEnableElement = allToEnableElements[i];
        let elementName = strawberry.$getAtElementName(toEnableElement,ENABLE_ELEMENT_ATTR);

        if (null===renderObj.getFormState(elementName)) {
            // Registering the element
            renderObj.addFormState(elementName,true);
        }

        toEnableElement.disabled = !renderObj.getFormState(elementName);
        this.$scope(renderObj,toEnableElement);

    }

}
