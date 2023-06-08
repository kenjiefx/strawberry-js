# strawberry-js
A lightweight Javascript library that gives a sweet, organized way to manipulate data within the DOM.

![](https://cdn.shopify.com/s/files/1/0560/7466/6159/files/preview.strawberry-js.png?v=1665496143)

### Beta Version
Beta Version 1.0.0 is released! 
```
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/kenjiefx/strawberry-js@1.0.0/strawberry.min.js"></script>
```

## Basic Structure 

### Components 
Components in strawberry.js are sections of your app which are encapsulated and has its own scope. They are registered and rendered at page load. To register a component, check this example: 

```
<script type="text/javascript">
    const app = strawberry.create('app')
    app.component('ProfileCard',($scope)=>{
        $scope.message = 'Hello world!'
    })
</script>
<section xstrawberry="app">
    <div xcomponent="@ProfileCard">
        {{message}} // Prints "Hello world!"
    </div>
</section>
```
Notice that components are referenced in HTML in the format @COMPONENT_NAME. Later, we'll learn as to why some strawberry x-attributes are prefixed with @. 

#### $scope 
The `$scope` is an object that binds into the placeholders in your component HTML. In the example above, the `{{message}}` placeholder is bound to `$scope.message`. You can also bind functions and objects into the placeholders. 
```
<script type="text/javascript">
    const app = strawberry.create('app')
    app.component('ProfileCard',($scope)=>{
        $scope.printMessage=()=>{
            return 'Hello world!'
        }
    })
</script>
<section xstrawberry="app">
    <div xcomponent="@ProfileCard">
        {{message()}} // Prints "Hello world!"
    </div>
</section>
```
Note that the scope does not bleed out from its component. The `$scope` object facilitates data binding by allowing you to define variables and properties that hold data within the component. These variables can be accessed and utilized in the associated HTML view. 

The `$scope` can be bound to functions, objects, or variables. Within the placeholders, you can also perform operations. 
```
<script type="text/javascript">
    const app = strawberry.create('app')
    app.component('ProfileCard',($scope)=>{
        $scope.printMessage=()=>{
            return 'Hello world!'
        }
        $scope.user = {
            firstName: 'John'
        }
        $scope.age = 24
    })
</script>
<section xstrawberry="app">
    <div xcomponent="@ProfileCard">
        {{message()}} // Prints "Hello world!"
        {{user.firstName}} // Prints "John"
        {{age+2}} // Prints "26"
    </div>
</section>
```
#### Change Detection 
StrawberryJS does not have automatic change detection. This means that changes to the $scope object will not automatically trigger updates in the HTML view. Instead, you are in control of when to update the UI by manually calling the $patch() function which will be discussed later in this article. 

