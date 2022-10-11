$blocks(renderObj,renderElement){
    // Finds all elements with Block attributes
    let allBlockElements = strawberry.$getElementsFrom(renderElement,BLOCK_ELEMENT_ATTR);
    for (var i = 0; i < allBlockElements.length; i++) {
        this.$scope(renderObj,allBlockElements[i]);
    }
}
