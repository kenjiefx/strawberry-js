$switchers(scopeObj,scopeElement){

    return {

        find:(scopeObj,scopeElement)=>{

            // Finds all elements with SWITCH conditionals
            let allSwitchableElements = scopeElement.querySelectorAll('[xswitch]');

            // Looping through switch elements
            for (var i = 0; i < allSwitchableElements.length; i++) {

                let switchableElement = allSwitchableElements[i];

                let switchName = strawberry.$$core.$getXValue(switchableElement,'xswitch');

                // Registers a new switch object in the scopeObj' $switch property
                scopeObj.$switchers[switchName] = new Object;

                // Registers when element
                this.$switchers().when(scopeObj,switchableElement,switchName);

                // Registers default element
                this.$switchers().default(scopeObj,switchableElement,switchName);

            }

        },

        when:(scopeObj,switchableElement,switchName)=>{

            let allSwitchWhenElements = switchableElement.querySelectorAll('[xswitch-when]');

            // Looping through switch when elements
            for (var k = 0; k < allSwitchWhenElements.length; k++) {

                // Take each switch when element
                let switchWhenElement = allSwitchWhenElements[k];
                let switchWhenName = strawberry.$$core.$getXValue(switchWhenElement,'xswitch-when');

                // Registers when switch element
                scopeObj.$switchers[switchName][switchWhenName] = {
                    '$html': switchWhenElement.innerHTML,
                    '$onSwitch': false
                }

                switchWhenElement.innerHTML = '';

            }
        },

        default:(scopeObj,switchableElement,switchName)=>{

            let allSwitchDefaultElements = switchableElement.querySelectorAll('[xswitch-default]');

            // Looping through switch when elements
            for (var k = 0; k < allSwitchDefaultElements.length; k++) {

                let switchDefaultElement = allSwitchDefaultElements[k];

                scopeObj.$switchers[switchName]['$default'] = {
                    '$html': switchDefaultElement.innerHTML,
                    '$onSwitch': true
                }

            }
        },

        $on:(scopeObj,switchName,switchWhenDefName)=>{

            let getSwitchWhenDefElement = (switchName,switchWhenDefName) => {

                let switchableElement = document.querySelector('[xswitch="'+switchName+'"]');

                if (switchWhenDefName!=='$default') {
                    return switchableElement.querySelector('[xswitch-when="'+switchWhenDefName+'"]');
                }

                return switchableElement.querySelector('[xswitch-default]');

            }

            // Checking if such object exists
            if (typeof scopeObj.$switchers[switchName][switchWhenDefName] !== 'undefined') {

                let switchWhenDefObj = scopeObj.$switchers[switchName][switchWhenDefName];

                let elementSwitch = scopeObj.$switchers[switchName][switchWhenDefName];

                if (!switchWhenDefObj.$onSwitch) {

                    // Hides the current switched element
                    for (const [key, value] of Object.entries(scopeObj.$switchers[switchName])) {

                        if (key!==switchWhenDefName) {
                            getSwitchWhenDefElement(switchName,key).innerHTML = '';
                            value.$onSwitch = false;
                        }
                        else {

                            // Copies the current selected element
                            let tempValueHtml = value.$html;

                            let tempHtml = document.createElement('div');

                            tempHtml.innerHTML = value.$html;

                            // Renders the current selected element
                            this.$render(scopeObj,tempHtml);

                            while (tempHtml.childNodes.length > 0) {
                                getSwitchWhenDefElement(switchName,switchWhenDefName).appendChild(tempHtml.childNodes[0]);
                                value.$onSwitch = true;
                            }

                            value.$html = tempValueHtml;

                        }
                    }
                }
            }

        }

    }

}
