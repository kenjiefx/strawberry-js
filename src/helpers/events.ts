import { StrawberryComponent } from "../models/component";
import { Resolver } from "../models/resolver";
import { ScopeObject } from "../models/scope";
import { StrawberryApp } from "../models/strawberry.app";
import { CLICK_EVENT_ATTR, CHANGE_EVENT_ATTR, TOUCH_EVENT_ATTR, AttributeHelper } from "./attributes";
import { isElementEventLocked, lockElementEvent } from "./element.helpers";

export function eventsHelper(targetElement:Element,componentObject:StrawberryComponent,appInstance:StrawberryApp):Promise<null>{
    return new Promise((resolve,reject)=>{
        try {

            /**
             * This function adds event listener to elements which is bound to a function
             * within the component scope
             */
            const addEvent=function(scopeObject:ScopeObject,eventElement:Element,fnExpression:string,eventType:string){
                if (new Resolver().getResolveType(fnExpression)!=='function') return;
                eventElement.addEventListener(eventType,()=>{
                    new Resolver().expression(scopeObject,fnExpression,eventElement)
                })
            }

            const events = [
                {type: 'click',attr: CLICK_EVENT_ATTR},
                {type: 'change',attr: CHANGE_EVENT_ATTR},
                {type: 'keyup',attr: TOUCH_EVENT_ATTR}
            ]

            for (let i = 0; i < events.length; i++) {
                const event = events[i]
                const allEventElements = AttributeHelper.getElementByXAttribute(
                    targetElement,
                    appInstance,
                    event.attr
                )
                for (let k = 0; k < allEventElements.length; k++) {
                    const element = allEventElements[k]
                    const fnExpression = AttributeHelper.getXValueFromElAttr(
                        element,
                        appInstance.getConfig().prefix,
                        event.attr
                    )
                    if (isElementEventLocked(element,event.type,appInstance)) continue 
                    addEvent(componentObject.getScopeObject(),element,fnExpression,event.type)
                    lockElementEvent(element,event.type,appInstance)
                }
            }

            resolve(null)

        } catch (error) {
            reject(null)
        }
    })
}