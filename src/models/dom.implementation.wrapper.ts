export class DomImplementationWrapper {
    implementation: Document
    constructor(name:string){
        this.implementation = document.implementation.createHTMLDocument(name)
    }
}