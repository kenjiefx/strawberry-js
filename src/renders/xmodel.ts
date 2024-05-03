import { __AttributeHelper, MODEL_ELEMENT_ATTR } from "../helpers/attributes";
import { __StrawberryComponent } from "../models/component";
import { __Resolver } from "../models/resolver";
import { ScopeObject } from "../models/scope";
import { __StrawberryApp } from "../models/strawberry";


export function __modelsHelpers(targetElement:Element,componentObject:__StrawberryComponent,appInstance:__StrawberryApp):Promise<null>{
    return new Promise((resolve,reject)=>{
        try {
            /**
             * This function attemps to add an undefined model as part of the scope.
             * For example, if you assign `xmodel="user.firstName"`, but firstName
             * is not defined in $scope.user, then this function will add firstName
             * as member property of $scope.user automatically
             */
            const __assignModelValue=(scopeObject:ScopeObject,modelExpression:string,modelValue:number|string|boolean|{[key:string]:any}|(()=>unknown))=>{
                const parentObj = new __Resolver().__getParentObjAsObject(scopeObject,modelExpression)
                const childObjExpression = new __Resolver().__getChildObjectExp(modelExpression);
                if (undefined!==parentObj) parentObj[childObjExpression] = modelValue
            }

            const __assignModelState=(modelElement:Element,modelState:boolean)=>{
                (typeof modelState == 'boolean' && modelState) ?
                    modelElement.setAttribute('checked','') :
                    modelElement.removeAttribute('checked')
            }

            const allModelElements = __AttributeHelper.__getElementByXAttribute(
                targetElement,
                appInstance,
                MODEL_ELEMENT_ATTR
            )
            
            for (let i = 0; i < allModelElements.length; i++) {
                const element = allModelElements[i]
                if (element===null) continue
                const argument = __AttributeHelper.__getXValueFromElAttr(
                    element,
                    appInstance.__getConfiguration().prefix,
                    MODEL_ELEMENT_ATTR
                )

                const myScopeObject = componentObject.__getScopeObject()
                if (myScopeObject===null||argument===null) continue


                const evaluated = new __Resolver().__resolveExpression(myScopeObject,argument)
                let isValueStringType = true

                if (element.tagName==='INPUT'||element.tagName==='SELECT') {
                    if ((element instanceof HTMLInputElement)) {
                        const elementType = element.type
                        if (elementType==='radio'||elementType==='checkbox') {
                            isValueStringType = false;
                            (evaluated===undefined) ? 
                                __assignModelValue(myScopeObject,argument,false):
                                __assignModelState(element,evaluated)
                        }
                        if (elementType==='text'||elementType==='password'||element.type==='email') {
                            (evaluated===undefined) ?
                                __assignModelValue(myScopeObject,argument,element.value) :
                                element.value = evaluated
                        }
                        if (elementType==='date') {
                            /** When evaluated is undefined, we will assign Date today */
                            let inputDate = new Date(Date.now())
                            if (evaluated!==undefined) {
                                if (!(evaluated instanceof Date)) {
                                    throw new Error(`strawberry.js: [RenderError] Models assigned to Date and/or Time elements must be instance of Date object`)
                                }
                                inputDate = evaluated
                            } else {
                                __assignModelValue(myScopeObject,argument,inputDate)
                            }
                            const numMonth = (inputDate.getMonth()+1)
                            const month = (numMonth<10) ? '0'+numMonth : numMonth
                            const elementValue = inputDate.getFullYear()+'-'+month+'-'+inputDate.getDate()
                            element.value = elementValue
                        }
                        if (elementType==='time') {
                            /** When evaluated is undefined, we will assign Date today */
                            let inputDate = new Date(Date.now())
                            if (evaluated!==undefined) {
                                if (!(evaluated instanceof Date)) {
                                    throw new Error(`strawberry.js: [RenderError] Models assigned to Date and/or Time elements must be instance of Date object`)
                                }
                                inputDate = evaluated
                            } else {
                                __assignModelValue(myScopeObject,argument,inputDate)
                            }
                            const hours = (inputDate.getHours()<10) ? '0'+inputDate.getHours() : inputDate.getHours()
                            const minutes = (inputDate.getMinutes()<10) ? '0'+inputDate.getMinutes() : inputDate.getMinutes()
                            const elementValue = hours+':'+minutes
                            element.value = elementValue
                        }
                    } 
                    if ((element instanceof HTMLSelectElement)) {
                        (evaluated===undefined) ?
                            __assignModelValue(myScopeObject,argument,element.value) :
                                element.value = evaluated
                    }
                    element.addEventListener('change',(event)=>{
                        const target = event.target
                        if (target instanceof HTMLInputElement) {
                            if (target.type==='date') {
                                const newevaluated = new __Resolver().__resolveExpression(myScopeObject,argument)
                                const [syear,smonth,sdate] = target.value.split('-')
                                const year = parseInt(syear)
                                const month = parseInt(smonth) - 1
                                const date = parseInt(sdate)
                                if (!(newevaluated instanceof Date)) {
                                    throw new Error(`strawberry.js: [RenderError] Models assigned to Date and/or Time elements must be instance of Date object`)
                                }
                                newevaluated.setFullYear(year)
                                newevaluated.setMonth(month)
                                newevaluated.setDate(date)
                                __assignModelValue(
                                    myScopeObject,
                                    argument,
                                    newevaluated
                                )
                                return 
                            }
                            if (target.type==='time') {
                                const newevaluated = new __Resolver().__resolveExpression(myScopeObject,argument)
                                const [shour,sminute] = target.value.split(':')
                                const hour = parseInt(shour)
                                const minute = parseInt(sminute)
                                if (!(newevaluated instanceof Date)) {
                                    throw new Error(`strawberry.js: [RenderError] Models assigned to Date and/or Time elements must be instance of Date object`)
                                }
                                newevaluated.setHours(hour)
                                newevaluated.setMinutes(minute)
                                __assignModelValue(
                                    myScopeObject,
                                    argument,
                                    newevaluated
                                )
                                return
                            }
                            __assignModelValue(
                                myScopeObject,
                                argument,
                                (isValueStringType) ? target.value : target.checked
                            )
                        } 
                        if (target instanceof HTMLSelectElement) {
                            __assignModelValue(
                                myScopeObject,
                                argument,
                                target.value
                            )
                        }
                    })
                }

                if (element.tagName==='TEXTAREA'&&(element instanceof HTMLTextAreaElement)) {
                    (evaluated===undefined) ?
                        __assignModelValue(myScopeObject,argument,element.value) :
                        element.value = evaluated
                        
                    element.addEventListener('change',()=>{
                        __assignModelValue(
                            myScopeObject,
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