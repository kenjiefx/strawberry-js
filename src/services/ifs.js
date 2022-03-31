$ifs(scopeObj,scopeElement){

    // Finds all elements with IF conditionals
    let allElemWithIfConditionals = scopeElement.querySelectorAll('[xif]');

    // Looping through conditional elements
    for (var i = 0; i < allElemWithIfConditionals.length; i++) {

        let conditionalElement = allElemWithIfConditionals[i];

        if (!this.$isLocked(conditionalElement)) {

            let argument = strawberry.$$core.$getXValue(conditionalElement,'xif');

            let resolved = strawberry.$$core.$resolver.expression(scopeObj,argument.trim());

            if (typeof resolved == "boolean") {
                if (!resolved) conditionalElement.innerHTML= '';
            }
            else {
                if (strawberry.debug) {
                    console.warn('strawberry.js: Unable to resolve "if" conditional with argument "'+argument+'", return value must be typeof Boolean');
                }
            }

            this.$lock(conditionalElement);

        }

    }


}
