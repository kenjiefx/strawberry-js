export class ComponentRegistry {
    private registry: {[key:string]:StrawberryComponent}
    constructor(){
        this.registry = {}
    }
    register({key,component}:{key:string,component:StrawberryComponent}){
        this.registry[key] = component
    }
    getRegistry(){
        return this.registry
    }
}

export class ComponentLibrary {
    registry: {[componentName:string]:{
        template: string|null,
        handler: ()=>any|null
    }}
    constructor(){
        this.registry = {}
    }
    registerTemplate({componentName,template}:{componentName:string,template:string}) {
        this.createInstance(componentName)
        if (this.registry[componentName].template===null) {
            this.registry[componentName].template = template
        }
    }
    registerHandler({componentName,handler}:{componentName:string,handler:()=>any}){
        this.createInstance(componentName)
        if (this.registry[componentName].handler===null) {
            this.registry[componentName].handler = handler
        }
    }
    getTemplate(componentName:string){
        if (!this.registry.hasOwnProperty[componentName]) return null
        return this.registry[componentName].template
    }
    getHandler(componentName:string){
        if (!this.registry.hasOwnProperty(componentName)) return null
        return this.registry[componentName].handler
    }
    private createInstance(componentName:string){
        if (!this.registry.hasOwnProperty(componentName)) {
            this.registry[componentName] = {
                template: null,
                handler: null
            }
        }
    }
}


export class StrawberryComponent {
    private id:string 
    private name:string 
    constructor(){
        this.id = 'unset'
        this.name = 'unset'
    }
    setId(id:string){
        this.id = id
        return this
    }
    setName(name:string){
        this.name = name
        return this
    }
    getName() {
        return this.name
    }
}