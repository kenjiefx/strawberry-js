$events(scopeObj,scopeElement){

    let addEvent=(scopeObj,eventElement,funcExpression,eventType)=>{

        if (strawberry.$$core.$resolver.getResolveType(funcExpression)!=='function') {
            if (strawberry.debug) {
                console.warn('strawberry.js: Unable to add click event, $scope.'+funcExpression+' must typeof a function');
            }
        }

        eventElement.addEventListener(eventType,()=>{
            strawberry.$$core.$resolver.expression(scopeObj,funcExpression,eventElement);
        });

        this.$lockEvent(eventElement,eventType);

    }


    // Finds all elements with data-click attribute
    let allClickableElements = scopeElement.querySelectorAll('[xclick]');

    // Looping through the clickable elements
    for (let i = 0; i < allClickableElements.length; i++) {

        let clickableElement = allClickableElements[i];

        // Takes the function name referenced for the click event
        let clickFunction = strawberry.$$core.$getXValue(clickableElement,'xclick');

        if (!this.$isEventLocked(clickableElement,'click')) {
            addEvent(scopeObj,clickableElement,clickFunction,'click');
        }

    }

    let allChangeableElement = scopeElement.querySelectorAll('[xchange]');

    // Looping through the change elements
    for (let i = 0; i < allChangeableElement.length; i++) {

        let changeElement = allChangeableElement[i];

        // Takes the function name referenced for the change event
        let clickFunction = strawberry.$$core.$getXValue(changeElement,'xchange');

        if (!this.$isEventLocked(changeElement,'change')) {
            addEvent(scopeObj,changeElement,clickFunction,'change');
        }

    }

}
