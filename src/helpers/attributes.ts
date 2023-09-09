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
export const STRAWBERRY_ID_ATTR = 'id'
export const REPEAT_REFERENCE_TOKEN = '$$index'

export class AttributeHelper {
    /**
     * Creates a component attribute with value. Example: `xcomponent="@ComponentName"`
     */
    static makeComponentXAttr(args:{name:string,appInstance:StrawberryApp}){
        return args.appInstance.getConfig().prefix + COMPONENT_ELEMENT_ATTR + '="@'+args.name+'"'
    }
    /**
     * Creates an attribute with any key. Example: `xsomekeyhere`
     */
    static makeXAttr(args:{attributeName:string,appInstance:StrawberryApp}){
        return args.appInstance.getConfig().prefix + args.attributeName
    }
    /**
     * Creates an attribute with any key, with any value. Example: `xsomekeyhere="value"`
     */
    static makeXAttrWithValue(args:{attributeName:string,appInstance:StrawberryApp,value:string}){
        return args.appInstance.getConfig().prefix + args.attributeName + '="'+ args.value +'"'
    }
    static getXValueFromElAttr(args:{element:Element,prefix:string,attributeName:string}){
        const resolvedAttrName = args.prefix + args.attributeName
        return args.element.getAttribute(resolvedAttrName)
    }
    static getElementByXId(args:{element:Element,appInstance:StrawberryApp,xid:string}){
        const resolvedXidAttr = args.appInstance.getConfig().prefix + STRAWBERRY_ID_ATTR + '="' + args.xid + '"'
        return args.element.querySelector(`[${resolvedXidAttr}]`)
    }
    static getElementByXAttribute(args:{element:Element,appInstance:StrawberryApp,attributeName:string}){
        const resolvedAttrName = this.makeXAttr({attributeName:args.attributeName,appInstance:args.appInstance})
        return args.element.querySelectorAll(`[${resolvedAttrName}]`)
    }
    static getXidsOfChildComponentByName(args:{element:Element,appInstance:StrawberryApp,componentObject:StrawberryComponent,childComponentName:string}):Array<string>{
        if (!args.childComponentName.includes('@')) args.childComponentName = '@'+args.childComponentName
        const resultXids = []
        // Making sure we are only getting direct siblings
        const childIds = args.componentObject.getChildIds()
        for (let i = 0; i < childIds.length; i++) {
            const childId = childIds[i];
            const xidAttr = this.makeXAttrWithValue({attributeName:STRAWBERRY_ID_ATTR,appInstance:args.appInstance,value:childId})
            const xidElement = args.element.querySelector(`[${xidAttr}]`)
            const componentName = xidElement.getAttribute(args.appInstance.getConfig().prefix + COMPONENT_ELEMENT_ATTR)
            if (componentName === args.childComponentName) {
                resultXids.push(childId)
            }
        }
        return resultXids
    }
}
