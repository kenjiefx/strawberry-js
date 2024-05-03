
/**
 * Serves as a proxy or intermediary for interacting with a HTML document implementation,
 * abstract the details of creating, modifying, or managing documents.
 */
export class __DocumentImplementationProxy {
    __implementation: Document
    constructor(name:string){
        this.__implementation = document.implementation.createHTMLDocument(name)
    }
}