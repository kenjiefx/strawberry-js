$disable:(enableName=null,isEnable=null)=>{
    if (enableName===null) {
        return {
            init:($scope,service)=>{
                this.$scope = $scope;
                return service;
            }
        }
    }

    let e = this.$scope.$app;
    let willDisable = isEnable ?? true;

    if (willDisable) {
        let allDisabledInputs = strawberry.$$core.$getElementsFromScope(this.$scope.$name,'xdisable="'+enableName+'"');
        for (var i = 0; i < allDisabledInputs.length; i++) {
            let disabledInput = allDisabledInputs[i];
            if (!disabledInput.disabled) {
                disabledInput.disabled = true;
            }
        }
    }
    else {
        let enableService = window[e].$scopes[this.$scope.$name].$services.$public()['$enable'];
        let $enable = enableService().init(this.$scope,enableService);
        $enable(enableName);
    }

}
