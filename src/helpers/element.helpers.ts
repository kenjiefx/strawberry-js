import { StrawberryApp } from "../models/strawberry.app"
import { AttributeHelper } from "./attributes"

export function cleanChildComponents(args:{component:Element,childComponentIds:Array<string>,appInstance:StrawberryApp}){
    for (let i = 0; i < args.childComponentIds.length; i++) {
        const childComponentId = args.childComponentIds[i]
        AttributeHelper.getElementByXId({
            element: args.component,
            appInstance: args.appInstance,
            xid: childComponentId
        }).innerHTML = ''
    }
}

export function createTemporaryElement(){
    return document.implementation.createHTMLDocument().body
}

export function copyBindElement(args:{bindFrom:Element,bindTo:Element}) {
    if (args.bindFrom===null) return 
    while (args.bindFrom.childNodes.length > 0) {
        args.bindTo.appendChild(args.bindFrom.childNodes[0])
    }
}


export function patchElement(args:{patchFrom:Element,patchTO:Element}){
    
}


