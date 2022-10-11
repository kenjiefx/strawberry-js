$show:function(elementName,contextObj){
    let types = [SHOW_ELEMENT_ATTR,HIDE_ELEMENT_ATTR];
    for (var k = 0; k < types.length; k++) {
        let showables = strawberry.$getAtElementFrom(document,types[k],elementName);
        for (var i = 0; i < showables.length; i++) {
            let showable = showables[i];
            if (strawberry.$isScopeOfComponent(showable,contextObj.getName())) {
                let stateReg = contextObj.getHidden(elementName);
                if (stateReg.state) {
                    stateReg.state = false;
                    showable.innerHTML = stateReg.template;
                }
            }
        }
    }
}
