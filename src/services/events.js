$events(renderObj,renderElement){

    /**
     * This function adds event listener to elements which is bound to a function
     * within the component scope
     */
    let add_event=function(renderObj,eventElement,fnExpression,eventType){
        if (strawberry.$resolver().getResolveType(fnExpression)!=='function') return;
        eventElement.addEventListener(eventType,()=>{
            strawberry.$resolver().expression(renderObj.export(),fnExpression,eventElement);
        });
    }

    const Events = [
        {type: 'click',attr: CLICK_EVENT_ATTR},
        {type: 'change',attr: CHANGE_EVENT_ATTR},
        {type: 'keyup',attr: TOUCH_EVENT_ATTR}
    ];

    for (var i = 0; i < Events.length; i++) {
        let Event = Events[i];
        // Finds all elements
        let allElements = strawberry.$getElementsFrom(renderElement,Event.attr);
        // Looping through each of the elements
        for (var k = 0; k< allElements.length; k++) {
            let element = allElements[k];
            let fnExpression = strawberry.$getXValue(element,Event.attr);
            if (this.$isEventLocked(element,Event.type)) continue;
            add_event(renderObj,element,fnExpression,Event.type);
            this.$lockEvent(element,Event.type);
        }

    }

}
