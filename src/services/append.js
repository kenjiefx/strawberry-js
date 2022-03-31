// Renders and appends the template as content to a certain element
$append(scopeObj,scopeElement,template,$skip=null,$cleanUp=null){

    // Creating a new element
    let tempElement = document.createElement('div');

    // If the scope element has to be cleaned up before template is appended
    if ($cleanUp) {
        scopeElement.innerHTML = '';
    }

    // Adding the template as innerHTML to the element
    tempElement.innerHTML = template;

    // Renders the contents of the element
    this.$render(scopeObj,tempElement,$skip);

    // Apends the elemens
    while (tempElement.childNodes.length > 0) {
        scopeElement.appendChild(tempElement.childNodes[0]);
    }

}
