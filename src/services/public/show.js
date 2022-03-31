$show:(elementName=null)=>{
    if (elementName===null) {
        return {
            init:($scope,service)=>{
                this.$scope = $scope;
                return service;
            }
        }
    }

    let e = this.$scope.$app;
    let show=(element)=>{
        // Check if the current state of the element is false (means HIDDEN)
        if (!this.$scope.$hidden[elementName].state) {
            window[e].$scopes[this.$scope.$name].$services.$append(this.$scope,element,this.$scope.$hidden[elementName].template,null,true);
            // Modifies the state of the element
            this.$scope.$hidden[elementName].state = true;
        }
    }

    // Finds all element named under the xhide attribute
    let allHideElements = strawberry.$$core.$getElementsFromScope(this.$scope.$name,'xhide="'+elementName+'"');
    for (var i = 0; i < allHideElements.length; i++) {
        show(allHideElements[i]);
    }

    // Finds all element named under the xshow attribute
    let allShowElements = strawberry.$$core.$getElementsFromScope(this.$scope.$name,'xshow="'+elementName+'"');
    for (var i = 0; i < allShowElements.length; i++) {
        show(allShowElements[i]);
    }

}
