$enable:(enableName=null,isEnable=null)=>{
    if (enableName===null) {
        return {
            init:($scope,service)=>{
                this.$scope = $scope;
                return service;
            }
        }
    }

    let e = this.$scope.$app;
    let willEnable = isEnable ?? true;

    if (willEnable) {
        let allDisabledInputs = strawberry.$$core.$getElementsFromScope(this.$scope.$name,'xdisable="'+enableName+'"');
        for (var i = 0; i < allDisabledInputs.length; i++) {
            let disabledInput = allDisabledInputs[i];
            if (disabledInput.disabled) {
                disabledInput.disabled = false;
            }
        }
    }
    else {
        let disableService = window[e].$scopes[this.$scope.$name].$services.$public()['$disable'];
        let $disable = disableService().init(this.$scope,disableService);
        $disable(enableName);
    }

}
