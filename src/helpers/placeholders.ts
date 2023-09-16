import { StrawberryComponent } from "../models/component";
import { Resolver } from "../models/resolver";
import { StrawberryApp } from "../models/strawberry.app";

export function placeholderHelper(targetElement:Element,componentObject:StrawberryComponent,appInstance:StrawberryApp):Promise<null>{
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
                    let resolvedExpression = new Resolver()._resolveExpression(componentObject._getScopeObject(),allMatchedData[i].trim())
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