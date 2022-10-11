// Renders the element based on the values of the scope object
$render(renderObj,renderElement,skip=null){

    // Temporarily hides the given scope element
    //renderElement.style.opacity='0';

    this.$repeats(renderObj,renderElement);
    this.$ifs(renderObj,renderElement);
    this.$hides(renderObj,renderElement);
    this.$shows(renderObj,renderElement);
    this.$placeholders(renderObj,renderElement);
    this.$checks(renderObj,renderElement);
    this.$styles(renderObj,renderElement);
    this.$models(renderObj,renderElement);
    this.$disablers(renderObj,renderElement);
    this.$enablers(renderObj,renderElement);
    this.$blocks(renderObj,renderElement);

    if (skip!=='events'){
        this.$events(renderObj,renderElement);
    }



}
