$disable:function(elementName,contextObj){
    let types = [ENABLE_ELEMENT_ATTR,DISABLE_ELEMENT_ATTR];
    for (var k = 0; k < types.length; k++) {
        let toDisables = strawberry.$getAtElementFrom(document,types[k],elementName);
        for (var i = 0; i < toDisables.length; i++) {
            let toDisable = toDisables[i];
            if (strawberry.$isScopeOfComponent(toDisable,contextObj.getName())) {
                if (contextObj.getFormState(elementName)) {
                    contextObj.addFormState(elementName,false);
                    toDisable.disabled = true;
                }
            }
        }
    }

}
