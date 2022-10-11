$scope(renderObj,renderElement){
    let scopeAttrName = App.prefix+'scope';
    renderElement.setAttribute(scopeAttrName,'$'+renderObj.getName());
}
