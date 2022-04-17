$requires(scopeObj,scopeElement){

    // Turns a string in array notation into an actual array
    let arrify=(stx)=>{
        return JSON.parse(stx.replace(/'/g, '"'));
    }

    // Finds all elements with xrequired attribute
    let allWithRequireElements = scopeElement.querySelectorAll('[xrequire]');

    for (var i = 0; i < allWithRequireElements.length; i++) {
        let withRequireElement = allWithRequireElements[i];
        let requireStx = strawberry.$$core.$getXValue(withRequireElement,'xrequire');
        let required = arrify(requireStx);
        let hasMetRequired = required.every(element => {
            return scopeObj.$deps.includes(element);
        });
        if (!hasMetRequired) {
            withRequireElement.innerHTML= '';
            withRequireElement.outerHTML  = '<!-- strawberry.js: '+withRequireElement.outerHTML+' -->';
        }
    }

}
