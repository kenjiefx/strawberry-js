// Renders the element based on the values of the scope object
$render(scopeObj,renderElement,skip=null){

    // Temporarily hides the given scope element
    renderElement.style.opacity='0';

    this.$components(scopeObj,renderElement);
    this.$patches(scopeObj,renderElement);
    this.$switchers().find(scopeObj,renderElement);
    this.$repeats(scopeObj,renderElement);
    this.$ifs(scopeObj,renderElement);
    this.$hides(scopeObj,renderElement);
    this.$shows(scopeObj,renderElement);
    this.$placeholders(scopeObj,renderElement);
    this.$checks(scopeObj,renderElement);
    this.$styles(scopeObj,renderElement);
    this.$models(scopeObj,renderElement);
    this.$disablers(scopeObj,renderElement);

    if (skip!=='events') {
        this.$events(scopeObj,renderElement);
    }

    renderElement.style.opacity='1';
}
