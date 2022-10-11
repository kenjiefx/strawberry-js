$disablers(renderObj,renderElement){

    // Finds all elements with DISABLE attributes
    let allToDisableElements = strawberry.$getElementsFrom(renderElement,DISABLE_ELEMENT_ATTR);

    // Looping through the elements
    for (var i = 0; i < allToDisableElements.length; i++) {

        let toDisableElement = allToDisableElements[i];
        let elementName = strawberry.$getAtElementName(toDisableElement,DISABLE_ELEMENT_ATTR);

        if (null===renderObj.getFormState(elementName)) {
            // Registering the element
            renderObj.addFormState(elementName,false);
        }
        toDisableElement.disabled = !renderObj.getFormState(elementName);
        this.$scope(renderObj,toDisableElement);

    }

}
