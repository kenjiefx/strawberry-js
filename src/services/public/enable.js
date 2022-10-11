$enable:function(elementName,contextObj){
    let types = [ENABLE_ELEMENT_ATTR,DISABLE_ELEMENT_ATTR];
    for (var k = 0; k < types.length; k++) {
        let toEnables = strawberry.$getAtElementFrom(document,types[k],elementName);
        for (var i = 0; i < toEnables.length; i++) {
            let toEnable = toEnables[i];
            if (strawberry.$isScopeOfComponent(toEnable,contextObj.getName())) {
                if (!contextObj.getFormState(elementName)) {
                    contextObj.addFormState(elementName,true);
                    toEnable.disabled = false;
                }
            }
        }
    }
}
