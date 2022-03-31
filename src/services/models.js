$models(scopeObj,scopeElement){

    let assignModelObjValue=(scopeObj,modelExpression,modelValue)=>{
        let parentObj = strawberry.$$core.$resolver.getParentObj(scopeObj,modelExpression);
        let childObjExpression = strawberry.$$core.$resolver.getChildObjectExp(modelExpression);
        if (parentObj===undefined) {
            if (strawberry.debug) {
                console.error('strawberry.js: Unable to add member property "'+modelExpression+'" to $scope.'+parentObjExpression+', object is undefined');
            }
        }
        else {
            parentObj[childObjExpression] = modelValue;
        }
    }

    let assignModelElementState=(modelElement,modelState,modelExpression)=>{
        if (typeof modelState == "boolean") {
            if (modelState===true) {
                modelElement.setAttribute('checked','');
            }
            else {
                modelElement.removeAttribute('checked');
            }
        }
        else {
            if (strawberry.debug) {
                console.warn('strawberry.js: Unable to resolve element checked attribute with '+modelExpression+', return value must be typeof Boolean');
            }
        }
    }

    let allModelElements = scopeElement.querySelectorAll('[xmodel]');

    for (var i = 0; i < allModelElements.length; i++) {
        let modelElement = allModelElements[i];
        let modelExpression = strawberry.$$core.$getXValue(modelElement,'xmodel');

        // Different behavior for input as it will get the value
        if(modelElement.tagName==='INPUT' || modelElement.tagName==='SELECT'){

            if (modelElement.type==='radio') {

                let resolvedObject = strawberry.$$core.$resolver.expression(scopeObj,modelExpression);

                if (resolvedObject===undefined) {
                    assignModelObjValue(scopeObj,modelExpression,false);
                }
                else {
                    assignModelElementState(modelElement,resolvedObject,modelExpression);
                }

                modelElement.addEventListener('change', ()=>{
                    assignModelObjValue(scopeObj,modelExpression,modelElement.checked);
                });
            }

            else if (modelElement.type==='checkbox') {
                let resolvedObject = strawberry.$$core.$resolver.expression(scopeObj,modelExpression);
                if (resolvedObject===undefined) {
                    assignModelObjValue(scopeObj,modelExpression,false);
                }
                else {
                    assignModelElementState(modelElement,resolvedObject,modelExpression);
                }
                modelElement.addEventListener('change', ()=>{
                    assignModelObjValue(scopeObj,modelExpression,modelElement.checked);
                });
            }

            else {

                let resolvedObject = strawberry.$$core.$resolver.expression(scopeObj,modelExpression);
                if (resolvedObject===undefined) {
                    assignModelObjValue(scopeObj,modelExpression,modelElement.value);
                }
                else {
                    modelElement.value = resolvedObject;
                }

                // Add change event listener to input
                modelElement.addEventListener('change', ()=>{
                    assignModelObjValue(scopeObj,modelExpression,modelElement.value);
                });

            }
        }
    }

}
