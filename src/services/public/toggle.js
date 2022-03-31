$toggle:(hidableName=null)=>{
    if (hidableName===null) {
        return {
            init:($scope,service)=>{
                this.$scope = $scope;
                return service;
            }
        }
    }

    let e = this.$scope.$app;

    let hideService = window[e].$scopes[this.$scope.$name].$services.$public()['$hide'];
    let $hide = hideService().init(this.$scope,hideService);

    let showService = window[e].$scopes[this.$scope.$name].$services.$public()['$show'];
    let $show = showService().init(this.$scope,showService);

    // Check if the name of the hidden element is registered
    if (this.$scope.$hidden.hasOwnProperty(hidableName)) {
        if (this.$scope.$hidden[hidableName].state) {
            // Element is currently being SHOWN
            this.$scope.$togglers[hidableName] = false;
            $hide(hidableName);

        }
        else {
            // Element is current being HIDDEN
            this.$scope.$togglers[hidableName] = true;
            $show(hidableName);
        }
    }
    else {
        if (strawberry.debug) {
            console.warn('strawberry.js: Unable to toggle "'+hidableName+'", element do not exist');
        }
    }








}
