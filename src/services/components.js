/**
 * @function $components
 * Fetches external components and appends it to the x-component attribute
 */
$components(scopeObj,scopeElement){

    let getAllComponentsFromGivenElement = (scopeElement,componentReferenceName) => {
        return strawberry.$$core.$getElementsFrom(scopeElement,'xcomponent="'+componentReferenceName+'"');
    }

    /**
     * @function
     * Renders all identified component elements based on
     * the component element's xcomponent attribute value
     */
    let renderAllComponentElements = (allComponentElements,tempElement) => {
      for (var i = 0; i < allComponentElements.length; i++) {
          let thisComponentElement = allComponentElements[i];
          // Apends the elemens
          while (tempElement.childNodes.length > 0) {
              thisComponentElement.appendChild(tempElement.childNodes[0]);
          }
      }
    }

    // Selecting all elements referenced by attribute attribute xcomponent
    let componentElements = strawberry.$$core.$getElementsFrom(scopeElement,'xcomponent');

    // Looping through all the identified element
    for (var i = 0; i < componentElements.length; i++) {

        let componentElement = componentElements[i];

        // Getting the xcomponent attribute value to be served as referenced
        let componentReference = strawberry.$$core.$getXValue(componentElement,'xcomponent');

        /** Component elements can have children by default. If this is the case,
            Strawberry will not attempt to load any external component **/
        if (componentElement.innerHTML.trim()!=='') {
            // Saves component element to the template
            scopeObj.$templates[componentReference] = componentElement.innerHTML;
            return;
        }

        /**
         * When component elements are empty, Strawberry.js will default to
         * try to load the content externally based on the value given to
         * the element's x-component attribute
         */
         let path = strawberry.$$core.$resolver.expression(scopeObj,componentReference);

         /**
          * @var path must be returned as a type of string
          * With other data types, the path cannot be considered
          * as a valid url to load the component from
          */
         if (typeof path !== 'string') {
             if (strawberry.debug) {
                 console.warn('strawberry.js: Unable to resolve component path: $scope.'+componentReference+', typeof string required');
             }
         }

         this.$public().$http().init(scopeObj).get(path,(response)=>{

              /**
               * NOTE: Response can either be text returned by the URL
               * regardless of the HTTP status code
               */

              let tempElement = document.createElement('div');

              // Adding the template as innerHTML to the element
              tempElement.innerHTML = response;

              // Renders the contents of the element
              this.$render(scopeObj,tempElement);

              let allComponentElements = getAllComponentsFromGivenElement(scopeElement,componentReference);

              if (allComponentElements.length===0) {
                  let scopeElements = strawberry.$$core.$getScope(scopeObj.$name);
                  for (var i = 0; i < scopeElements.length; i++) {
                      let scopeElement = scopeElements[i];
                      let allComponentElements = getAllComponentsFromGivenElement(scopeElement,componentReference);
                      renderAllComponentElements(allComponentElements,tempElement);
                  }
                  this.$lock(componentElement);
                  return;
              }

              renderAllComponentElements(allComponentElements,tempElement);

              this.$lock(componentElement);

         });

    }
}
