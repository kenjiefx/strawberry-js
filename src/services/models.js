$models(renderObj,renderElement){

    let modelAttrName = App.prefix+'model';

    /**
     * This function attemps to add an undefined model as part of the scope
     * For example, if you assign xmodel="user.firstName", but firstName
     * is not defined in $scope.user, then this function will add firstName
     * as member property of $scope.user automatically
     */
    let assign_Value=function(renderObj,modelExpression,modelValue){
        let parentObj = strawberry.$resolver().getParentObj(renderObj.export(),modelExpression);
        let childObjExpression = strawberry.$resolver().getChildObjectExp(modelExpression);
        if (undefined!==parentObj)
            parentObj[childObjExpression] = modelValue;
    }

    let assign_State=function(modelElement,modelState,modelExpression){
        (typeof modelState == 'boolean' && modelState) ?
            modelElement.setAttribute('checked','') :
            modelElement.removeAttribute('checked');
    }

    let update_Value=function(modelElement){
        console.log(modelElement.checked);
    }

    // Finds all elements with MODEL attributes
    let allModelElements = strawberry.$getElementsFrom(renderElement,MODEL_ELEMENT_ATTR);

    for (var i = 0; i < allModelElements.length; i++) {

        let modelElement = allModelElements[i];

        // Evaluating the value of the model element
        let modelExpression = strawberry.$getXValue(modelElement,MODEL_ELEMENT_ATTR);
        let resolvedObject = strawberry.$resolver().expression(renderObj.export(),modelExpression);
        let ModelValueStringType = true;

        // Different behavior for different input types
        if (modelElement.tagName==='INPUT'||modelElement.tagName==='SELECT') {

            // <input type="radio">
            if (modelElement.type==='radio') {
                ModelValueStringType = false;
                (resolvedObject===undefined) ?
                    assign_Value(renderObj,modelExpression,false) :
                    assign_State(modelElement,resolvedObject,modelExpression);
            }

            // <input type="checkbox">
            if (modelElement.type==='checkbox') {
                ModelValueStringType = false;
                (resolvedObject===undefined) ?
                    assign_Value(renderObj,modelExpression,false) :
                    assign_State(modelElement,resolvedObject,modelExpression);
            }

            // <input type="text"> or <select></select>
            if (modelElement.type==='text'||modelElement.tagName==='SELECT') {
                (resolvedObject===undefined) ?
                    assign_Value(renderObj,modelExpression,modelElement.value) :
                    modelElement.value = resolvedObject
            }

            modelElement.addEventListener('change',function(){
                assign_Value(
                    renderObj,
                    modelExpression,
                    (ModelValueStringType) ? modelElement.value : modelElement.checked
                );
            });
        }

        // <textarea>
        if (modelElement.tagName==='TEXTAREA') {
            (resolvedObject===undefined) ?
                assign_Value(renderObj,modelExpression,modelElement.value) :
                modelElement.value = resolvedObject
                
            modelElement.addEventListener('change',function(){
                assign_Value(
                    renderObj,
                    modelExpression,
                    (ModelValueStringType) ? modelElement.value : modelElement.checked
                );
            });
        }

    }

}
