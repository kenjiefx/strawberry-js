import { __StrawberryComponent } from "../models/component"
import { __StrawberryApp } from "../models/strawberry"
import { EVENT_ELEMENT_ATTR, LOCK_ID_ATTR_KEY, LOCK_ID_ATTR_VALUE, STRAWBERRY_ATTRIBUTE, STRAWBERRY_ID_ATTR, __AttributeHelper } from "./attributes"


export function __cleanChildComponents(component:Element,childComponentIds:Array<string>,appInstance:__StrawberryApp){
    for (let i = 0; i < childComponentIds.length; i++) {
        const childComponentId = childComponentIds[i]
        const element = __AttributeHelper.__getElementByXId(
            component,
            appInstance,
            childComponentId
        )
        if (element!==null) {
            element.innerHTML = ''
        }
    }
}

export function __createTemporaryElement(){
    return document.implementation.createHTMLDocument().body
}

export function __copyBindElement(bindFrom:Element,bindTo:Element) {
    if (bindFrom===null) return 
    while (bindFrom.childNodes.length > 0) {
        bindTo.appendChild(bindFrom.childNodes[0])
    }
}


export function __scopeBindElement(bindFromEl:Element,bindToEl:Element,appInstance:__StrawberryApp,childComponentIds:Array<string>){
    const temporaryChildren = {}
    for (let i = 0; i < childComponentIds.length; i++) {
        const childComponentId      = childComponentIds[i]
        const childTemporaryElement = __createTemporaryElement()
        const childActualComponent  = __AttributeHelper.__getElementByXId(
            bindToEl,
            appInstance,
            childComponentId
        )
        if (childActualComponent!==null) {
            __copyBindElement(
                childActualComponent,
                childTemporaryElement
            )
            temporaryChildren[childComponentId] = childTemporaryElement
        }
    }
    bindToEl.innerHTML = ''
    __copyBindElement(
        bindFromEl,
        bindToEl
    )
    for (const childComponentId in temporaryChildren) {
        const childActualComponent = __AttributeHelper.__getElementByXId(
            bindToEl,
            appInstance,
            childComponentId
        )
        if (childActualComponent===null) continue
        __copyBindElement(
            temporaryChildren[childComponentId],
            childActualComponent
        )
    }

}


export function __disposeElement(element:Element,comment:string){
    if (null!==element) {
        element.innerHTML = '';
        if (element.parentNode !== null) {
            element.outerHTML  = '<!-- strawberry.js: '+element.outerHTML+' | '+comment+' -->';
        }
    }
}


export function __lockElement(element:Element,appInstance:__StrawberryApp){
    const lockAttrName = __AttributeHelper.__makeXAttr(LOCK_ID_ATTR_KEY,appInstance)
    element.setAttribute(lockAttrName,LOCK_ID_ATTR_VALUE)
}

export function __isElementLocked(element:Element,appInstance:__StrawberryApp){
    const lockAttrName = __AttributeHelper.__makeXAttr(LOCK_ID_ATTR_KEY,appInstance)
    return (element.getAttribute(lockAttrName)!==null)
}


export function __isElementEventLocked(element:Element,eventName:string,appInstance:__StrawberryApp){
    const lockAttrName = __AttributeHelper.__makeXAttr(EVENT_ELEMENT_ATTR,appInstance)
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

export function __lockElementEvent(element:Element,eventName:string,appInstance:__StrawberryApp){
    const lockAttrName = __AttributeHelper.__makeXAttr(EVENT_ELEMENT_ATTR,appInstance)
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

export function __getLiveAppElement(appInstance:__StrawberryApp):Element{
    const xAppElements = __AttributeHelper.__getElementByXAttribute(
        document.body,
        appInstance,
        STRAWBERRY_ATTRIBUTE
    )
    let appElement:Element | null = null
    for (let i = 0; i < xAppElements.length; i++) {
        const element = xAppElements[i]
        if (element.tagName!=='TEMPLATE') {
            appElement = element
        }
    }
    if (appElement===null) {
        throw new Error(`strawberry.js no live app element found for ${appInstance.__getAppName()}`)
    }
    return appElement
}


export function __selectElementsButNotChildOfComponent(
    attributeWithValue:string,
    componentObject:__StrawberryComponent,
    appInstance: __StrawberryApp
    ): NodeListOf<Element> | null{
    const componentChildIds = componentObject.__getChildIds()
    let selector = ''
    for (let i = 0; i < componentChildIds.length; i++) {
        const childId = componentChildIds[i]
        const childXidAttrName = __AttributeHelper.__makeXAttrWithValue(
            STRAWBERRY_ID_ATTR,
            appInstance,
            childId
        )
        selector += ':not(['+childXidAttrName+'])'
    }
    selector += ` > [${attributeWithValue}]`
    if (componentChildIds.length===0) {
        const xidAttrName = __AttributeHelper.__makeXAttrWithValue(STRAWBERRY_ID_ATTR, appInstance, componentObject.__getId());
        selector = `[${xidAttrName}] [${attributeWithValue}]`
    }
    const componentElement = __AttributeHelper.__getElementByXId(
        __getLiveAppElement(appInstance),
        appInstance,
        componentObject.__getId()
    )
    if (componentElement===null) return null
    return componentElement.querySelectorAll(selector)
}

export function __getLiveComponentAsTemplate(componentObject:__StrawberryComponent,appInstance:__StrawberryApp){
    const temporaryElement = __createTemporaryElement()
    const componentElement = __AttributeHelper.__getElementByXId(
        __getLiveAppElement(appInstance),
        appInstance,
        componentObject.__getId()
    )
    if (componentElement===null) return null 
    temporaryElement.innerHTML = componentElement.innerHTML 
    const componentChildIds = componentObject.__getChildIds()
    for (let i = 0; i < componentChildIds.length; i++) {
        const componentChildId = componentChildIds[i]
        const childComponentElement = __AttributeHelper.__getElementByXId(
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
