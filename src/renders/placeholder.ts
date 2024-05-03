import { __StrawberryComponent } from "../models/component"
import { __Resolver } from "../models/resolver"
import { __StrawberryApp } from "../models/strawberry"

export function __placeholderRenderer (targetElement:Element,componentObject:__StrawberryComponent,appInstance:__StrawberryApp):Promise<null>{
    return new Promise((resolve,reject)=>{
        try {
            const regularExpression = /(?<=\{{).+?(?=\}})/g
            let template = targetElement.innerHTML

            targetElement.innerHTML = ''

            /** Match all regex in the innerHTML string of the element **/
            const allMatchedData = template.match(regularExpression)

            /** When there are matches */
            if (allMatchedData!==null) {
                for (var i = 0; i < allMatchedData.length; i++) {
                    const scopeObject = componentObject.__getScopeObject()
                    if (scopeObject===null) return
                    let resolvedExpression = new __Resolver().__resolveExpression(scopeObject,allMatchedData[i].trim())
                    if (resolvedExpression===undefined) {
                        resolvedExpression='';
                    }
                    template = template.replace('{{'+allMatchedData[i]+'}}',resolvedExpression)
                }
            }

            targetElement.innerHTML = template

            resolve(null)

        } catch (error) {
            reject(error)
        }
    })
}