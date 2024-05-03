import { CLICK_EVENT_ATTR, CHANGE_EVENT_ATTR, TOUCH_EVENT_ATTR, __AttributeHelper } from "../helpers/attributes";
import { __isElementEventLocked, __lockElementEvent } from "../helpers/element.helpers";
import { __StrawberryComponent } from "../models/component";
import { __Resolver } from "../models/resolver";
import { ScopeObject } from "../models/scope";
import { __StrawberryApp } from "../models/strawberry";


export function __eventsHelper(targetElement:Element,componentObject:__StrawberryComponent,appInstance:__StrawberryApp):Promise<null>{
    return new Promise((resolve,reject)=>{
        try {

            /**
             * This function adds event listener to elements which is bound to a function
             * within the component scope
             */
            const __addEvent=function(scopeObject:ScopeObject,eventElement:Element,fnExpression:string,eventType:string){
                if (new __Resolver().__getResolveType(fnExpression)!=='function') return;
                eventElement.addEventListener(eventType,()=>{
                    new __Resolver().__resolveExpression(scopeObject,fnExpression,eventElement)
                })
            }

            const events = [
                {type: 'click',attr: CLICK_EVENT_ATTR},
                {type: 'change',attr: CHANGE_EVENT_ATTR},
                {type: 'keyup',attr: TOUCH_EVENT_ATTR}
            ]

            for (let i = 0; i < events.length; i++) {
                const event = events[i]
                const allEventElements = __AttributeHelper.__getElementByXAttribute(
                    targetElement,
                    appInstance,
                    event.attr
                )
                for (let k = 0; k < allEventElements.length; k++) {
                    const element = allEventElements[k]
                    const fnExpression = __AttributeHelper.__getXValueFromElAttr(
                        element,
                        appInstance.__getConfiguration().prefix,
                        event.attr
                    )
                    if (__isElementEventLocked(element,event.type,appInstance)) continue 
                    const scopeObject = componentObject.__getScopeObject()
                    if (scopeObject===null||fnExpression==null) continue
                    __addEvent(componentObject.__getScopeObject(),element,fnExpression,event.type)
                    __lockElementEvent(element,event.type,appInstance)
                }
            }

            resolve(null)

        } catch (error) {
            reject(null)
        }
    })
}