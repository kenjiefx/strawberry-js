$ifs(renderObj,renderElement){

    // Finds all elements with IF conditionals
    let allElemWithIfConditionals = strawberry.$getElementsFrom(renderElement,IF_ELEMENT_ATTR);

    // Looping through conditional elements
    for (var i = 0; i < allElemWithIfConditionals.length; i++) {
        let conditionalElement = allElemWithIfConditionals[i];

        if (!this.$isLocked(conditionalElement)) {

            // Resolving the argument of the conditional element
            let argument = strawberry.$getXValue(conditionalElement,IF_ELEMENT_ATTR);
            let resolved = strawberry.$resolver().expression(renderObj.export(),argument.trim());


            if (typeof resolved == 'boolean' && !resolved) {
                conditionalElement.innerHTML = '';
                if (null!==conditionalElement.parentNode)
                    strawberry.$disposeElement(conditionalElement,false);
            }

            this.$lock(conditionalElement);

        }


    }

}
