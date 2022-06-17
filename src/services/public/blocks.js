$block:(elementName=null,callback=null)=>{
    if (elementName===null) {
        return {
            init:($scope,service)=>{
                this.$scope = $scope;
                return service;
            }
        }
    }
    let e = this.$scope.$app;
    let blockName = '@'+elementName;
    let blockOfElements = strawberry.$$core.$getElementsFromScope(this.$scope.$name,'xblock="'+blockName+'"');
    for (var i = 0; i < blockOfElements.length; i++) {
        let elementBlock = blockOfElements[i];
        callback((new Element(elementBlock)),i);
    }
}
