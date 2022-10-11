$placeholders(renderObj,renderElement){
    let regularExpression = /(?<=\{{).+?(?=\}})/g;
    let template = renderElement.innerHTML;

    renderElement.innerHTML = '';

    // Match all regex in the innerHTML string of the element
    let allMatchedData = template.match(regularExpression);

    // If there is a match regex
    if (allMatchedData!==null) {
        for (var i = 0; i < allMatchedData.length; i++) {
            let resolvedExpression = strawberry.$resolver().expression(renderObj.export(),allMatchedData[i].trim());
            if (resolvedExpression===undefined) {
                resolvedExpression='';
            }
            template = template.replace('{{'+allMatchedData[i]+'}}',resolvedExpression);
        }
    }

    renderElement.innerHTML = template;

}
