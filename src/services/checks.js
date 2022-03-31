$checks(scopeObj,scopeElement){

    let allCheckElements = scopeElement.querySelectorAll('[xcheck]');

    for (var i = 0; i < allCheckElements.length; i++) {

        let checkElement = allCheckElements[i];

        // Checked if element is locked
        if (!this.$isLocked(checkElement)) {

            let evaluator = strawberry.$$core.$getXValue(checkElement,'xcheck');
            let returned = strawberry.$$core.$resolver.expression(scopeObj,evaluator);

            // Check if the returned value is typeof boolean
            if (typeof returned == "boolean") {
                if (returned===true) {
                    checkElement.setAttribute('checked','');
                }
                else {
                    checkElement.removeAttribute('checked');
                }
            }
            else {
                if (strawberry.debug) {
                    console.warn('strawberry.js: Unable to resolve element checked attribute with '+evaluator+', return value must be typeof Boolean');
                }
            }

        }

        this.$lock(checkElement);


    }

}
