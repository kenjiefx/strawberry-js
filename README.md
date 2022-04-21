# strawberry-js
A lightweight Javascript library that gives a sweet, organized way to manipulate data within the DOM.

![](https://cdn.shopify.com/s/files/1/0560/7466/6159/files/carbon_1.png?v=1650539144)

### Beta Version
Beta Version 1.0.9 is released!
```
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/kenjiefx/strawberry-js/dist/strawberry.v1.0.9.min.js"></script>
```


## API 
### Creating application instance
To start up a new project, use the `create` method of our strawberry object, with the name of the application as your first argument
```
strawberry.create('app');
```

### Scopes
Scope allows you to bind an object to elements and components in your application. It defines the context at which it's properties are bind into and the execution context of its method. 
```
strawberry.create('app');
app.scope('profile',()=>{});
```
To bind this scope to an element in your DOM, use the `xscope` attribute with the name of the scope created as its value
```
<section xscope="profile"></section>
```

#### Scope properties and methods 
To assign properties and methods to the scope object, we need to inject the scope object (referenced as `$scope`) itself to the callback function of the scope method
```
app.scope('profile',($scope)=>{
  $scope.firstName = 'Kenjie';
  $scope.lastName=()=>{
    return 'Terrado';
  }
  $scope.displayMessage=(message)=>{
    return message;
  }
});
```
And then you can use the declared properties and methods in its corresponding element using a placehoder
```
<section xscope="profile">
  {{displayMessage('Hello World!')}}           // Hello World! 
  I'm {{firstName}} {{lastName()}}             // Kenjie Terrado
  I have {{1+1}} hands!                        // I have 2 hands!
</section>
```

### Factories
Factory lets you create an object that can be used in different scopes in your application.
```
strawberry.create('app');
app.factory('user',()=>{
  return {
    firstName: Kenjie, 
    lastName: Terrado
  }
});
```
To use the object, it has to be injected to the scope by adding it as one of the arguments: 
```
app.scope('profile',($scope, user)=>{
  $scope.firstName = user.firstName;
  $scope.lastName = user.lastName;
});
```

### Services 
Unlike factories, services are executed at the context of the scope 
(Explanation to be followed) 

### Presets 
Allows to automatically add a dependecy as property of the scope object
(Explanation to be followed) 
```
app.scope('profileScope',['User'],($scope)=>{});
```

### Built-in Services 
* $patch -
* $hide -
* $switch -
* $show -
* $http -
* $enable -
* $disable -


#### If Statements (`xif`) 
NOTE: When the given condition is false, the element is being commented out!
```
<div xif="profile.name=='Kenjie'"> This shows up if $scope.profile.name is Kenjie. </div>
<div xif="test==false"> This shows up if $scope.test is false. </div>
<div xif="userId is null"> This shows up if $scope.userId is null. </div>
<div xif="userId is not null"> This shows up if $scope.userId is NOT null. </div>
```
#### Components (`xcomponent`) 
```
Load an external component 
<header xcomponent="Components.header"></header>

<script>
    app.scope('myTestScope',($scope)=>{
    $scope.Components.header = '/components/header.htm';
});
</script>
```
#### Repeatable Elements (`xrepeat`) 
#### Switching Elements (`xswitch`) 
#### Hide Elements (`xhide`) 
#### Click Event Bind (`xclick`) 
#### Change Event Bind (`xchange`) 
#### Disable Form Elements (`xdisable`) 
#### Form Models (`xmodel`) 
#### Required Dependency Declarations (`xrequire`)

