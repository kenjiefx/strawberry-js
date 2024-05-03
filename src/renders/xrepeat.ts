import { REPEAT_ELEMENT_ATTR, REPEAT_REFERENCE_TOKEN, __AttributeHelper } from "../helpers/attributes"
import { __copyBindElement, __createTemporaryElement } from "../helpers/element.helpers"
import { __StrawberryComponent } from "../models/component"
import { __Resolver } from "../models/resolver"
import { __StrawberryApp } from "../models/strawberry"
import { __renderHelper } from "./zrender"

/** Converts repeat expression into two entites: refObjName and aliasObjName  */
function __dissectRepeatExpression(expression:string){
    if (expression.includes('until '))
        return [REPEAT_REFERENCE_TOKEN,expression.split('until')[1].trim()]

    return [
        expression.split(' as ')[0].trim(),
        expression.split(' as ')[1].trim()
    ]
}

export function __repeatHelper(targetElement:Element,componentObject:__StrawberryComponent,appInstance:__StrawberryApp):Promise<null>{
    return new Promise(async (resolve,reject)=>{
        try {
            
            /** Retrieving all repeatable elements */
            const repeatableElements = __AttributeHelper.__getElementByXAttribute(
                targetElement,
                appInstance,
                REPEAT_ELEMENT_ATTR
            )

            const scopeObject = componentObject.__getScopeObject()

            if (scopeObject===null) return resolve(null)

            /** Looping through repeatable elements */ 
            for (let i = 0; i < repeatableElements.length; i++) {
                let repeatableElement = repeatableElements[i]
                let htmlTemplate = repeatableElement.innerHTML

                repeatableElement.innerHTML = ''

                let expression = __AttributeHelper.__getXValueFromElAttr(
                    repeatableElement,
                    appInstance.__getConfiguration().prefix,
                    REPEAT_ELEMENT_ATTR
                )

                if (expression===null) continue

                let [refObjName,aliasObjName] = __dissectRepeatExpression(expression)

                if (refObjName===REPEAT_REFERENCE_TOKEN) {

                    // This creates a new object that we can loop through
                    let repetitions = (new __Resolver().__resolveExpression(scopeObject,aliasObjName))
        
                    // How many repitions are to be made
                    let repeatTimes = 0
                    if (repetitions instanceof Array) repeatTimes = repetitions.length
                    if (Number.isInteger(repetitions)) repeatTimes = repetitions
        
                    scopeObject.$$index = {}
                    let k = 0
                    while (k<repeatTimes) scopeObject.$$index['props'+(k++)] = new Object
        
                }

                const repeatableObject = new __Resolver().__resolveExpression(scopeObject,refObjName)

                if (undefined!==repeatableObject&&null!==repeatableObject) {
                    let j = 0
                    for (const [key, value] of Object.entries(repeatableObject)) {
                        // Creating an invidual component for each repititions
                        let childTempComponent = new __StrawberryComponent()

                        childTempComponent.__setScopeObject({
                            $parent: scopeObject,
                            $index: j++,
                            [aliasObjName]: repeatableObject[key]
                        })
        
                        const childRepeatElement = __createTemporaryElement()
                        childRepeatElement.innerHTML = htmlTemplate

                        await __renderHelper(
                            childRepeatElement,
                            childTempComponent,
                            appInstance,
                            true
                        )

                        __copyBindElement(
                            childRepeatElement,
                            repeatableElement
                        )
                        
                    }
                }
            }

            resolve(null)
            
        } catch (error) {
            reject(error)
        }
    })
}