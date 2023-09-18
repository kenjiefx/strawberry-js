import { StrawberryComponent } from "../models/component"
import { StrawberryApp } from "../models/strawberry.app"
import { AttributeHelper, EVENT_ELEMENT_ATTR, LOCK_ID_ATTR_KEY, LOCK_ID_ATTR_VALUE, STRAWBERRY_ATTRIBUTE, STRAWBERRY_ID_ATTR } from "./attributes"
import { getAppInstances } from "./boot.helper"

export function cleanChildComponents(component:Element,childComponentIds:Array<string>,appInstance:StrawberryApp){
    for (let i = 0; i < childComponentIds.length; i++) {
        const childComponentId = childComponentIds[i]
        AttributeHelper.getElementByXId(
            component,
            appInstance,
            childComponentId
        ).innerHTML = ''
    }
}

export function createTemporaryElement(){
    return document.implementation.createHTMLDocument().body
}

export function copyBindElement(bindFrom:Element,bindTo:Element) {
    if (bindFrom===null) return 
    while (bindFrom.childNodes.length > 0) {
        bindTo.appendChild(bindFrom.childNodes[0])
    }
}


export function scopeBindElement(bindFromEl:Element,bindToEl:Element,appInstance:StrawberryApp,childComponentIds:Array<string>){
    const temporaryChildren = {}
    for (let i = 0; i < childComponentIds.length; i++) {
        const childComponentId      = childComponentIds[i]
        const childTemporaryElement = createTemporaryElement()
        const childActualComponent  = AttributeHelper.getElementByXId(
            bindToEl,
            appInstance,
            childComponentId
        )
        if (childActualComponent!==null) {
            copyBindElement(
                childActualComponent,
                childTemporaryElement
            )
            temporaryChildren[childComponentId] = childTemporaryElement
        }
    }
    bindToEl.innerHTML = ''
    copyBindElement(
        bindFromEl,
        bindToEl
    )
    for (const childComponentId in temporaryChildren) {
        const childActualComponent = AttributeHelper.getElementByXId(
            bindToEl,
            appInstance,
            childComponentId
        )
        if (childActualComponent===null) continue
        copyBindElement(
            temporaryChildren[childComponentId],
            childActualComponent
        )
    }

}


export function disposeElement(element:Element,comment:string){
    if (null!==element) {
        element.innerHTML = '';
        element.outerHTML  = '<!-- strawberry.js: '+element.outerHTML+' | '+comment+' -->';
    }
}


export function lockElement(element:Element,appInstance:StrawberryApp){
    const lockAttrName = AttributeHelper.makeXAttr(LOCK_ID_ATTR_KEY,appInstance)
    element.setAttribute(lockAttrName,LOCK_ID_ATTR_VALUE)
}

export function isElementLocked(element:Element,appInstance:StrawberryApp){
    const lockAttrName = AttributeHelper.makeXAttr(LOCK_ID_ATTR_KEY,appInstance)
    return (element.getAttribute(lockAttrName)!==null)
}


export function isElementEventLocked(element:Element,eventName:string,appInstance:StrawberryApp){
    const lockAttrName = AttributeHelper.makeXAttr(EVENT_ELEMENT_ATTR,appInstance)
    let result = false
    const eventsAdded = element.getAttribute(lockAttrName)
    if (eventsAdded===null) return false
    const allEvents = eventsAdded.split(',')
    for (var i = 0; i < allEvents.length; i++) {
        if (eventName===allEvents[i]) {
            result = true
        }
    }
    return result
}

export function lockElementEvent(element:Element,eventName:string,appInstance:StrawberryApp){
    const lockAttrName = AttributeHelper.makeXAttr(EVENT_ELEMENT_ATTR,appInstance)
    const eventsAdded = element.getAttribute(lockAttrName)
    if (eventsAdded===null) {
        element.setAttribute(lockAttrName,eventName)
        return
    }
    let allEvents = eventsAdded.split(',')
    for (var i = 0; i < allEvents.length; i++) {
        if (eventName!==allEvents[i]) {
            allEvents.push(eventName)
        }
    }
    element.setAttribute(lockAttrName,allEvents.join(','))
}

export function getLiveAppElement(appInstance:StrawberryApp):Element{
    const xAppElements = AttributeHelper.getElementByXAttribute(
        document.body,
        appInstance,
        STRAWBERRY_ATTRIBUTE
    )
    let appElement:Element
    for (let i = 0; i < xAppElements.length; i++) {
        const element = xAppElements[i]
        if (element.tagName!=='TEMPLATE') {
            appElement = element
        }
    }
    return appElement
}


export function selectElementsButNotChildOfComponent(attributeWithValue:string,componentObject:StrawberryComponent,appInstance:StrawberryApp){
    const componentChildIds = componentObject._getChildIds()
    let selector = ''
    for (let i = 0; i < componentChildIds.length; i++) {
        const childId = componentChildIds[i]
        const childXidAttrName = AttributeHelper.makeXAttrWithValue(
            STRAWBERRY_ID_ATTR,
            appInstance,
            childId
        )
        selector += ':not(['+childXidAttrName+'])'
    }
    selector += ` > [${attributeWithValue}]`
    if (componentChildIds.length===0) {
        const xidAttrName = AttributeHelper.makeXAttrWithValue(STRAWBERRY_ID_ATTR, appInstance, componentObject._getComponentId());
        selector = `[${xidAttrName}] [${attributeWithValue}]`
    }
    const componentElement = AttributeHelper.getElementByXId(
        getLiveAppElement(appInstance),
        appInstance,
        componentObject._getComponentId()
    )
    return componentElement.querySelectorAll(selector)
}

export function getLiveComponentAsTemplate(componentObject:StrawberryComponent,appInstance:StrawberryApp){
    const temporaryElement = createTemporaryElement()
    const componentElement = AttributeHelper.getElementByXId(
        getLiveAppElement(appInstance),
        appInstance,
        componentObject._getComponentId()
    )
    if (componentElement===null) return null 
    temporaryElement.innerHTML = componentElement.innerHTML 
    const componentChildIds = componentObject._getChildIds()
    for (let i = 0; i < componentChildIds.length; i++) {
        const componentChildId = componentChildIds[i]
        const childComponentElement = AttributeHelper.getElementByXId(
            temporaryElement,
            appInstance,
            componentChildId
        )
        if (childComponentElement!==null) {
            childComponentElement.innerHTML = ''
        }
    }
    return temporaryElement.innerHTML
}

