$disablers(scopeObj,scopeElement){

    // Finds all elements with data-disable
    let allDisabledInputs = scopeElement.querySelectorAll('[xdisable]');

    // Looping through form elements
    for (var i = 0; i < allDisabledInputs.length; i++) {

        let disabledElement = allDisabledInputs[i];

        if (!disabledElement.disabled) {
            disabledElement.disabled = true;
        }

    }

}
