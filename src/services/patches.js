$patches(scopeObj,scopeElement){

    // Finds elements with xpatch attribute
    let allPatchableElements = scopeElement.querySelectorAll('[xpatch]');

    for (var i = 0; i < allPatchableElements.length; i++) {

        let patchableElement = allPatchableElements[i];

        let patchName = strawberry.$$core.$getXValue(patchableElement,'xpatch');

        // Registers the template:
        scopeObj.$patchables[patchName] = patchableElement.innerHTML;

    }

}
