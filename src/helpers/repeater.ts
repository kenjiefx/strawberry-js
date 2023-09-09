import { StrawberryComponent } from "../models/component"
import { Resolver } from "../models/resolver";
import { StrawberryApp } from "../models/strawberry.app"
import { AttributeHelper, REPEAT_ELEMENT_ATTR, REPEAT_REFERENCE_TOKEN } from "./attributes";
import { copyBindElement, createTemporaryElement } from "./element.helpers";
import { renderHelper } from "./render";

/** Converts repeat expression into two entites: refObjName and aliasObjName  */
function dissectRepeatExpression(expression:string){
    if (expression.includes('until '))
        return [REPEAT_REFERENCE_TOKEN,expression.split('until')[1].trim()]

    return [
        expression.split(' as ')[0].trim(),
        expression.split(' as ')[1].trim()
    ]
}

export function repeatHelper(args:{targetElement:Element,componentObject:StrawberryComponent,appInstance:StrawberryApp}):Promise<null>{
    return new Promise(async (resolve,reject)=>{
        try {
            
            /** Retrieving all repeatable elements */
            const repeatableElements = AttributeHelper.getElementByXAttribute({
                element: args.targetElement,
                appInstance: args.appInstance,
                attributeName: REPEAT_ELEMENT_ATTR
            })

            const scopeObject = args.componentObject.getScopeObject()

            /** Looping through repeatable elements */ 
            for (let i = 0; i < repeatableElements.length; i++) {
                let repeatableElement = repeatableElements[i]
                let htmlTemplate = repeatableElement.innerHTML

                repeatableElement.innerHTML = ''

                let expression = AttributeHelper.getXValueFromElAttr({
                    element: repeatableElement,
                    prefix: args.appInstance.getConfig().prefix,
                    attributeName: REPEAT_ELEMENT_ATTR
                })

                let [refObjName,aliasObjName] = dissectRepeatExpression(expression)

                if (refObjName===REPEAT_REFERENCE_TOKEN) {

                    // This creates a new object that we can loop through
                    let repetitions = (new Resolver().expression(scopeObject,aliasObjName))
        
                    // How many repitions are to be made
                    let repeatTimes = 0
                    if (repetitions instanceof Array) repeatTimes = repetitions.length
                    if (Number.isInteger(repetitions)) repeatTimes = repetitions
        
                    scopeObject.$$index = {}
                    let k = 0
                    while (k<repeatTimes) scopeObject.$$index['props'+(k++)] = new Object
        
                }

                const repeatableObject = new Resolver().expression(scopeObject,refObjName)
                if (undefined!==repeatableObject&&null!==repeatableObject) {
                    let j = 0
                    for (const [key, value] of Object.entries(repeatableObject)) {
                        // Creating an invidual component for each repititions
                        let childTempComponent = new StrawberryComponent()
                        childTempComponent.setScopeObject({
                            $parent: scopeObject,
                            $index: j++
                        })
        
                        const childRepeatElement = createTemporaryElement()
                        childRepeatElement.innerHTML = htmlTemplate

                        await renderHelper({
                            targetElement: childRepeatElement,
                            componentObject: childTempComponent,
                            appInstance: args.appInstance
                        })

                        copyBindElement({
                            bindFrom: childRepeatElement,
                            bindTo: repeatableElement
                        })
                        
                    }
                }
                
                //console.log(expression)
            }

            resolve(null)
            
        } catch (error) {
            reject(error)
        }
    })
}