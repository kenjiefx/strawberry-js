class Injector {
    constructor(fnString,refObj,refObjType){
        this.fnExpression = /(?<=\().+?(?=\))/g;
        this.invalidFnExpression = /[(={})]/g;
        this.fnString = fnString;
        this.refObj = refObj;
        this.refObjType = refObjType;
    }
    resolve(){
        // Set regex to match
        let matchedFunc = this.fnString.match(this.fnExpression);
        // If the function argument is empty, just return empty array
        if (matchedFunc===null) return [];
        // Checking whether the function expression is invalid
        if (this.invalidFnExpression.test(matchedFunc[0])) return [];
        // Match all regex in the innerHTML string of the element
        let argumentExpression = matchedFunc[0];
        let allArguments = argumentExpression.split(',');
        let argObj = new Array;
        for (var i = 0; i < allArguments.length; i++) {
            // Removing leading and trailing spaces in function arguments
             let arg = allArguments[i].trim();
             // When the argument passed is '$scope', then just return the scope object
             if (arg==='$scope') {
                 if (this.refObjType===COMPONENT_OBJECT)
                    argObj.push(this.refObj.export());
                 continue;
             }
             if (arg.charAt(0)==='$'&&this.refObjType===COMPONENT_OBJECT){
                 let __services = new Services();
                 let publicService = __services.$public()[arg];
                 let refObjCopy = this.refObj;
                 argObj.push(function(serviceArgs){
                     return publicService(serviceArgs,refObjCopy);
                 });
                 continue;
             }
             if (App.components.hasOwnProperty(arg)&&this.refObjType===COMPONENT_OBJECT) {
                 argObj.push(App.components[arg].getCallable());
                 continue;
             }
             if (App.factories.hasOwnProperty(arg)) {
                 argObj.push(App.factories[arg].build());
                 continue
             }
             if (App.services.hasOwnProperty(arg)) {
                 argObj.push(App.services[arg].build());
                 continue
             }
        }
        return argObj;
    }
}
