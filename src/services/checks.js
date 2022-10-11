$checks(renderObj,renderElement){

    // Finds all elements with CHECK attributes
    let allCheckElements = strawberry.$getElementsFrom(renderElement,CHECK_ELEMENT_ATTR);

    for (var i = 0; i < allCheckElements.length; i++) {

        let checkElement = allCheckElements[i];

        // Checked if element is locked
        if (this.$isLocked(checkElement)) continue;

        // Evaluating the value of the checked element
        let evaluator = strawberry.$getXValue(checkElement,CHECK_ELEMENT_ATTR);
        let returned = strawberry.$resolver().expression(renderObj.export(),evaluator);

        // Check if the returned value is typeof boolean
        if (typeof returned == 'boolean')
            returned ? checkElement.setAttribute('checked','') : checkElement.removeAttribute('checked');

        this.$lock(checkElement);

        this.$scope(renderObj,checkElement);

    }

}
