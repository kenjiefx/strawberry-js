$lock(element){
    let lockAttrName = App.prefix+'set';
    element.setAttribute(lockAttrName,'scope');
}

$isLocked(element){
    let lockAttrName = App.prefix+'set';
    if (element.getAttribute(lockAttrName)===null)
        return false;
    return true;
}

$isEventLocked(element,eventName){
    let lockAttrName = App.prefix+'event';
    let result = false;
    let eventsAdded = element.getAttribute(lockAttrName);
    if (eventsAdded===null) return false;
    let allEvents = eventsAdded.split(',');
    for (var i = 0; i < allEvents.length; i++) {
        if (eventName===allEvents[i]) {
            result = true;
        }
    }
    return result;
}

$lockEvent(element,eventName){
    let lockAttrName = App.prefix+'event';
    let eventsAdded = element.getAttribute(lockAttrName);
    if (eventsAdded===null) {
        element.setAttribute(lockAttrName,eventName);
        return;
    }
    let allEvents = eventsAdded.split(',');
    for (var i = 0; i < allEvents.length; i++) {
        if (eventName!==allEvents[i]) {
            allEvents.push(eventName);
        }
    }
    element.setAttribute(lockAttrName,allEvents.join(','));
}
