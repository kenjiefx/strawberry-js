$toggle:function(elementName,contextObj){
    let types = [SHOW_ELEMENT_ATTR,HIDE_ELEMENT_ATTR];
    for (var k = 0; k < types.length; k++) {
        let toggleables = strawberry.$getAtElementFrom(document,types[k],elementName);
        for (var i = 0; i < toggleables.length; i++) {
            let toggleable = toggleables[i];
            if (strawberry.$isScopeOfComponent(toggleable,contextObj.getName())) {
                let stateReg = contextObj.getHidden(elementName);
                if (stateReg.state) {
                    stateReg.state = false;
                    toggleable.innerHTML = stateReg.template;
                } else {
                    stateReg.state = true;
                    toggleable.innerHTML = '';
                }
            }
        }
    }
}
