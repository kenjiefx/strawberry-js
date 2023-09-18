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
            const _assignModelValue=(scopeObject:ScopeObject,modelExpression:string,modelValue:number|string|boolean|{[key:string]:any}|(()=>unknown))=>{
                const parentObj = new Resolver()._getParentObjAsObject(scopeObject,modelExpression)
                const childObjExpression = new Resolver()._getChildObjectExp(modelExpression);
                if (undefined!==parentObj) parentObj[childObjExpression] = modelValue
            }

            const _assignModelState=(modelElement:Element,modelState:boolean)=>{
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
                    appInstance._getAppConfig().prefix,
                    MODEL_ELEMENT_ATTR
                )
                const evaluated = new Resolver()._resolveExpression(componentObject._getScopeObject(),argument)
                let isValueStringType = true

                if (element.tagName==='INPUT'||element.tagName==='SELECT') {
                    if ((element instanceof HTMLInputElement)) {
                        const elementType = element.type
                        if (elementType==='radio'||elementType==='checkbox') {
                            isValueStringType = false;
                            (evaluated===undefined) ? 
                                _assignModelValue(componentObject._getScopeObject(),argument,false):
                                _assignModelState(element,evaluated)
                        }
                        if (elementType==='text') {
                            (evaluated===undefined) ?
                                _assignModelValue(componentObject._getScopeObject(),argument,element.value) :
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
                                _assignModelValue(componentObject._getScopeObject(),argument,inputDate)
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
                                _assignModelValue(componentObject._getScopeObject(),argument,inputDate)
                            }
                            const hours = (inputDate.getHours()<10) ? '0'+inputDate.getHours() : inputDate.getHours()
                            const minutes = (inputDate.getMinutes()<10) ? '0'+inputDate.getMinutes() : inputDate.getMinutes()
                            const elementValue = hours+':'+minutes
                            element.value = elementValue
                        }
                    } 
                    if ((element instanceof HTMLSelectElement)) {
                        (evaluated===undefined) ?
                            _assignModelValue(componentObject._getScopeObject(),argument,element.value) :
                                element.value = evaluated
                    }
                    element.addEventListener('change',(event)=>{
                        const target = event.target
                        if (target instanceof HTMLInputElement) {
                            if (target.type==='date') {
                                const newevaluated = new Resolver()._resolveExpression(componentObject._getScopeObject(),argument)
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
                                _assignModelValue(
                                    componentObject._getScopeObject(),
                                    argument,
                                    newevaluated
                                )
                                return 
                            }
                            if (target.type==='time') {
                                const newevaluated = new Resolver()._resolveExpression(componentObject._getScopeObject(),argument)
                                const [shour,sminute] = target.value.split(':')
                                const hour = parseInt(shour)
                                const minute = parseInt(sminute)
                                if (!(newevaluated instanceof Date)) {
                                    throw new Error(`strawberry.js: [RenderError] Models assigned to Date and/or Time elements must be instance of Date object`)
                                }
                                newevaluated.setHours(hour)
                                newevaluated.setMinutes(minute)
                                _assignModelValue(
                                    componentObject._getScopeObject(),
                                    argument,
                                    newevaluated
                                )
                                return
                            }
                            _assignModelValue(
                                componentObject._getScopeObject(),
                                argument,
                                (isValueStringType) ? target.value : target.checked
                            )
                        } 
                        if (target instanceof HTMLSelectElement) {
                            _assignModelValue(
                                componentObject._getScopeObject(),
                                argument,
                                target.value
                            )
                        }
                    })
                }

                if (element.tagName==='TEXTAREA'&&(element instanceof HTMLTextAreaElement)) {
                    (evaluated===undefined) ?
                        _assignModelValue(componentObject._getScopeObject(),argument,element.value) :
                        element.value = evaluated
                        
                    element.addEventListener('change',()=>{
                        _assignModelValue(
                            componentObject._getScopeObject(),
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