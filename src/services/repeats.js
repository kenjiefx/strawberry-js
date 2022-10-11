$repeats(renderObj,renderElement){

    let REFERENCE_TOKEN = '$$index';

    // Converts repeat expression into two entites: refObjName and aliasObjName
    let parseExp = function(expression){
        if (expression.includes('until '))
            return [REFERENCE_TOKEN,expression.split('until')[1].trim()];
        return [
            expression.split(' as ')[0].trim(),
            expression.split(' as ')[1].trim()
        ];
    }

    // Finds all elements with repeatable elements
    let repeatElements = strawberry.$getElementsFrom(renderElement,REPEAT_ELEMENT_ATTR);

    // Looping through repeatable elements
    for (var i = 0; i < repeatElements.length; i++) {

        let repeatElement = repeatElements[i];
        let htmlTemplate = repeatElement.innerHTML;

        // Emptying the repeatable element, to be populated
        // later with the repeated content
        repeatElement.innerHTML = '';

        let expression = strawberry.$getXValue(repeatElement,REPEAT_ELEMENT_ATTR);
        let [refObjName,aliasObjName] = parseExp(expression);

        if (refObjName===REFERENCE_TOKEN) {

            // This creates a new object that we can loop through
            let repetitions = strawberry.$resolver().expression(renderObj.export(),aliasObjName);

            // How many repitions are to be made
            let repeatTimes = 0;
            if (repetitions instanceof Array) repeatTimes = repetitions.length;
            if (Number.isInteger(repetitions)) repeatTimes = repetitions;

            renderObj.export().$$index = {};
            let k = 0;
            while (k<repeatTimes)
                renderObj.export().$$index['props'+(k++)] = new Object;

        }

        let repeatableObject = strawberry.$resolver().expression(renderObj.export(),refObjName);

        if (undefined!==repeatableObject&&null!==repeatableObject) {
            let j = 0;
            for (const [key, value] of Object.entries(repeatableObject)) {

                // Creating an invidual component for each repititions
                let contextObj = (new Component())
                                 .setTemplate(htmlTemplate)
                                 .setProps(aliasObjName,value)
                                 .setProps('$parent',renderObj.export())
                                 .setProps('$index',j++);

                let repeatTemplateElement = create_element(htmlTemplate);
                this.$render(contextObj,repeatTemplateElement,'events');
                bind_element(repeatTemplateElement,repeatElement);

            }
        }


    }


}
