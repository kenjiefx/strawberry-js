$patch:(patchName=null,templateSrc=null)=>{
    if (patchName===null) {
        return {
            init:($scope,service)=>{
                this.$scope = $scope;
                return service;
            }
        }
    }

    let e = this.$scope.$app;

    if (this.$scope.$patchables.hasOwnProperty(patchName)) {

        // Finds all patchable element
        let allPatchableElements = strawberry.$$core.$getElementsFromScope(this.$scope.$name,'xpatch="'+patchName+'"');

        // Looping through all patchable elements, registers, the hides it
        for (var i = 0; i < allPatchableElements.length; i++) {

            let patchableElement = allPatchableElements[i];
            let template = templateSrc ?? this.$scope.$patchables[patchName];

            patchableElement.innerHTML = '';
            window[e].$scopes[this.$scope.$name].$services.$append(this.$scope,patchableElement,template);

        }

        return;

    }

    if (this.$scope.$templates.hasOwnProperty(patchName)) {

        // Finds all component element
        let allComponentElements = strawberry.$$core.$getElementsFromScope(this.$scope.$name,'xcomponent="'+patchName+'"');

        for (var i = 0; i < allComponentElements.length; i++) {

            let componentElement = allComponentElements[i];
            componentElement.innerHTML = '';

            let template = this.$scope.$templates[patchName];
            window[e].$scopes[this.$scope.$name].$services.$append(this.$scope,componentElement,template);

        }

        return;

    }

}
