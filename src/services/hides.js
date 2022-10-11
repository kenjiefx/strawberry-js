$hides(renderObj,renderElement){
    // Finds all hideable elements
    let hideableElements = strawberry.$getElementsFrom(renderElement,HIDE_ELEMENT_ATTR);
    for (var i = 0; i < hideableElements.length; i++) {
        let hideableElement = hideableElements[i];
        let hideableName = strawberry.$getAtElementName(hideableElement,HIDE_ELEMENT_ATTR);
        if (null===renderObj.getHidden(hideableName)) {
            renderObj.addHidden(hideableName,hideableElement.innerHTML,true);
            hideableElement.innerHTML = '';
            this.$scope(renderObj,hideableElement);
            continue;
        }
        if (renderObj.getHidden(hideableName).state) {
            hideableElement.innerHTML = '';
        }
        this.$scope(renderObj,hideableElement);
    }
}
