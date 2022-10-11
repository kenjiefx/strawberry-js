$hide:function(elementName,contextObj){
    let types = [SHOW_ELEMENT_ATTR,HIDE_ELEMENT_ATTR];
    for (var k = 0; k < types.length; k++) {
        let hideables = strawberry.$getAtElementFrom(document,types[k],elementName);
        for (var i = 0; i < hideables.length; i++) {
            let hideable = hideables[i];
            if (strawberry.$isScopeOfComponent(hideable,contextObj.getName())) {
                let stateReg = contextObj.getHidden(elementName);
                if (!stateReg.state) {
                    stateReg.state = true;
                    hideable.innerHTML = '';
                }
            }
        }
    }
}
