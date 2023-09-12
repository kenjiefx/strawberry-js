import { StrawberryComponent } from "../models/component"
import { StrawberryApp } from "../models/strawberry.app"

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
export const PATCH_ARGUMENT_KEY = '$patch'
export const STRAWBERRY_ID_ATTR = 'id'
export const REPEAT_REFERENCE_TOKEN = '$$index'
export const LOCK_ID_ATTR_KEY = 'set'
export const LOCK_ID_ATTR_VALUE = '@'
export const EVENT_ELEMENT_ATTR = 'event'

export class AttributeHelper {
    /**
     * Creates a component attribute with value. Example: `xcomponent="@ComponentName"`
     */
    static makeComponentXAttr(name:string,appInstance:StrawberryApp){
        return appInstance.getConfig().prefix + COMPONENT_ELEMENT_ATTR + '="@'+name+'"'
    }
    /**
     * Creates an attribute with any key. Example: `xsomekeyhere`
     */
    static makeXAttr(attributeName:string,appInstance:StrawberryApp){
        return appInstance.getConfig().prefix + attributeName
    }
    /**
     * Creates an attribute with any key, with any value. Example: `xsomekeyhere="value"`
     */
    static makeXAttrWithValue(attributeName:string,appInstance:StrawberryApp,value:string){
        return appInstance.getConfig().prefix + attributeName + '="'+ value +'"'
    }
    static getXValueFromElAttr(element:Element,prefix:string,attributeName:string){
        const resolvedAttrName = prefix + attributeName
        return element.getAttribute(resolvedAttrName)
    }
    static getElementByXId(element:Element,appInstance:StrawberryApp,xid:string){
        const resolvedXidAttr = appInstance.getConfig().prefix + STRAWBERRY_ID_ATTR + '="' + xid + '"'
        return element.querySelector(`[${resolvedXidAttr}]`)
    }
    static getElementByXAttribute(element:Element,appInstance:StrawberryApp,attributeName:string){
        const resolvedAttrName = this.makeXAttr(attributeName,appInstance)
        return element.querySelectorAll(`[${resolvedAttrName}]`)
    }
    static getXidsOfChildComponentByName(element:Element,appInstance:StrawberryApp,componentObject:StrawberryComponent,childComponentName:string):Array<string>{
        if (!childComponentName.includes('@')) childComponentName = '@'+childComponentName
        const resultXids = []
        // Making sure we are only getting direct siblings
        const childIds = componentObject.getChildIds()
        for (let i = 0; i < childIds.length; i++) {
            const childId = childIds[i];
            const xidAttr = this.makeXAttrWithValue(STRAWBERRY_ID_ATTR,appInstance,childId)
            const xidElement = element.querySelector(`[${xidAttr}]`)
            const componentName = xidElement.getAttribute(appInstance.getConfig().prefix + COMPONENT_ELEMENT_ATTR)
            if (componentName === childComponentName) {
                resultXids.push(childId)
            }
        }
        return resultXids
    }
}
