import { __StrawberryComponent } from "../models/component"
import { __StrawberryApp } from "../models/strawberry"


export const STRAWBERRY_ATTRIBUTE = 'strawberry'
export const SERVICE_OBJECT = 'service_object'
export const FACTORY_OBJECT = 'factory_object'
export const COMPONENT_OBJECT = 'component_object'
export const COMPONENT_ELEMENT_ATTR = 'component'
export const REPEAT_ELEMENT_ATTR = 'repeat'
export const IF_ELEMENT_ATTR = 'if'
export const HIDE_ELEMENT_ATTR = 'hide'
export const SHOW_ELEMENT_ATTR = 'show'
export const CHECK_ELEMENT_ATTR = 'check'
export const STYLE_ELEMENT_ATTR = 'style'
export const MODEL_ELEMENT_ATTR = 'model'
export const DISABLE_ELEMENT_ATTR = 'disable'
export const ENABLE_ELEMENT_ATTR = 'enable'
export const CLICK_EVENT_ATTR = 'click'
export const CHANGE_EVENT_ATTR = 'change'
export const TOUCH_EVENT_ATTR = 'touch'
export const BLOCK_ELEMENT_ATTR = 'block'
export const SCOPE_ARGUMENT_KEY = '$scope'
export const BLOCK_ARGUMENT_KEY = '$block'
export const ENABLE_ARGUMENT_KEY = '$enable'
export const DISABLE_ARGUMENT_KEY = '$disable'
export const PARENT_ARGUMENT_KEY = '$parent'
export const CHILDREN_ARGUMENT_KEY = '$children'
export const PATCH_ARGUMENT_KEY = '$patch'
export const APP_ARGUMENT_KEY = '$app'
export const STRAWBERRY_ID_ATTR = 'id'
export const REPEAT_REFERENCE_TOKEN = '$$index'
export const LOCK_ID_ATTR_KEY = 'set'
export const LOCK_ID_ATTR_VALUE = '@'
export const EVENT_ELEMENT_ATTR = 'event'
export const ELEMENT_REFERENCE_ATTR = 'rid'

export class __AttributeHelper {
    /**
     * Creates a component attribute with value. Example: `xcomponent="@ComponentName"`
     */
    static __makeComponentXAttr( name:string, appInstance:__StrawberryApp){
        return appInstance.__getConfiguration().prefix + COMPONENT_ELEMENT_ATTR + '="@'+name+'"'
    }
    /**
     * Creates an attribute with any key. Example: `xsomekeyhere`
     */
    static __makeXAttr(attributeName:string,appInstance:__StrawberryApp){
        return appInstance.__getConfiguration().prefix + attributeName
    }
    /**
     * Creates an attribute with any key, with any value. Example: `xsomekeyhere="value"`
     */
    static __makeXAttrWithValue(attributeName:string,appInstance:__StrawberryApp,value:string){
        return appInstance.__getConfiguration().prefix + attributeName + '="'+ value +'"'
    }

    static __getXValueFromElAttr(element:Element,prefix:string,attributeName:string){
        const resolvedAttrName = prefix + attributeName
        return element.getAttribute(resolvedAttrName)
    }

    static __getElementByXId(element:Element,appInstance:__StrawberryApp,xid:string){
        const resolvedXidAttr = appInstance.__getConfiguration().prefix + STRAWBERRY_ID_ATTR + '="' + xid + '"'
        return element.querySelector(`[${resolvedXidAttr}]`)
    }

    static __getElementByXAttribute(element:Element,appInstance:__StrawberryApp,attributeName:string){
        const resolvedAttrName = this.__makeXAttr(attributeName,appInstance)
        return element.querySelectorAll(`[${resolvedAttrName}]`)
    }
    
    static __getXidsOfChildComponentByName(element:Element,appInstance:__StrawberryApp,componentObject:__StrawberryComponent,childComponentName:string):Array<string>{
        if (!childComponentName.includes('@')) childComponentName = '@'+childComponentName
        const resultXids:Array<string> = []
        // Making sure we are only getting direct siblings
        const childIds = componentObject.__getChildIds()
        for (let i = 0; i < childIds.length; i++) {
            const childId = childIds[i];
            const xidAttr = this.__makeXAttrWithValue(STRAWBERRY_ID_ATTR,appInstance,childId)
            const xidElement = element.querySelector(`[${xidAttr}]`)
            if (xidElement===null) continue 
            const componentName = xidElement.getAttribute(appInstance.__getConfiguration().prefix + COMPONENT_ELEMENT_ATTR)
            if (componentName === childComponentName) {
                resultXids.push(childId)
            }
        }
        return resultXids
    }
}