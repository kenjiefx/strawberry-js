$hides(scopeObj,scopeElement){

    // Finds all elements with IF conditionals
    let allHidableElements = scopeElement.querySelectorAll('[xhide]');

    // Looping through conditional elements
    for (var i = 0; i < allHidableElements.length; i++) {

        let hidableElement = allHidableElements[i];

        if (!this.$isLocked(hidableElement)) {

            let hidableName = strawberry.$$core.$getXValue(hidableElement,'xhide');

            scopeObj.$hidden[hidableName] = {
                template: hidableElement.innerHTML,
                state: false
            }

            hidableElement.innerHTML = '';

            this.$lock(hidableElement);

        }

    }

}
