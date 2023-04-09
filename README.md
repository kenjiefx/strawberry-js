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
    })
</script>
<section xstrawberry="app">
    <div xcomponent="@ProfileCard">
        {{message()}} // Prints "Hello world!"
    </div>
</section>
```
