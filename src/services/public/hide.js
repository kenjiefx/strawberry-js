$hide:(elementName=null)=>{
    if (elementName===null) {
        return {
            init:($scope,service)=>{
                this.$scope = $scope;
                return service;
            }
        }
    }

    
    let hide=(element)=>{
        // Check if the current state of the element is true (means SHOWING)
        if (this.$scope.$hidden[elementName].state) {
            element.innerHTML = '';
            // Modifies the state of the hidable element
            this.$scope.$hidden[elementName].state = false;
        }
    }

    // Finds all element named under the xshow attribute
    let allShowElements = strawberry.$$core.$getElementsFromScope(this.$scope.$name,'xshow="'+elementName+'"');
    for (var i = 0; i < allShowElements.length; i++) {
        hide(allShowElements[i]);
    }

    // Finds all element named under the xhide attribute
    let allHideElements = strawberry.$$core.$getElementsFromScope(this.$scope.$name,'xhide="'+elementName+'"');
    for (var i = 0; i < allHideElements.length; i++) {
        hide(allHideElements[i]);
    }

}
