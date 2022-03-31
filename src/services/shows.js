$shows(scopeObj,scopeElement){
    // Finds all elements with IF conditionals
    let allShowableElements = scopeElement.querySelectorAll('[xshow]');
    // Looping through conditional elements
    for (var i = 0; i < allShowableElements.length; i++) {
        let showableElement = allShowableElements[i];
        // Check if element is locked
        if (!this.$isLocked(showableElement)) {
            // Get the name of the showable element
            let showableName = strawberry.$$core.$getXValue(showableElement,'xshow');
            // Record showable entry the scope's $hidden object
            scopeObj.$hidden[showableName] = {
                template: showableElement.innerHTML,
                state: true
            }
            this.$lock(showableElement);
        }
    }
}
