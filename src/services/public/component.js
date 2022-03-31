$component:(componentName=null)=>{
    if (componentName===null) {
        return {
            init:($scope,service)=>{
                this.$scope = $scope;
                return service;
            }
        }
    }

    let e = this.$scope.$app;

    if (this.$scope.$templates.hasOwnProperty(componentName)) {

        // Finds all component element
        let allComponentElements = strawberry.$$core.$getElementsFromScope(this.$scope.$name,'xcomponent="'+componentName+'"');

        console.log(allComponentElements);

        for (var i = 0; i < allComponentElements.length; i++) {

            let template = this.$scope.$templates[componentName];
            let componentElement = allComponentElements[i];
            let element = new Element(componentElement);
            element.update=()=>{
                componentElement.innerHTML = '';
                window[e].$scopes[this.$scope.$name].$services.$append(this.$scope,componentElement,template);
            }
            return element;

        }

        return;

    }

}
