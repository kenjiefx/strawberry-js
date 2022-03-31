$lock(element){
    element.setAttribute('xset','scope');
}

$isLocked(element){
    if (element.getAttribute('xset')===null) {
        return false;
    }
    return true;
}

$isEventLocked(element,eventName){
    let result = false;
    let eventsAdded = element.getAttribute('xevent');
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
    let eventsAdded = element.getAttribute('xevent');
    if (eventsAdded===null) {
        element.setAttribute('xevent',eventName);
        return;
    }
    let allEvents = eventsAdded.split(',');
    for (var i = 0; i < allEvents.length; i++) {
        if (eventName!==allEvents[i]) {
            allEvents.push(eventName);
        }
    }
    element.setAttribute('xevent',allEvents.join(','));
}
