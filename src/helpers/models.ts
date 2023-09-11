import { StrawberryComponent } from "../models/component";
import { Resolver } from "../models/resolver";
import { ScopeObject } from "../models/scope";
import { StrawberryApp } from "../models/strawberry.app";
import { AttributeHelper, MODEL_ELEMENT_ATTR } from "./attributes";

export function modelsHelpers(targetElement:Element,componentObject:StrawberryComponent,appInstance:StrawberryApp):Promise<null>{
    return new Promise((resolve,reject)=>{
        try {
            /**
             * This function attemps to add an undefined model as part of the scope.
             * For example, if you assign `xmodel="user.firstName"`, but firstName
             * is not defined in $scope.user, then this function will add firstName
             * as member property of $scope.user automatically
             */
            const assignValue=(scopeObject:ScopeObject,modelExpression:string,modelValue:string|boolean|{[key:string]:any}|(()=>unknown))=>{
                const parentObj = new Resolver().getParentObj(scopeObject,modelExpression)
                const childObjExpression = new Resolver().getChildObjectExp(modelExpression);
                if (undefined!==parentObj) parentObj[childObjExpression] = modelValue
            }

            const assignState=(modelElement:Element,modelState:boolean)=>{
                (typeof modelState == 'boolean' && modelState) ?
                    modelElement.setAttribute('checked','') :
                    modelElement.removeAttribute('checked')
            }

            const allModelElements = AttributeHelper.getElementByXAttribute(
                targetElement,
                appInstance,
                MODEL_ELEMENT_ATTR
            )
            
            for (let i = 0; i < allModelElements.length; i++) {
                const element = allModelElements[i]
                if (element===null) continue
                const argument = AttributeHelper.getXValueFromElAttr(
                    element,
                    appInstance.getConfig().prefix,
                    MODEL_ELEMENT_ATTR
                )
                const evaluated = new Resolver().expression(componentObject.getScopeObject(),argument)
                let isValueStringType = true

                if (element.tagName==='INPUT'||element.tagName==='SELECT') {
                    if ((element instanceof HTMLInputElement)) {
                        const elementType = element.type
                        if (elementType==='radio'||elementType==='checkbox') {
                            isValueStringType = false;
                            (evaluated===undefined) ? 
                                assignValue(componentObject.getScopeObject(),argument,false):
                                assignState(element,evaluated)
                        }
                        if (elementType==='text') {
                            (evaluated===undefined) ?
                                assignValue(componentObject.getScopeObject(),argument,element.value) :
                                element.value = evaluated
                        }
                    } 
                    if ((element instanceof HTMLSelectElement)) {
                        (evaluated===undefined) ?
                                assignValue(componentObject.getScopeObject(),argument,element.value) :
                                element.value = evaluated
                    }
                    element.addEventListener('change',()=>{
                        if (element instanceof HTMLInputElement) {
                            assignValue(
                                componentObject.getScopeObject(),
                                argument,
                                (isValueStringType) ? element.value : element.checked
                            )
                        } 
                        if (element instanceof HTMLSelectElement) {
                            assignValue(
                                componentObject.getScopeObject(),
                                argument,
                                element.value
                            )
                        }
                    })
                }

                if (element.tagName==='TEXTAREA'&&(element instanceof HTMLTextAreaElement)) {
                    (evaluated===undefined) ?
                        assignValue(componentObject.getScopeObject(),argument,element.value) :
                        element.value = evaluated
                        
                    element.addEventListener('change',()=>{
                        assignValue(
                            componentObject.getScopeObject(),
                            argument,
                            element.value
                        );
                    });
                }
            }

            resolve(null)

        } catch (error) {
            reject(error)
        }
    })
}