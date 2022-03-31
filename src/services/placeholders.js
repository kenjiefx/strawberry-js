$placeholders(scopeObj,scopeElement)
{

    let regularExpression = /(?<=\{{).+?(?=\}})/g;

    let template = scopeElement.innerHTML;

    // Match all regex in the innerHTML string of the element
    let allMatchedData = template.match(regularExpression);

    // If there is a match regex
    if (allMatchedData!==null) {

        for (var i = 0; i < allMatchedData.length; i++) {

            let resolvedExpression = strawberry.$$core.$resolver.expression(scopeObj,allMatchedData[i].trim());
            if (resolvedExpression===undefined) {
                resolvedExpression='';
            }
            template = template.replace('{{'+allMatchedData[i]+'}}',resolvedExpression);
        }
    }

    scopeElement.innerHTML = template;

}
