$shows(renderObj,renderElement){
    // Finds all showable elements
    let showableElements = strawberry.$getElementsFrom(renderElement,SHOW_ELEMENT_ATTR);
    for (var i = 0; i < showableElements.length; i++) {
        let showableElement = showableElements[i];
        let showableName = strawberry.$getAtElementName(showableElement,SHOW_ELEMENT_ATTR);
        if (null===renderObj.getHidden(showableName)) {
            renderObj.addHidden(showableName,showableElement.innerHTML,false);
            this.$scope(renderObj,showableElement);
            continue;
        }
        if (renderObj.getHidden(showableName).state) {
            showableElement.innerHTML = '';
        }
        this.$scope(renderObj,showableElement);

    }
}
