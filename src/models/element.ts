export class StrawberryElement {
    static getXValue(element:Element,prefix:string,attributeName:string){
        const resolvedAttrName = prefix+attributeName
        return element.getAttribute(resolvedAttrName)
    }
}