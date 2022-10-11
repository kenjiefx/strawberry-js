$styles(renderObj,renderElement){

    // Finds all elements with STYLE attributes
    let allStyleElements = strawberry.$getElementsFrom(renderElement,STYLE_ELEMENT_ATTR);

    for (var i = 0; i < allStyleElements.length; i++) {

        let styleElement = allStyleElements[i];

        // Checked if element is locked
        if (this.$isLocked(styleElement)) continue;

        // Evaluating the value of the checked element
        let evaluator = strawberry.$getXValue(styleElement,STYLE_ELEMENT_ATTR);
        let returned = strawberry.$resolver().expression(renderObj.export(),evaluator);

        if (returned!==null&&returned!==''&&returned!==undefined)
            styleElement.classList.add(returned);

        this.$lock(styleElement);

    }

}
