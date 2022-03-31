$styles(scopeObj,scopeElement){

    let allStyleElements = scopeElement.querySelectorAll('[xstyle]');

    for (var i = 0; i < allStyleElements.length; i++) {
        let styleElement = allStyleElements[i];

        // Checked if element is locked
        if (!this.$isLocked(styleElement)) {
            let evaluator = strawberry.$$core.$getXValue(styleElement,'xstyle');
            let returned = strawberry.$$core.$resolver.expression(scopeObj,evaluator).trim();
            if (returned!==null&&returned!=='') {
                styleElement.classList.add(returned);
            }
        }

        this.$lock(styleElement);

    }

}
